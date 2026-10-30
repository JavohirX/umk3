# Immortal Combat — 1:1 Native JavaScript Port & Telegram Web App

A bit-perfect 1:1 clone of **Immortal Combat** (J2ME edition) running natively in pure JavaScript (ES Modules), with zero JVM, zero WASM, and zero CheerpJ dependencies. Built with HTML5 Canvas 2D, Web Audio API, an ergonomic tactile mobile controller, and deep Telegram Mini App (TMA) integration.

---

## 1. Highlights & Architecture

- **0 WASM, 0 JVM, Pure Native JavaScript**: All 36 deobfuscated Java classes transpiled directly into standard ES modules (`player/js/engine/umk3.js`).
- **Instant Cold Start (<100ms)**: Cold boots directly in modern mobile and desktop browsers by synchronously streaming only 34 lightweight assets (<1.2 MB total), eliminating the 20MB+ CheerpJ/WASM overhead and 30-second initialization delay.
- **Bit-Perfect 1:1 Combat Logic**: Preserves 100% of the original collision hitboxes, animation sequences, palette transformations, frame timings, damage formulas, and AI state machines.
- **Micro J2ME LCDUI & Runtime Bridge**: Pure JS implementation of LCDUI `Graphics` (8 transforms, anchor math, coordinate clamping, `drawRGB`), `Image` (synchronous UPNG decoding), `MIDlet`, `RecordStore`, `DataInputStream`, `DataOutputStream`, and `Random`.
- **Telegram Mini App (TMA) First-Class**:
  - Expanded portrait mode with vertical swipe-to-close lock (`disableVerticalSwipes()`).
  - Tactile haptic feedback via `Telegram.WebApp.HapticFeedback` for punches, kicks, blocks, and menu navigation.
  - Native header and background styling adhering to Telegram client themes.
- **3D Tactile Mobile Controller**: Ergonomic 6-button MK combat cluster (HP, HK, LP, LK, Block, Run) with physical 3D depression styling, haptic vibration, and an 8-way sliding vector D-pad with jump diagonals.
- **Desktop Edition Included**: Complete Java desktop build (`build.bat` / `run.bat`) for desktop testing.

---

## 2. Quick Start

### A. Run Web Player & Telegram Web App Locally
```powershell
python run_server.py
```
Starts a high-performance local HTTP server on `http://localhost:8080/player/index.html` and prints the local network URL to test instantly on mobile or inside Telegram.

### B. Launch Telegram Mini App Bot
```powershell
pip install aiogram python-dotenv
# Add TELEGRAM_BOT_TOKEN to .env
python bot.py
```

### C. Desktop Java Edition (Windows)
```cmd
build.bat    # Compiles launcher and game sources into build\compat\
run.bat      # Launches the desktop window (Java 22)
```

**Keyboard Controls:**
| Key | Action |
|-----|--------|
| **Arrow Keys** / **W A S D** | Move / Jump / Crouch |
| **Enter** / **Space** | Select / Fire |
| **Z** / **X** | High Punch (HP) / High Kick (HK) |
| **C** / **V** | Low Punch (LP) / Low Kick (LK) |
| **B** | Block |
| **N** | Run |
| **Q** / **F1** | Options (Left Softkey) |
| **E** / **F2** | Back (Right Softkey) |
| **M** | Mute Audio |

---

## 3. Project Structure

```
immortal_combat/
├── player/                     # Pure JavaScript Web Player & Telegram Mini App
│   ├── index.html              # 3D Mobile Controller + Canvas Viewport
│   ├── manifest.json           # PWA Manifest
│   ├── icon.png                # MK Dragon app icon
│   ├── assets/                 # 34 game assets (sound banks, sprites, tiles, charmaps)
│   └── js/
│       ├── main.js             # Bootstrap, game loop, touch & keyboard event router
│       ├── assets.js           # Fast parallel asset preloader & binary resource cache
│       ├── engine/
│       │   └── umk3.js         # Transpiled 1:1 UMK3 engine (36 classes, 18,443 lines)
│       ├── j2me/
│       │   ├── runtime.js      # J2ME runtime (Streams, RMS RecordStore, Math, Thread)
│       │   ├── graphics.js     # LCDUI Graphics 2D engine, Image decoding, Display
│       │   └── audio.js        # Web Audio API retro synthesizer & sound manager
│       └── lib/
│           └── upng.js         # Fast synchronous pure-JS PNG decoder with pako inflate
├── tools/
│   ├── java_to_js_transpiler.py # AST-based Java-to-JS transpiler & syntax bridge
│   └── build_js_bundle.py      # Automated bundle builder & validator
├── src/main/java/              # Human-readable game source (36 clean Java files)
├── vps/
│   ├── setup.sh                # 1-Click VPS provisioning script
│   ├── nginx.conf              # Nginx config with TMA iframe CSP
│   └── umk3-bot.service        # Systemd unit file for Telegram bot
├── .github/workflows/
│   ├── deploy-vps.yml          # GitHub Actions CI/CD to VPS via SSH
│   └── deploy.yml              # GitHub Pages deployment workflow
├── run_server.py               # Local dev server
└── bot.py                      # Telegram bot launcher
```

---

## 4. GitHub Actions & VPS Deployment

Pushing to `main` deploys the web player to VPS and GitHub Pages automatically via the included CI/CD workflows.

### Required GitHub Secrets for VPS Deployment
In GitHub **Settings ➔ Secrets and variables ➔ Actions**:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VPS_HOST` | IP address or domain of your VPS | `193.36.236.221` |
| `VPS_USERNAME` | SSH user | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Private SSH Key (ed25519 or rsa) | `-----BEGIN OPENSSH PRIVATE KEY...` |
| `VPS_PORT` | SSH Port (optional, defaults to 22) | `22` |

### Initial VPS Provisioning
Run once on your Ubuntu/Debian VPS:
```bash
sudo bash vps/setup.sh your-domain.com
```
After setting the GitHub Secrets, any push to `main` will automatically update `/var/www/umk3`, reload Nginx, and restart the Telegram bot service.
