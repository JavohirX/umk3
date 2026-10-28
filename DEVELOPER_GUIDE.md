# Ultimate Mortal Kombat 3 — Developer & Modding Guide

Welcome to the standalone desktop release of **Ultimate Mortal Kombat 3 (EA Mobile)**! This project runs the authentic, bit-perfect 2007 J2ME mobile engine directly on modern desktop Windows using native **Java 22 (JDK 22)** with zero external emulators (no KEmulator, MicroEmulator, or RetroArch required).

---

## 1. Quick Start

### 1-Click Launch
Double-click `run.bat` in the root folder, or run from PowerShell / Command Prompt:
```bat
.\run.bat
```
*If this is the first run or if you made changes to the code, it will automatically build the compatibility layer before launching.*

### Game Controls

| Action | Primary Key | Numpad Key | J2ME Origin |
|---|---|---|---|
| **Movement / D-Pad** | `Arrow Keys` (Up/Down/Left/Right) | `2, 4, 6, 8` | Standard Nav-Pad |
| **Fire / Confirm** | `Enter` or `Space` | `5` | Nav-Pad Center Key |
| **High Punch (HP)** | `Z` | `1` | Keypad 1 |
| **High Kick (HK)** | `X` | `2` | Keypad 2 |
| **Low Punch (LP)** | `C` | `3` | Keypad 3 |
| **Low Kick (LK)** | `V` | `4` | Keypad 4 |
| **Block (BL)** | `A` | `5` | Keypad 5 |
| **Run (RN)** | `S` | `6` | Keypad 6 |
| **Options / Softkey 1** | `F1` or `Q` | — | Left Softkey (`-6`) |
| **Back / Softkey 2** | `F2` or `Escape` | — | Right Softkey (`-7`) |

---

## 2. Architecture & Technical Breakdown

### The Native Desktop Compatibility Harness
All mobile LCDUI / Nokia / MMAPI components are implemented natively under `src/main/java/`:
- `javax.microedition.lcdui.Display`: Swing `JFrame` host rendering with 2× nearest-neighbor integer scaling (704×832 window for retro 352×416 native pixels).
- `javax.microedition.lcdui.Graphics`: High-performance AWT `Graphics2D` adapter implementing LCDUI anchor calculations, transformation matrices (8 LCDUI transform cases), and 24-bit RGB pixel pipelines.
- `javax.microedition.lcdui.Image`: `BufferedImage` wrapper with subimage slicing and resource loading.
- `javax.microedition.lcdui.Canvas` / `com.nokia.mid.ui.FullCanvas`: Key mapping and double-buffered frame driver.
- `javax.microedition.media.Manager` & `Player`: JavaSound MIDI synthesizer and sampled clip playback.
- `javax.microedition.rms.RecordStore`: File-backed binary persistence in `.rms/` for saving settings, unlocked secrets, and high scores.

### Key Reverse-Engineering Breakthroughs
1. **The Resource Stream Boundary (`GamePrintStream.java`)**:
   In 2007 Nokia CLDC, `System.out.getClass().getResourceAsStream("/hdr")` used the handset's single flat classloader to load binary packages. In modern Java SE, `System.out` is loaded by the bootstrap classloader from `java.base` and returns `null`. By substituting `GamePrintStream`, `getClass()` resolves to the application classloader, restoring 100% authentic asset loading.
2. **Zero-Alpha Black Rect Fix**:
   Decompiled LCDUI code cleared frames with `setColor(0)`. A subtle conditional ternary evaluated `RGB == 0` as transparent (`alpha = 0`) instead of opaque black (`#000000FF`). Fixing this eliminated frame ghosting and restored pixel-perfect black wipes between screens.

---

## 3. How to Explore and Mod the Game

Because `build\compat` precedes `Ultimate_Mortal_Kombat_3_352.jar` on the classpath:
```bat
java -cp "build\compat;Ultimate_Mortal_Kombat_3_352.jar" DesktopLauncher
```
Any class compiled into `build\compat` will immediately override the JAR version!

### Mod 1: Window Scaling & Display Size
Open `src/main/java/javax/microedition/lcdui/Display.java`:
```java
// Line 22:
public static final int SCALE = 2; // Change to 1 for 1x (352x416), 3 for 3x (1056x1248)
```
Re-run `run.bat` and the window scale updates instantly.

### Mod 2: Remapping Key Controls
Open `src/main/java/javax/microedition/lcdui/Display.java` in `mapKeyCode(KeyEvent e)`:
```java
case KeyEvent.VK_Z:
    return 49; // Remap your favorite key here!
```

### Mod 3: Enabling Cheats, Blood & Fatalities
Open `src/main/java/javax/microedition/midlet/MIDlet.java`:
```java
static {
    APP_PROPERTIES.put("Blood", "red");      // "red", "green", or "off"
    APP_PROPERTIES.put("Fatality", "on");     // "on" or "off"
    APP_PROPERTIES.put("Cheats", "on");       // "on" or "off"
}
```

---

## 4. Codebase Navigation & Reference Documentation

The reverse-engineered classes and their structural roles are documented in detail:
- [`reverse_engineered/CLASS_ROLES.md`](file:///D:/source/immortal_combat/reverse_engineered/CLASS_ROLES.md): Complete index of all 45 classes, categorised into Startup, Scene Lifecycle, Input, Rendering, Audio, Animation, Entity Mechanics, and Data Tables.
- [`reverse_engineered/RENAMING_MAP.md`](file:///D:/source/immortal_combat/reverse_engineered/RENAMING_MAP.md): Mapping between obfuscated single-letter names (`a`..`aj`) and their human-readable semantic names.
- [`reverse_engineered/src/`](file:///D:/source/immortal_combat/reverse_engineered/src/): **Primary Human-Readable Codebase** with all 36 semantic class files (`GameMidletLoop.java`, `GameFlowController.java`, `CoreEngine.java`, `MainCanvasBridge.java`, `AudioManager.java`, etc.) and comprehensive Javadocs.
- [`reverse_engineered/src_raw/`](file:///D:/source/immortal_combat/reverse_engineered/src_raw/): Raw decompiler output baseline.
