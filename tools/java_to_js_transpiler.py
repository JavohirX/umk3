import os
import re
from collections import defaultdict
import javalang

# Fix javalang bug: default: dropped when preceded by case labels
def _patched_parse_switch_block_statement_group(self):
    labels = list()
    statements = list()

    while True:
        case_type = self.tokens.next().value
        case_value = None

        if case_type == 'case':
            if self.would_accept(javalang.parser.Identifier, ':'):
                case_value = self.parse_identifier()
            else:
                case_value = self.parse_expression()
            labels.append(case_value)
        elif case_type == 'default':
            labels.append(None)
        else:
            self.illegal('Expected switch case')

        self.accept(':')

        if self.tokens.look().value not in ('case', 'default'):
            break

    while self.tokens.look().value not in ('case', 'default', '}'):
        statement = self.parse_block_statement()
        statements.append(statement)

    return javalang.tree.SwitchStatementCase(case=labels, statements=statements)

javalang.parser.Parser.parse_switch_block_statement_group = _patched_parse_switch_block_statement_group

class JavaToJsTranspiler:
    def __init__(self, class_symbols):
        self.class_symbols = class_symbols
        self.current_class = None
        self.current_method = None
        self.local_scopes = []  # stack of sets of local variable/parameter names

    def push_scope(self):
        self.local_scopes.append(set())

    def pop_scope(self):
        self.local_scopes.pop()

    def add_local(self, name):
        if self.local_scopes:
            self.local_scopes[-1].add(name)

    def is_local(self, name):
        for s in reversed(self.local_scopes):
            if name in s:
                return True
        return False

    def transpile_compilation_unit(self, cu):
        lines = []
        for t in cu.types:
            if isinstance(t, javalang.tree.ClassDeclaration):
                lines.append(self.transpile_class(t))
            elif isinstance(t, javalang.tree.InterfaceDeclaration):
                lines.append(self.transpile_interface(t))
        return "\n\n".join(lines)

    def transpile_interface(self, iface):
        name = iface.name
        code = [f"export class {name} {{"]
        for m in iface.methods:
            params = ", ".join(p.name for p in m.parameters)
            code.append(f"    {m.name}({params}) {{}}")
        code.append("}")
        return "\n".join(code)

    def transpile_class(self, cls):
        self.current_class = cls.name
        self.push_scope()
        lines = []

        extends_clause = ""
        if cls.extends:
            ext_name = cls.extends.name if hasattr(cls.extends, 'name') else str(cls.extends)
            # Map J2ME base classes if needed
            extends_clause = f" extends {ext_name}"

        lines.append(f"export class {cls.name}{extends_clause} {{")

        # Static fields
        static_inits = []
        for f in cls.fields:
            is_stat = 'static' in f.modifiers
            for d in f.declarators:
                field_name = d.name
                if d.initializer:
                    init_expr = self.format_expr(d.initializer)
                    if is_stat:
                        lines.append(f"    static {field_name} = {init_expr};")
                    else:
                        lines.append(f"    {field_name} = {init_expr};")
                else:
                    def_val = "null"
                    tname = f.type.name if hasattr(f.type, 'name') else ''
                    if f.type.dimensions:
                        def_val = "null"
                    elif tname in ('int', 'byte', 'short', 'long', 'char'):
                        def_val = "0"
                    elif tname == 'boolean':
                        def_val = "false"
                    else:
                        def_val = "null"

                    if is_stat:
                        lines.append(f"    static {field_name} = {def_val};")
                    else:
                        lines.append(f"    {field_name} = {def_val};")

        # Static blocks and fields in cls.body
        for item in cls.body:
            if isinstance(item, list):
                self.push_scope()
                body = self.format_block_body(item, "        ")
                self.pop_scope()
                lines.append(f"    static {{\n{body}\n    }}")
        if cls.constructors:
            lines.append(self.transpile_constructors(cls.constructors, cls))
        elif cls.extends:
            # default constructor with super
            pass

        # Methods
        methods_by_name = defaultdict(list)
        for m in cls.methods:
            methods_by_name[m.name].append(m)

        for mname, mlist in methods_by_name.items():
            if len(mlist) == 1:
                lines.append(self.transpile_method(mlist[0]))
            else:
                lines.append(self.transpile_overloaded_methods(mname, mlist))

        lines.append("}")
        lines.append(f"globalThis.{cls.name} = {cls.name};")
        self.pop_scope()
        self.current_class = None
        return "\n".join(lines)

    def transpile_constructors(self, constructors, cls):
        if len(constructors) == 1:
            c = constructors[0]
            self.push_scope()
            for p in c.parameters:
                self.add_local(p.name)
            params = ", ".join(p.name for p in c.parameters)
            body = self.format_block_body(c.body)
            self.pop_scope()
            
            # Check if super() is required
            if cls.extends and not any(isinstance(s, javalang.tree.ExplicitConstructorInvocation) or 
                                       isinstance(s, javalang.tree.SuperConstructorInvocation) for s in c.body):
                return f"    constructor({params}) {{\n        super();\n{body}\n    }}"
            return f"    constructor({params}) {{\n{body}\n    }}"

        # Overloaded constructors: create dispatcher
        out = []
        out.append("    constructor(...args) {")
        if cls.extends:
            out.append("        super();")
        
        # Sort by param count descending
        sorted_cons = sorted(constructors, key=lambda c: len(c.parameters))
        
        for idx, c in enumerate(sorted_cons):
            conds = []
            conds.append(f"args.length === {len(c.parameters)}")
            # Add type checks if multiple constructors share param count
            same_len = [other for other in constructors if len(other.parameters) == len(c.parameters)]
            if len(same_len) > 1 and len(c.parameters) > 0:
                p0 = c.parameters[0]
                p0_type = p0.type.name if hasattr(p0.type, 'name') else str(p0.type)
                if p0_type == 'String':
                    conds.append("typeof args[0] === 'string'")
                elif p0_type in ('int', 'byte', 'short', 'long'):
                    conds.append("typeof args[0] === 'number'")
                elif p0_type in ('byte[]', 'short[]', 'int[]') or getattr(p0.type, 'dimensions', None):
                    conds.append("(Array.isArray(args[0]) || ArrayBuffer.isView(args[0]))")

            cond_str = " && ".join(conds)
            branch = "if" if idx == 0 else "else if"
            arg_list = ", ".join(f"args[{i}]" for i in range(len(c.parameters)))
            out.append(f"        {branch} ({cond_str}) {{")
            out.append(f"            this._init_{idx}({arg_list});")
            out.append("        }")

        out.append("    }")

        for idx, c in enumerate(sorted_cons):
            self.push_scope()
            for p in c.parameters:
                self.add_local(p.name)
            params = ", ".join(p.name for p in c.parameters)
            body = self.format_block_body(c.body)
            self.pop_scope()
            out.append(f"    _init_{idx}({params}) {{\n{body}\n    }}")

        return "\n".join(out)

    def transpile_method(self, m):
        self.current_method = m
        self.push_scope()
        is_stat = 'static' in m.modifiers
        prefix = "static " if is_stat else ""
        
        params = []
        for p in m.parameters:
            self.add_local(p.name)
            params.append(p.name)
        param_str = ", ".join(params)

        if m.body is None:
            # abstract or interface method
            self.pop_scope()
            self.current_method = None
            return f"    {prefix}{m.name}({param_str}) {{}}"

        body = self.format_block_body(m.body)
        self.pop_scope()
        self.current_method = None
        return f"    {prefix}{m.name}({param_str}) {{\n{body}\n    }}"

    def transpile_overloaded_methods(self, name, methods):
        is_stat = 'static' in methods[0].modifiers
        prefix = "static " if is_stat else ""
        out = []
        out.append(f"    {prefix}{name}(...args) {{")

        sorted_m = sorted(methods, key=lambda m: len(m.parameters))
        for idx, m in enumerate(sorted_m):
            branch = "if" if idx == 0 else "else if"
            arg_list = ", ".join(f"args[{i}]" for i in range(len(m.parameters)))
            call_target = f"this._{name}_{idx}" if not is_stat else f"{self.current_class}._{name}_{idx}"
            out.append(f"        {branch} (args.length === {len(m.parameters)}) {{")
            out.append(f"            return {call_target}({arg_list});")
            out.append("        }")

        max_m_idx = len(sorted_m) - 1
        arg_list_max = ", ".join(f"args[{i}]" for i in range(len(sorted_m[max_m_idx].parameters)))
        call_target_max = f"this._{name}_{max_m_idx}" if not is_stat else f"{self.current_class}._{name}_{max_m_idx}"
        out.append(f"        return {call_target_max}({arg_list_max});")
        out.append("    }")

        for idx, m in enumerate(sorted_m):
            self.current_method = m
            self.push_scope()
            params = []
            for p in m.parameters:
                self.add_local(p.name)
                params.append(p.name)
            param_str = ", ".join(params)
            if m.body is None:
                body = ""
            else:
                body = self.format_block_body(m.body)
            self.pop_scope()
            self.current_method = None
            out.append(f"    {prefix}_{name}_{idx}({param_str}) {{\n{body}\n    }}")

        return "\n".join(out)

    def format_block_body(self, statements, indent="        "):
        if not statements:
            return ""
        lines = []
        for stmt in statements:
            lines.append(self.format_statement(stmt, indent))
        return "\n".join(lines)

    def format_statement(self, stmt, indent="        "):
        if isinstance(stmt, list):
            return "\n".join(self.format_statement(s, indent) for s in stmt)
        stype = type(stmt).__name__

        label_prefix = f"{stmt.label}: " if getattr(stmt, 'label', None) else ""

        if stype == 'BlockStatement':
            body = self.format_block_body(stmt.statements, indent + "    ")
            return f"{indent}{label_prefix}{{\n{body}\n{indent}}}"

        elif stype == 'IfStatement':
            cond = self.format_expr(stmt.condition)
            then_code = self.format_statement_inline(stmt.then_statement, indent)
            res = f"{indent}{label_prefix}if ({cond}) {then_code}"
            if stmt.else_statement:
                else_code = self.format_statement_inline(stmt.else_statement, indent)
                res += f" else {else_code}"
            return res

        elif stype == 'WhileStatement':
            cond = self.format_expr(stmt.condition)
            body = self.format_statement_inline(stmt.body, indent)
            return f"{indent}{label_prefix}while ({cond}) {body}"

        elif stype == 'DoStatement':
            cond = self.format_expr(stmt.condition)
            body = self.format_statement_inline(stmt.body, indent)
            return f"{indent}{label_prefix}do {body} while ({cond});"

        elif stype == 'ForStatement':
            init_str = ""
            if stmt.control:
                if stmt.control.init:
                    if isinstance(stmt.control.init, list):
                        init_str = ", ".join(self.format_expr(e) for e in stmt.control.init)
                    elif isinstance(stmt.control.init, javalang.tree.VariableDeclaration):
                        decls = []
                        for d in stmt.control.init.declarators:
                            self.add_local(d.name)
                            init_val = f" = {self.format_expr(d.initializer)}" if d.initializer else " = 0"
                            decls.append(f"{d.name}{init_val}")
                        init_str = "let " + ", ".join(decls)
                    else:
                        init_str = self.format_expr(stmt.control.init)
                
                cond_str = self.format_expr(stmt.control.condition) if stmt.control.condition else ""
                
                update_str = ""
                if stmt.control.update:
                    update_str = ", ".join(self.format_expr(e) for e in stmt.control.update)
                
                control_str = f"{init_str}; {cond_str}; {update_str}"
            else:
                control_str = "; ; "

            body = self.format_statement_inline(stmt.body, indent)
            return f"{indent}{label_prefix}for ({control_str}) {body}"

        elif stype == 'EnhancedForControl':
            # for (Type var : iterable)
            pass

        elif stype == 'ForStatement' and hasattr(stmt.control, 'var'):
            # Enhanced for
            var_name = stmt.control.var.declarators[0].name
            self.add_local(var_name)
            iterable = self.format_expr(stmt.control.iterable)
            body = self.format_statement_inline(stmt.body, indent)
            return f"{indent}{label_prefix}for (let {var_name} of {iterable}) {body}"

        elif stype == 'SwitchStatement':
            expr = self.format_expr(stmt.expression)
            lines = [f"{indent}{label_prefix}switch ({expr}) {{"]
            for case in stmt.cases:
                if case.case:
                    if isinstance(case.case, list):
                        for c_expr in case.case:
                            if c_expr is None:
                                lines.append(f"{indent}    default:")
                            else:
                                lines.append(f"{indent}    case {self.format_expr(c_expr)}:")
                    else:
                        lines.append(f"{indent}    case {self.format_expr(case.case)}:")
                else:
                    lines.append(f"{indent}    default:")
                if case.statements:
                    for s in case.statements:
                        lines.append(self.format_statement(s, indent + "        "))
            lines.append(f"{indent}}}")
            return "\n".join(lines)

        elif stype == 'BreakStatement':
            target = f" {stmt.goto}" if stmt.goto else ""
            return f"{indent}break{target};"

        elif stype == 'ContinueStatement':
            target = f" {stmt.goto}" if stmt.goto else ""
            return f"{indent}continue{target};"

        elif stype == 'ReturnStatement':
            if stmt.expression:
                return f"{indent}return {self.format_expr(stmt.expression)};"
            return f"{indent}return;"

        elif stype == 'ThrowStatement':
            return f"{indent}throw {self.format_expr(stmt.expression)};"

        elif stype == 'SynchronizedStatement':
            # single-threaded JS: execute block directly
            return self.format_statement(stmt.block, indent)

        elif stype == 'TryStatement':
            block = self.format_statement_inline(stmt.block, indent)
            res = f"{indent}try {block}"
            if stmt.catches:
                for c in stmt.catches:
                    param_name = c.parameter.name
                    self.push_scope()
                    self.add_local(param_name)
                    c_block = self.format_statement_inline(c.block, indent)
                    self.pop_scope()
                    res += f" catch ({param_name}) {c_block}"
            if stmt.finally_block:
                f_block = self.format_statement_inline(stmt.finally_block, indent)
                res += f" finally {f_block}"
            return res

        elif stype == 'StatementExpression':
            return f"{indent}{self.format_expr(stmt.expression)};"

        elif stype == 'LocalVariableDeclaration':
            decls = []
            for d in stmt.declarators:
                self.add_local(d.name)
                if d.initializer:
                    decls.append(f"{d.name} = {self.format_expr(d.initializer)}")
                else:
                    tname = stmt.type.name if hasattr(stmt.type, 'name') else ''
                    if stmt.type.dimensions:
                        def_val = "null"
                    elif tname in ('int', 'byte', 'short', 'long', 'char'):
                        def_val = "0"
                    elif tname == 'boolean':
                        def_val = "false"
                    else:
                        def_val = "null"
                    decls.append(f"{d.name} = {def_val}")
            return f"{indent}let " + ", ".join(decls) + ";"

        elif stype == 'ExplicitConstructorInvocation':
            args = ", ".join(self.format_expr(a) for a in stmt.arguments)
            return f"{indent}this._init_chained({args});"

        elif stype == 'SuperConstructorInvocation':
            args = ", ".join(self.format_expr(a) for a in stmt.arguments)
            return f"{indent}super({args});"

        return f"{indent}/* Unknown stmt: {stype} */;"

    def format_statement_inline(self, stmt, indent):
        if isinstance(stmt, list):
            body = self.format_block_body(stmt, indent + "    ")
            return f"{{\n{body}\n{indent}}}"
        elif isinstance(stmt, javalang.tree.BlockStatement):
            body = self.format_block_body(stmt.statements, indent + "    ")
            return f"{{\n{body}\n{indent}}}"
        else:
            return f"{{\n{self.format_statement(stmt, indent + '    ')}\n{indent}}}"

    def resolve_qualifier(self, qual):
        if not qual:
            return qual
        parts = qual.split('.')
        root = parts[0]
        if self.is_local(root):
            return qual
        if self.current_class:
            c_syms = self.class_symbols.get(self.current_class, {})
            if root in c_syms.get('instance_fields', set()):
                parts[0] = f"this.{root}"
                return '.'.join(parts)
            elif root in c_syms.get('static_fields', set()):
                parts[0] = f"{self.current_class}.{root}"
                return '.'.join(parts)
        return qual

    def format_expr(self, expr):
        if expr is None:
            return "null"

        etype = type(expr).__name__

        # Base expression
        res = ""
        if etype in ('ReferenceType', 'BasicType'):
            res = expr.name
        elif etype == 'Literal':
            val = expr.value
            if val is None or val == 'null':
                res = "null"
            elif val == 'true' or val == 'false':
                res = val
            elif str(val).startswith('"') and str(val).endswith('"'):
                res = val
            elif str(val).startswith("'") and str(val).endswith("'"):
                # Char literal
                if val == "'\\uffff'":
                    res = "0xFFFF"
                elif val == "'/'":
                    res = "'/'"
                elif val == "','":
                    res = "','"
                elif val == "'?'":
                    res = "'?'"
                elif val == "'&'":
                    res = "'&'"
                elif val == "'='":
                    res = "'='"
                elif val == "'0'":
                    res = "48"
                elif val == "'9'":
                    res = "57"
                elif val == "'M'":
                    res = "77"
                elif val == "'T'":
                    res = "84"
                elif len(val) == 3:
                    res = str(ord(val[1]))
                else:
                    res = val
            else:
                # Number literal: strip L, f, d
                s_val = str(val)
                if s_val.lower().startswith('0x'):
                    cleaned = re.sub(r'[lL]$', '', s_val)
                else:
                    cleaned = re.sub(r'[lLfFdD]$', '', s_val)
                res = cleaned

        elif etype == 'MemberReference':
            mem = expr.member
            qual = self.resolve_qualifier(expr.qualifier)
            if qual:
                res = f"{qual}.{mem}"
            else:
                if self.is_local(mem):
                    res = mem
                elif self.current_class:
                    c_syms = self.class_symbols.get(self.current_class, {})
                    if mem in c_syms.get('instance_fields', set()):
                        res = f"this.{mem}"
                    elif mem in c_syms.get('static_fields', set()):
                        res = f"{self.current_class}.{mem}"
                    else:
                        res = f"this.{mem}"
                else:
                    res = mem

        elif etype == 'MethodInvocation':
            mem = expr.member
            qual = self.resolve_qualifier(expr.qualifier)
            args = [self.format_expr(a) for a in expr.arguments]
            arg_str = ", ".join(args)

            if qual:
                if mem == 'getResourceAsStream':
                    res = f"ResourceManager.getResourceAsStream({arg_str})"
                # String.length()
                elif mem == 'length' and len(args) == 0:
                    res = f"{qual}.length"
                elif qual == 'System' and mem == 'currentTimeMillis':
                    res = "Date.now()"
                elif qual == 'System' and mem == 'arraycopy':
                    res = f"System.arraycopy({arg_str})"
                elif qual == 'System' and mem == 'gc':
                    res = "/* System.gc() */"
                elif (qual.startswith('System.out') or qual.startswith('System.err')) and mem in ('println', 'print'):
                    res = f"console.log({arg_str})"
                elif qual == 'Thread' and mem in ('sleep', 'yield'):
                    res = "/* yield */"
                elif qual == 'Math' and mem in ('abs', 'min', 'max', 'sin', 'cos'):
                    res = f"Math.{mem}({arg_str})"
                elif mem == 'getResourceAsStream':
                    res = f"ResourceManager.getResourceAsStream({arg_str})"
                elif mem == 'getClass' and len(args) == 0:
                    res = qual
                else:
                    res = f"{qual}.{mem}({arg_str})"
            else:
                if mem == 'length' and len(args) == 0:
                    res = "this.length"
                elif self.current_class:
                    c_syms = self.class_symbols.get(self.current_class, {})
                    if mem in c_syms.get('static_methods', set()):
                        res = f"{self.current_class}.{mem}({arg_str})"
                    else:
                        res = f"this.{mem}({arg_str})"
                else:
                    res = f"this.{mem}({arg_str})"

        elif etype == 'SuperMethodInvocation':
            mem = expr.member
            args = ", ".join(self.format_expr(a) for a in expr.arguments)
            res = f"super.{mem}({args})"

        elif etype == 'SuperMemberReference':
            res = f"this.{expr.member}"

        elif etype == 'This':
            res = "this"

        elif etype == 'Assignment':
            lhs = self.format_expr(expr.expressionl)
            rhs = self.format_expr(expr.value)
            op = expr.type
            if op == '/=':
                res = f"({lhs} = Math.trunc({lhs} / ({rhs})))"
            else:
                res = f"({lhs} {op} {rhs})"

        elif etype == 'BinaryOperation':
            lhs = self.format_expr(expr.operandl)
            rhs = self.format_expr(expr.operandr)
            op = expr.operator
            if op == '/':
                res = f"Math.trunc(({lhs}) / ({rhs}))"
            elif op == '==':
                res = f"({lhs}) === ({rhs})"
            elif op == '!=':
                res = f"({lhs}) !== ({rhs})"
            else:
                res = f"({lhs} {op} {rhs})"

        elif etype == 'TernaryExpression':
            cond = self.format_expr(expr.condition)
            if_t = self.format_expr(expr.if_true)
            if_f = self.format_expr(expr.if_false)
            res = f"({cond} ? {if_t} : {if_f})"

        elif etype == 'Cast':
            tname = expr.type.name if hasattr(expr.type, 'name') else str(expr.type)
            dims = getattr(expr.type, 'dimensions', None)
            inner = self.format_expr(expr.expression)
            if not dims and tname == 'byte':
                res = f"((({inner}) << 24) >> 24)"
            elif not dims and tname == 'short':
                res = f"((({inner}) << 16) >> 16)"
            elif not dims and tname == 'int':
                res = f"(({inner}) | 0)"
            elif not dims and tname == 'char':
                res = f"(({inner}) & 0xFFFF)"
            else:
                res = f"({inner})"

        elif etype == 'ClassCreator':
            tname = expr.type.name if hasattr(expr.type, 'name') else str(expr.type)
            args = ", ".join(self.format_expr(a) for a in expr.arguments)
            if tname == 'String':
                res = f"makeString({args})"
            elif tname == 'Vector':
                res = "new JVector()"
            elif tname == 'ByteArrayOutputStream':
                res = "new ByteArrayOutputStream()"
            elif tname == 'ByteArrayInputStream':
                res = f"new ByteArrayInputStream({args})"
            elif tname == 'DataOutputStream':
                res = f"new DataOutputStream({args})"
            elif tname == 'DataInputStream':
                res = f"new DataInputStream({args})"
            else:
                res = f"new {tname}({args})"

        elif etype == 'ArrayCreator':
            tname = expr.type.name if hasattr(expr.type, 'name') else str(expr.type)
            if expr.initializer:
                res = self.format_expr(expr.initializer)
            elif expr.dimensions:
                dims = [self.format_expr(d) for d in expr.dimensions if d is not None]
                if any(d is None for d in expr.dimensions):
                    def_val = "null"
                else:
                    def_val = "0" if tname in ('int', 'byte', 'short', 'long', 'char') else ("false" if tname == 'boolean' else "null")
                if len(dims) == 1:
                    res = f"createArray({dims[0]}, {def_val})"
                else:
                    dims_str = f"[{', '.join(dims)}]"
                    res = f"createMultiArray({dims_str}, {def_val})"
            else:
                res = "[]"

        elif etype == 'ArrayInitializer':
            inits = [self.format_expr(e) for e in expr.initializers]
            res = f"[{', '.join(inits)}]"

        elif etype == 'ArraySelector':
            idx = self.format_expr(expr.index)
            res = f"[{idx}]"

        else:
            res = f"/* unhandled expr: {etype} */"

        # Apply selectors
        selectors = getattr(expr, 'selectors', None)
        if selectors:
            for s in selectors:
                stype = type(s).__name__
                if stype == 'ArraySelector':
                    idx = self.format_expr(s.index)
                    res = f"{res}[{idx}]"
                elif stype == 'MethodInvocation':
                    args = ", ".join(self.format_expr(a) for a in s.arguments)
                    if s.member == 'length' and len(s.arguments) == 0:
                        res = f"{res}.length"
                    elif s.member == 'equals':
                        res = f"({res} !== null && {res}.equals({args}))"
                    else:
                        res = f"{res}.{s.member}({args})"
                elif stype == 'MemberReference':
                    res = f"{res}.{s.member}"

        # Prefix operators
        prefix_ops = getattr(expr, 'prefix_operators', None)
        if prefix_ops:
            res = "".join(prefix_ops) + res

        # Postfix operators
        postfix_ops = getattr(expr, 'postfix_operators', None)
        if postfix_ops:
            res = res + "".join(postfix_ops)

        return res
