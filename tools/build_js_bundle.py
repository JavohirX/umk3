import os
import sys
import re
import subprocess
import javalang

# Ensure tools directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from java_to_js_transpiler import JavaToJsTranspiler

SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'main', 'java'))
OUT_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'player', 'js', 'engine', 'umk3.js'))

ORDERED_CLASSES = [
    'EntityInterface',
    'TransformTable',
    'PatternTable',
    'ResourceSlotTable',
    'AudioMetaTable',
    'CharacterPresetTable',
    'SceneBase',
    'AbstractImage',
    'FeatureFlag',
    'ConcreteImage',
    'SpriteImage',
    'RenderContext',
    'GrowableByteBuffer',
    'PackedResourceStream',
    'TokenString',
    'TokenWrapper',
    'GlobalContext',
    'AudioPlaybackContext',
    'AudioClipNode',
    'AudioManager',
    'EffectActor',
    'AsyncWorkerThread',
    'SpritePartSequence',
    'ContextServiceNode',
    'EncodedTextBuffer',
    'GraphicsAdapter',
    'ActorStateMachine',
    'InputManager',
    'MarketPanelController',
    'GameFlowController',
    'AnimationSet',
    'FontCharmap',
    'RootGameState',
    'CoreEngine',
    'MainCanvasBridge',
    'GameMidletLoop'
]

HEADER = """// Ultimate Mortal Kombat 3 - 1:1 Transpiled Native JavaScript Engine
import {
    createArray,
    createMultiArray,
    arraycopy,
    makeString,
    System,
    JVector,
    InputStream,
    ByteArrayInputStream,
    ByteArrayOutputStream,
    DataInputStream,
    DataOutputStream,
    RecordStore,
    ResourceManager,
    Thread,
    Random,
    StringBuffer,
    StringBuilder,
    Integer,
    Short,
    Byte,
    Long
} from '../j2me/runtime.js';

import {
    Graphics,
    Image,
    Displayable,
    Canvas,
    FullCanvas,
    Display,
    MIDlet
} from '../j2me/graphics.js';

import {
    Manager,
    Player,
    VolumeControl
} from '../j2me/audio.js';

// Global environment bindings for J2ME compatibility
globalThis.Integer = Integer;
globalThis.Short = Short;
globalThis.Byte = Byte;
globalThis.Long = Long;
globalThis.Thread = Thread;
globalThis.Random = Random;
globalThis.StringBuffer = StringBuffer;
globalThis.StringBuilder = StringBuilder;
globalThis.System = System;
globalThis.ResourceManager = ResourceManager;
globalThis.Graphics = Graphics;
globalThis.Image = Image;
globalThis.Manager = Manager;
globalThis.RecordStore = RecordStore;
globalThis.createArray = createArray;
globalThis.createMultiArray = createMultiArray;
globalThis.arraycopy = arraycopy;
globalThis.makeString = makeString;
"""

GAME_MIDLET_LOOP_METHODS = """    initLoop() {
        if (!CoreEngine.val_maincanvasbridge_a) {
            CoreEngine.val_maincanvasbridge_a = new MainCanvasBridge();
        }
        CoreEngine.isGlobalPaused = false;
        Display.getDisplay(this).setCurrent(CoreEngine.val_maincanvasbridge_a);
        this.isPaused = false;
        this.lastFrameTimeMs = Date.now();
    }
    run() {
        this.initLoop();
    }
    stepFrame() {
        if (this.isExitRequested) {
            return;
        }
        if (!CoreEngine.val_maincanvasbridge_a) {
            this.initLoop();
        }
        let var1 = Date.now();

        try {
            while ((this.loopState > 0)) {
                let var9 = this.frameHistoryArray;

                let var3 = 0;
                let var4 = 0;
                try {
                    let var37 = this.frameHistoryArray;
                    let entry = BigInt(this.frameHistoryArray[0]);
                    (var3 = Number((entry >> 48n) & 0xFFFFn));
                    if (var3 > 32767) var3 -= 65536;
                    let hi = Number((entry >> 32n) & 0xFFFFn);
                    let lo = Number((entry >> 16n) & 0xFFFFn);
                    (var4 = (hi << 16) | lo);
                    if ((this.loopState > 1)) {
                        for (let var5 = 0; (var5 < 7); var5++) {
                            (var37[var5] = var37[(var5 + 1)]);
                        }
                    }
                    this.loopState--;
                } catch (var20) {
                    console.error("[GameMidletLoop] Error popping frame history:", var20);
                    break;
                }
                switch (var3) {
                    case 1:
                        CoreEngine.exec_f_int_to_void(var4);
                        break;
                    case 2:
                        CoreEngine.exec_i_int_to_void(var4);
                        break;
                    case 3:
                        if ((CoreEngine.val_scenebase_a.sceneStateId) !== (var4)) {
                            CoreEngine.exec_a_int_bool_scenebase_to_void(var4, false, CoreEngine.val_scenebase_a);
                        }
                        break;
                    case 4:
                        CoreEngine.exec_a_int_bool_scenebase_to_void(var4, true, CoreEngine.val_scenebase_a);
                        break;
                    case 5:
                        (this.isInitialized = false);
                        (this.isRunning = true);
                        let var42 = CoreEngine.val_globalcontext_a.currentScene;
                        if (CoreEngine.val_globalcontext_a.currentScene.isSceneVisible) {
                            (var42.isSceneVisible = false);
                            (var42.isScenePaused = true);
                            for (let var33 = 0; (var33 < 33); var33++) {
                                CoreEngine.exec_a_int_bool_scenebase_to_void(var42.sceneExtraShorts[var33], true, var42);
                            }
                        }
                        (var42 = CoreEngine.val_globalcontext_a.currentScene);
                        if (!CoreEngine.val_globalcontext_a.currentScene.isSceneActive) {
                            (var42.isSceneActive = true);
                            (var42.sceneTimers[1] = Date.now());
                            let root42 = (var42);
                            if (!root42.isLoaded) {
                                root42.flowController.pauseFlow();
                                (root42.isLoaded = true);
                            }
                        }
                        break;
                    case 6:
                        (this.val_long_c = Date.now());
                        if (this.isRunning) {
                            let var39 = CoreEngine.val_globalcontext_a.currentScene;
                            if (!CoreEngine.val_globalcontext_a.currentScene.isSceneVisible) {
                                (var39.isSceneVisible = true);
                                (var39.isScenePaused = true);
                            }
                            (var39 = CoreEngine.val_globalcontext_a.currentScene);
                            if (CoreEngine.val_globalcontext_a.currentScene.isSceneActive) {
                                (var39.isSceneActive = false);
                                let var10000 = var39.sceneTimers;
                                let var6 = (var39.sceneTimers[0] + (Date.now() - var39.sceneTimers[1]));
                                (var10000[0] = var6);
                                (var39.sceneTimers[1] = 0);
                                let root39 = (var39);
                                if (root39.isLoaded) {
                                    (root39.gameTimer = (root39.gameTimer + (Date.now() - root39.lastUpdateTimestamp)));
                                    let var32 = 0;
                                    ((var32 = CoreEngine.exec_a_to_rootgamestate().inputManager).activeKeyBitmask = 0);
                                    (var32.pressedKeyBitmask = 0);
                                    (var32.releasedKeyBitmask = 0);
                                    (var32.repeatedKeyBitmask = 0);
                                    (root39.isLoaded = false);
                                    root39.flowController.resumeFlow();
                                }
                            }
                            CoreEngine.getGlobalAudioContext();
                            CoreEngine.exec_a_bool_to_void(this.isBackgrounded);
                            (this.isRunning = false);
                            (this.val_bool_g = true);
                        }
                        break;
                    case 7:
                        (CoreEngine.isGlobalPaused = true);
                        (CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true);
                        break;
                    case 8:
                        let var38 = CoreEngine.val_globalcontext_a.currentScene;
                        if (!CoreEngine.val_globalcontext_a.currentScene.isTransitioning) {
                            (var38.isTransitioning = true);
                        }
                        CoreEngine.exec_b_gamemidletloop_to_void(CoreEngine.val_gamemidletloop_a);
                }
            }
        } catch (var21) {
            console.error("[GameMidletLoop] Event loop error:", var21);
        }

        if (this.isRunning) {
            if ((this.val_bool_h && CoreEngine.val_maincanvasbridge_a.isShown())) {
                (this.val_bool_h = false);
                this.stopGameLoop();
            }
            return;
        }

        try {
            let var35 = CoreEngine.val_maincanvasbridge_a;
            let frameDelta = 0;
            if ((this.targetFrameTimeMs) === (-1)) {
                (frameDelta = (((Date.now() - this.lastFrameTimeMs)) | 0));
            } else {
                (frameDelta = (((this.targetFrameTimeMs - this.lastFrameTimeMs)) | 0));
            }
            let var25 = frameDelta;
            (frameDelta -= var35.canvasWidth);
            let var23 = CoreEngine.val_globalcontext_a.currentScene;
            let var22 = var23.sceneDuration;
            if ((CoreEngine.val_globalcontext_a.currentScene.sceneStateId) !== (0)) {
                if ((var22) === (Integer.MAX_VALUE)) {
                    (var22 = -350);
                } else {
                    if (((var22 += frameDelta) > 150)) {
                        (var22 = 0);
                    }
                }
            }
            (var23.sceneDuration = var22);
            let rootState = (var23);
            let var24 = rootState.inputManager;
            let var26 = 0;
            (rootState.lastUpdateTimestamp = (var26 = Date.now()));
            rootState.flowController.updateFlow((var26 - rootState.gameTimer));
            (rootState.isScenePaused = true);
            if ((var24.activeKeyBitmask > 0)) {
                var24.activeKeyBitmask--;
            }
            (var24.releasedKeyBitmask = 0);
            (var24.repeatedKeyBitmask = 0);
            (var35.canvasWidth = var25);
            (CoreEngine.isGlobalPaused = true);
        } catch (var19) {
            console.error("[GameMidletLoop] Frame update error:", var19);
        }
        if (this.isExitRequested) {
            return;
        }
        if (((var1 - this.val_long_c) < 2000)) {
            (CoreEngine.isGlobalPaused = true);
            (CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true);
        }
        if ((CoreEngine.isGlobalPaused && CoreEngine.val_globalcontext_a.currentScene.isScenePaused)) {
            CoreEngine.val_maincanvasbridge_a.repaint();
            try {
                CoreEngine.val_maincanvasbridge_a.serviceRepaints();
            } catch (var12) {
                console.error("[GameMidletLoop] Repaint error:", var12);
            }
        }
        this.lastFrameTimeMs = var1;
    }
}
globalThis.GameMidletLoop = GameMidletLoop;
"""

FOOTER = """export class SDKMIDlet extends GameMidletLoop {
    constructor() {
        super();
        CoreEngine.f_a_sdkmidlet = this;
        CoreEngine.midletInstance = this;
    }
}
globalThis.SDKMIDlet = SDKMIDlet;

// Static initialization phase
export function initEngine() {
    console.log("[Engine] Initializing UMK3 Static Tables...");
    TransformTable.val_arr_int_a;
    PatternTable.val_arr_int_a;
    ResourceSlotTable.val_arr_byte_a;
    AudioMetaTable.val_arr_string_a;
    CharacterPresetTable.val_arr_byte_a;
    console.log("[Engine] UMK3 Static Tables Initialized Successfully!");
}
"""

def build_bundle():
    print(f"[*] Reading Java sources from: {SRC_DIR}")
    class_symbols = {}

    for root, _, files in os.walk(SRC_DIR):
        for f in files:
            if f.endswith('.java'):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as fh:
                    tree = javalang.parse.parse(fh.read())
                for t in tree.types:
                    cname = t.name
                    static_fields = set()
                    instance_fields = set()
                    static_methods = set()
                    instance_methods = set()

                    for field in t.fields:
                        is_stat = 'static' in field.modifiers
                        for d in field.declarators:
                            if is_stat:
                                static_fields.add(d.name)
                            else:
                                instance_fields.add(d.name)

                    for m in t.methods:
                        is_stat = 'static' in m.modifiers
                        if is_stat:
                            static_methods.add(m.name)
                        else:
                            instance_methods.add(m.name)

                    class_symbols[cname] = {
                        'static_fields': static_fields,
                        'instance_fields': instance_fields,
                        'static_methods': static_methods,
                        'instance_methods': instance_methods,
                    }

    print(f"[*] Collected symbols for {len(class_symbols)} classes.")
    transpiler = JavaToJsTranspiler(class_symbols)

    bundle_parts = [HEADER]

    for cname in ORDERED_CLASSES:
        p = os.path.join(SRC_DIR, f"{cname}.java")
        if not os.path.exists(p):
            print(f"[!] Warning: {p} does not exist!")
            continue

        print(f"  -> Transpiling {cname}...")
        with open(p, 'r', encoding='utf-8') as fh:
            tree = javalang.parse.parse(fh.read())

        code = transpiler.transpile_compilation_unit(tree)

        # Apply specific browser integration patches
        if cname == 'GameMidletLoop':
            marker_run = "run() {"
            idx = code.find(marker_run)
            if idx != -1:
                prefix = code[:idx]
                code = prefix + GAME_MIDLET_LOOP_METHODS
            else:
                code += f"\nglobalThis.{cname} = {cname};\n"

        elif cname == 'SpritePartSequence':
            code = re.sub(
                r'let var13 = var8\.val_arr_long_a\[\(var8\.animPriorityBytes\[var18\] & (?:0xF|0xFF)\)\];\s*'
                r'CoreEngine\.val_graphicsadapter_a\.drawRegion\(var8\.getCurrentFrame\(\), [^;]+, 20\);',
                r'''let u64 = BigInt(var8.val_arr_long_a[(var8.animPriorityBytes[var18] & 0xFF)]);
            let srcX = Number((u64 >> 48n) & 0xFFFFn);
            let srcY = Number((u64 >> 32n) & 0xFFFFn);
            let w = Number((u64 >> 16n) & 0xFFFFn);
            let h = Number(u64 & 0xFFFFn);
            CoreEngine.val_graphicsadapter_a.drawRegion(var8.getCurrentFrame(), srcX, srcY, w, h, CoreEngine.val_arr_int_a[var10], var11, var12, 20);''',
                code
            )
            code += f"\nglobalThis.{cname} = {cname};\n"

        elif cname == 'CoreEngine':
            code = re.sub(
                r'let var14 = CoreEngine\.val_animationset_i\.val_arr_long_a\[\(var16\.animPriorityBytes\[var11\] & (?:0xF|0xFF)\)\];\s*'
                r'CoreEngine\.val_graphicsadapter_a\.drawRegion\(var16\.getCurrentFrame\(\), [^;]+, 20\);',
                r'''let u64 = BigInt(CoreEngine.val_animationset_i.val_arr_long_a[(var16.animPriorityBytes[var11] & 0xFF)]);
                        let srcX = Number((u64 >> 48n) & 0xFFFFn);
                        let srcY = Number((u64 >> 32n) & 0xFFFFn);
                        let w = Number((u64 >> 16n) & 0xFFFFn);
                        let h = Number(u64 & 0xFFFFn);
                        CoreEngine.val_graphicsadapter_a.drawRegion(var16.getCurrentFrame(), srcX, srcY, w, h, var16.animDurationArray[var11], var12, var13, 20);''',
                code
            )

            old_queue_pack = "(var10000[var10001] = ((((var0) << 48) | (((var1) << 32) & 281470681743360)) | (((var2) << 16) & 4294901760)));"
            new_queue_pack = "(var10000[var10001] = ((BigInt(var0 & 0xFFFF) << 48n) | (BigInt(var1 & 0xFFFF) << 32n) | (BigInt(var2 & 0xFFFF) << 16n)));"
            if old_queue_pack in code:
                code = code.replace(old_queue_pack, new_queue_pack, 1)

            code += f"\nglobalThis.{cname} = {cname};\n"

        elif cname == 'MainCanvasBridge':
            old_trap = """        } catch (var8) {
            let var6 = var8;
            while (true) {
                try {
                    throw var6;
                } catch (var7) {
                    (var6 = var7);
                }
            }
        }"""
            new_trap = """        } catch (var8) {
            console.error("[MainCanvasBridge.paint Error]:", var8);
        }"""
            if old_trap in code:
                code = code.replace(old_trap, new_trap, 1)
            code += f"\nglobalThis.{cname} = {cname};\n"

        elif cname == 'GameFlowController':
            old_delta = "(CoreEngine.val_int_f = (CoreEngine.val_int_e = (((var1 - CoreEngine.val_long_a)) | 0)));"
            new_delta = """let delta = (CoreEngine.val_long_a === 0) ? 16 : (((var1 - CoreEngine.val_long_a)) | 0);
            if (delta > 125) delta = 125;
            if (delta < 0) delta = 16;
            (CoreEngine.val_int_f = (CoreEngine.val_int_e = delta));"""
            if old_delta in code:
                code = code.replace(old_delta, new_delta, 1)
            code += f"\nglobalThis.{cname} = {cname};\n"
        else:
            code += f"\nglobalThis.{cname} = {cname};\n"

        bundle_parts.append(code)

    bundle_parts.append(FOOTER)

    final_bundle = "\n\n".join(bundle_parts)
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, 'w', encoding='utf-8') as fh:
        fh.write(final_bundle)

    print(f"[SUCCESS] Wrote bundle to {OUT_FILE} ({len(final_bundle):,} bytes, {len(final_bundle.splitlines()):,} lines)")

    # Run node syntax verification
    res = subprocess.run(["node", "--check", OUT_FILE], capture_output=True, text=True)
    if res.returncode == 0:
        print("[SUCCESS] Node --check passed with 0 errors!")
    else:
        print(f"[ERROR] Node check failed:\n{res.stderr}")
        sys.exit(1)

if __name__ == '__main__':
    build_bundle()
