import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.commons.ClassRemapper;
import org.objectweb.asm.commons.SimpleRemapper;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.jar.*;
import java.util.zip.*;

public class JarRemapper {
    public static void main(String[] args) throws Exception {
        File inJar = new File(args.length > 0 ? args[0] : "Ultimate_Mortal_Kombat_3_352.jar");
        File outJar = new File(args.length > 1 ? args[1] : "Ultimate_Mortal_Kombat_3_remapped.jar");

        Map<String, String> mapping = new HashMap<>();
        mapping.put("ac", "GameMidletLoop");
        mapping.put("ad", "MainCanvasBridge");
        mapping.put("ab", "GameFlowController");
        mapping.put("j",  "RootGameState");
        mapping.put("q",  "InputManager");
        mapping.put("p",  "AudioManager");
        mapping.put("l",  "GraphicsAdapter");
        mapping.put("s",  "CharacterPresetTable");
        mapping.put("b",  "ResourceSlotTable");
        mapping.put("f",  "TransformTable");
        mapping.put("h",  "AudioMetaTable");
        mapping.put("n",  "PatternTable");
        mapping.put("k",  "FontCharmap");
        mapping.put("d",  "EncodedTextBuffer");
        mapping.put("u",  "SpritePartSequence");
        mapping.put("aa", "AnimationSet");
        mapping.put("e",  "SpriteImage");
        mapping.put("v",  "ConcreteImage");
        mapping.put("ai", "AbstractImage");
        mapping.put("w",  "AudioPlaybackContext");
        mapping.put("aj", "AudioClipNode");
        mapping.put("m",  "MarketPanelController");
        mapping.put("x",  "SceneBase");
        mapping.put("af", "GlobalContext");
        mapping.put("ah", "RenderContext");
        mapping.put("z",  "TokenString");
        mapping.put("ag", "TokenWrapper");
        mapping.put("ae", "GrowableByteBuffer");
        mapping.put("g",  "FeatureFlag");
        mapping.put("r",  "EntityInterface");
        mapping.put("t",  "AsyncWorkerThread");
        mapping.put("y",  "ContextServiceNode");
        mapping.put("c",  "PackedResourceStream");
        mapping.put("a",  "EffectActor");
        mapping.put("o",  "ActorStateMachine");
        mapping.put("i",  "CoreEngine");

        SimpleRemapper remapper = new SimpleRemapper(mapping);

        try (JarFile jarFile = new JarFile(inJar);
             JarOutputStream jos = new JarOutputStream(new FileOutputStream(outJar))) {

            Enumeration<JarEntry> entries = jarFile.entries();
            while (entries.hasMoreElements()) {
                JarEntry entry = entries.nextElement();
                String name = entry.getName();

                if (name.endsWith(".class")) {
                    String className = name.substring(0, name.length() - 6);
                    String newClassName = mapping.getOrDefault(className, className);
                    JarEntry newEntry = new JarEntry(newClassName + ".class");
                    jos.putNextEntry(newEntry);

                    byte[] bytes;
                    try (InputStream is = jarFile.getInputStream(entry)) {
                        bytes = is.readAllBytes();
                    }

                    ClassReader cr = new ClassReader(bytes);
                    ClassWriter cw = new ClassWriter(0);
                    ClassRemapper cv = new ClassRemapper(cw, remapper);
                    cr.accept(cv, ClassReader.EXPAND_FRAMES);
                    jos.write(cw.toByteArray());
                    jos.closeEntry();
                } else if (name.equals("META-INF/MANIFEST.MF")) {
                    JarEntry newEntry = new JarEntry(name);
                    jos.putNextEntry(newEntry);
                    String manifestStr;
                    try (InputStream is = jarFile.getInputStream(entry)) {
                        manifestStr = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    }
                    manifestStr = manifestStr.replace(", ac", ", GameMidletLoop");
                    jos.write(manifestStr.getBytes(StandardCharsets.UTF_8));
                    jos.closeEntry();
                } else {
                    JarEntry newEntry = new JarEntry(name);
                    jos.putNextEntry(newEntry);
                    try (InputStream is = jarFile.getInputStream(entry)) {
                        is.transferTo(jos);
                    }
                    jos.closeEntry();
                }
            }
        }
        System.out.println("Remapping successful: " + outJar.getAbsolutePath());
    }
}
