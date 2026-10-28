# Ultimate Mortal Kombat 3 — Deobfuscated & Web / Mobile Adaptation

A fully deobfuscated, 100% human-readable Java codebase and mobile web adaptation of **Ultimate Mortal Kombat 3** (J2ME edition). Includes a Desktop Java launcher, an in-browser WebAssembly runner, a custom 3D tactile mobile touch controller, and automated Telegram Mini App (TMA) / VPS deployment pipelines.

---

## 1. Features

- **100% Clean, Human-Readable Codebase**: All 36 game classes, methods, fields, and variables have been deobfuscated from single-letter names into clear English names with comprehensive Javadocs. Zero single-letter names remain anywhere in source or bytecode.
- **Desktop Edition (Java 22)**: Complete AWT/Swing desktop compatibility layer with full keyboard controls, scaling buffer, and sound support.
- **Mobile Web Player (WASM)**: Browser player running `Ultimate_Mortal_Kombat_3_deobf.jar` via CheerpJ with RFC 7233 chunked streaming and dual-channel Web Audio MIDI synthesis.
- **3D Tactile Mobile Controller**: Ergonomic 6-button MK combat cluster (HP, HK, LP, LK, Block, Run) with physical 3D depression styling, haptic vibration, and an 8-way sliding vector D-pad with jump diagonals.
- **Telegram Mini App (TMA) Ready**: Anti-pull-to-close gesture protection (`disableVerticalSwipes`), portrait locking, and Telegram theme integration.
- **CI/CD & 1-Click VPS Deployment**: Pre-configured GitHub Actions for automated deployment to VPS via SSH/Rsync and GitHub Pages.

---

## 2. Quick Start

### A. Desktop Java (Windows)
```cmd
build.bat    # Compiles launcher and game sources into build\compat\
run.bat      # Launches the desktop window (Java 22)
```

**Desktop Controls:**
| Key | Action |
|-----|--------|
| **Arrow Keys** / **W A S D** | Move / Jump / Crouch |
| **Enter** / **Space** | Select / Fire |
| **Z** / **X** | High Punch (HP) / High Kick (HK) |
| **C** / **V** | Low Punch (LP) / Low Kick (LK) |
| **A** / **B** | Block |
| **S** / **N** | Run |
| **F1** / **Q** | Options (Left Softkey) |
| **F2** / **E** | Back (Right Softkey) |
| **M** | Mute Audio |

### B. Mobile Web & Local Dev Server
```powershell
python run_server.py
```
Automatically starts an HTTP server on `http://localhost:8080/player/` with RFC 7233 byte-range support and prints the network IP to test on your phone.

### C. Telegram Mini App Bot
```powershell
pip install aiogram python-dotenv
# Add TELEGRAM_BOT_TOKEN to .env
python bot.py
```

---

## 3. Project Structure

```
immortal_combat/
├── src/main/java/              # Human-readable game source (36 clean Java files)
├── player/                     # Web player root (served by web server)
│   ├── index.html              # 3D Mobile Controller + TMA Viewport (352x416)
│   ├── manifest.json           # PWA Manifest
│   ├── icon.png                # MK Dragon app icon
│   ├── freej2me-web.jar        # WebAssembly J2ME VM
│   └── jar/
│       ├── Ultimate_Mortal_Kombat_3_deobf.jar  # Deobfuscated runtime JAR
│       └── Ultimate_Mortal_Kombat_3_deobf.jad  # JAD descriptor
├── vps/
│   ├── setup.sh                # 1-Click VPS provisioning script
│   ├── nginx.conf              # Nginx config with TMA iframe CSP
│   └── umk3-bot.service        # Systemd unit file for Telegram bot
├── .github/workflows/
│   ├── deploy-vps.yml          # GitHub Actions CI/CD to VPS via SSH
│   └── deploy.yml              # GitHub Pages deployment workflow
├── build.bat                   # Desktop build script
├── run.bat                     # Desktop launch script
├── run_server.py               # Local RFC 7233 dev server
├── bot.py                      # Telegram bot launcher
└── vercel.json                 # Static hosting rewrite config
```

---

## 4. GitHub Actions & VPS Deployment

When you push this repository to GitHub, the included workflows can deploy to both your VPS and GitHub Pages automatically.

### Required GitHub Secrets for VPS Deployment
In your GitHub repository settings, navigate to **Settings ➔ Secrets and variables ➔ Actions** and add:

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
