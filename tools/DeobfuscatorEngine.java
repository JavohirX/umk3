import org.objectweb.asm.*;
import org.objectweb.asm.commons.*;
import org.objectweb.asm.tree.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.jar.*;

public class DeobfuscatorEngine {

    public static final Map<String, String> CLASS_MAP = new LinkedHashMap<>();
    public static final Map<String, String> FIELD_MAP = new HashMap<>();
    public static final Map<String, String> METHOD_MAP = new HashMap<>();

    public static void loadMappings(File mapFile) throws IOException {
        if (!mapFile.exists()) {
            System.err.println("Mapping file not found: " + mapFile.getAbsolutePath());
            return;
        }
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(mapFile), StandardCharsets.UTF_8))) {
            String line;
            String section = "";
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;
                if (line.startsWith("[") && line.endsWith("]")) {
                    section = line;
                    continue;
                }
                int eq = line.indexOf('=');
                if (eq < 0) continue;
                String k = line.substring(0, eq).trim();
                String v = line.substring(eq + 1).trim();
                if ("[classes]".equalsIgnoreCase(section)) {
                    CLASS_MAP.put(k, v);
                } else if ("[methods]".equalsIgnoreCase(section)) {
                    METHOD_MAP.put(k, v);
                } else if ("[fields]".equalsIgnoreCase(section)) {
                    FIELD_MAP.put(k, v);
                }
            }
        }
        System.out.println("Loaded mappings from " + mapFile.getName() + ":");
        System.out.println("  Classes: " + CLASS_MAP.size());
        System.out.println("  Methods: " + METHOD_MAP.size());
        System.out.println("  Fields:  " + FIELD_MAP.size());
    }

    public static void main(String[] args) throws Exception {
        File inJar = new File(args.length > 0 ? args[0] : "Ultimate_Mortal_Kombat_3_352.jar");
        File outJar = new File(args.length > 1 ? args[1] : "Ultimate_Mortal_Kombat_3_deobf.jar");
        File mapFile = new File(args.length > 2 ? args[2] : "tools/mappings.txt");

        loadMappings(mapFile);

        Map<String, byte[]> rawClasses = new HashMap<>();
        Map<String, byte[]> resources = new HashMap<>();

        try (JarFile jar = new JarFile(inJar)) {
            Enumeration<JarEntry> en = jar.entries();
            while (en.hasMoreElements()) {
                JarEntry e = en.nextElement();
                String name = e.getName();
                byte[] data;
                try (InputStream is = jar.getInputStream(e)) {
                    data = is.readAllBytes();
                }
                if (name.endsWith(".class")) {
                    String cname = name.substring(0, name.length() - 6);
                    rawClasses.put(cname, data);
                } else {
                    resources.put(name, data);
                }
            }
        }

        // PASS 1: Read all ClassNodes
        Map<String, ClassNode> nodes = new HashMap<>();
        for (Map.Entry<String, byte[]> entry : rawClasses.entrySet()) {
            ClassReader cr = new ClassReader(entry.getValue());
            ClassNode cn = new ClassNode();
            cr.accept(cn, 0);
            nodes.put(entry.getKey(), cn);
        }

        // Custom Remapper
        Remapper remapper = new Remapper() {
            @Override
            public String map(String internalName) {
                return CLASS_MAP.getOrDefault(internalName, internalName);
            }

            @Override
            public String mapFieldName(String owner, String name, String descriptor) {
                String key = owner + "." + name + " " + descriptor;
                if (FIELD_MAP.containsKey(key)) {
                    return FIELD_MAP.get(key);
                }
                return name;
            }

            @Override
            public String mapMethodName(String owner, String name, String descriptor) {
                String key = owner + "." + name + " " + descriptor;
                if (METHOD_MAP.containsKey(key)) {
                    return METHOD_MAP.get(key);
                }
                return name;
            }
        };

        // PASS 2: Transform, apply remapper, and make everything public
        try (JarOutputStream jos = new JarOutputStream(new FileOutputStream(outJar))) {
            for (Map.Entry<String, ClassNode> entry : nodes.entrySet()) {
                ClassNode cn = entry.getValue();

                // If class was interface with static initializer, convert to public class!
                boolean isStaticTable = (cn.access & Opcodes.ACC_INTERFACE) != 0 && hasClinit(cn);
                if (isStaticTable) {
                    cn.access = (cn.access & ~Opcodes.ACC_INTERFACE) | Opcodes.ACC_PUBLIC | Opcodes.ACC_SUPER;
                    cn.superName = "java/lang/Object";

                    // Add empty public constructor <init>()
                    MethodNode init = new MethodNode(Opcodes.ACC_PUBLIC, "<init>", "()V", null, null);
                    init.instructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                    init.instructions.add(new MethodInsnNode(Opcodes.INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false));
                    init.instructions.add(new InsnNode(Opcodes.RETURN));
                    init.maxStack = 1;
                    init.maxLocals = 1;
                    cn.methods.add(init);
                } else {
                    cn.access = (cn.access & ~Opcodes.ACC_PRIVATE & ~Opcodes.ACC_PROTECTED) | Opcodes.ACC_PUBLIC;
                }

                // Make all fields public
                for (FieldNode fn : cn.fields) {
                    fn.access = (fn.access & ~Opcodes.ACC_PRIVATE & ~Opcodes.ACC_PROTECTED) | Opcodes.ACC_PUBLIC;
                    if (isStaticTable) {
                        fn.access |= Opcodes.ACC_STATIC;
                    }
                }

                // Make all methods public
                for (MethodNode mn : cn.methods) {
                    mn.access = (mn.access & ~Opcodes.ACC_PRIVATE & ~Opcodes.ACC_PROTECTED) | Opcodes.ACC_PUBLIC;
                }

                // Apply Remapper
                ClassWriter cw = new ClassWriter(0);
                ClassRemapper cr = new ClassRemapper(cw, remapper);
                cn.accept(cr);
                byte[] transformed = cw.toByteArray();

                String newClassName = remapper.map(entry.getKey());
                JarEntry je = new JarEntry(newClassName + ".class");
                jos.putNextEntry(je);
                jos.write(transformed);
                jos.closeEntry();
            }

            // Write resources and manifest
            for (Map.Entry<String, byte[]> res : resources.entrySet()) {
                String rname = res.getKey();
                JarEntry je = new JarEntry(rname);
                jos.putNextEntry(je);
                byte[] data = res.getValue();
                if ("META-INF/MANIFEST.MF".equals(rname)) {
                    String str = new String(data, StandardCharsets.UTF_8);
                    str = str.replace(", ac", ", GameMidletLoop");
                    data = str.getBytes(StandardCharsets.UTF_8);
                }
                jos.write(data);
                jos.closeEntry();
            }
        }

        System.out.println("Deobfuscated JAR created: " + outJar.getAbsolutePath());
    }

    private static boolean hasClinit(ClassNode cn) {
        for (MethodNode mn : cn.methods) {
            if ("<clinit>".equals(mn.name)) return true;
        }
        return false;
    }
}
