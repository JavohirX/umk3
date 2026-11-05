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
pip install -r requirements.txt
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
│   └── deploy.yml              # Tests, then GitHub Pages + VPS deployment
├── server/
│   ├── multiplayer.py          # Match rooms, lockstep relay, spectators, replays, rematches
│   ├── db.py                   # SQLite: matches, leaderboards, replays, fight log tables
│   ├── telemetry.py            # Fight log writer: a background thread, so logging can't slow a fight
│   ├── admin.py                # Admin panel routes and sign-in links
│   ├── admin_read.py           # One panel read, in its own process so it can't slow a fight
│   ├── admin_stats.py          # Every number the panel shows, with its definition
│   └── admin_panel.html        # The panel itself
├── requirements.txt            # Bot + server dependencies
├── run_server.py               # Local dev server
└── bot.py                      # Telegram bot launcher
```

---

## 4. GitHub Actions & VPS Deployment

Pushing to `main` runs the tests, then deploys the web player to the VPS and GitHub Pages (`.github/workflows/deploy.yml`). A failing test stops both deploys. The VPS deploy waits up to 3 minutes for live matches to finish before it restarts the server, runs the server as its own `umk3` user, and checks that it came back up.

### Required GitHub Secrets for VPS Deployment
In GitHub **Settings ➔ Secrets and variables ➔ Actions**:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VPS_HOST` | IP address or domain of your VPS | `193.36.236.221` |
| `VPS_USERNAME` | SSH user | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Private SSH Key (ed25519 or rsa) | `-----BEGIN OPENSSH PRIVATE KEY...` |
| `VPS_PORT` | SSH Port (optional, defaults to 22) | `22` |
| `TG_BOT_TOKEN` | Bot token from @BotFather; also used to verify players' Telegram identity | `123456:ABC...` |
| `WEBAPP_SHORT_NAME` | Optional: short name of the Mini App made with @BotFather `/newapp`, for one-tap Play buttons in groups | `fight` |
| `ADMIN_ID` | Your Telegram user id: `/feedback` messages are sent to it and `/admin` answers it. Start the bot once from that account (bots can't message someone first). Leave unset to switch both off | `123456789` |

### Initial VPS Provisioning
Run once on your Ubuntu/Debian VPS:
```bash
sudo bash vps/setup.sh your-domain.com
```
After setting the GitHub Secrets, any push to `main` will automatically update `/var/www/umk3`, reload Nginx, and restart the Telegram bot service.

---

## 5. Fight Log & Admin Panel

Every online fight is logged to the SQLite database (`data/immortal_combat.db`) from the moment a challenge is created. Nothing here slows a fight: rows go on a queue and a background thread writes them about once a second.

**Opening the panel.** Send `/admin` to the bot from the `ADMIN_ID` account, in your private chat with it. You get a link that signs you in for 12 hours; there is no password to manage. Running locally without a bot, set `ADMIN_PANEL_SECRET` to anything and `run_server.py` prints a link.

**What gets logged**

| Table | One row per | Source |
|-------|-------------|--------|
| `matches` | challenge, with its fight's setup, result, timing and build | server |
| `match_events` | thing that happened in a match: connects, drops, locks, rounds, restarts, freezes... | server, plus phones for `freeze`, `desync`, `loop_error` |
| `net_windows` | stats report from a phone, about every 10s of fight (frame times, stalls, input delay, rollbacks, path) | phones |
| `server_samples` | minute of the server's life (event loop lag, CPU, memory, relay traffic) | server |
| `players` | account that has opened a match, with their last device | both |

Event kinds in `match_events`: `seat_claimed`, `seat_released`, `player_connected`, `player_disconnected`, `player_away`, `player_back`, `hero_locked`, `fight_started`, `segment_restart`, `round_settled`, `score_conflict`, `match_finished`, `rematch_requested`, `rematch_agreed`, `challenge_expired`, `input_gap`, `input_gaps`, `freeze`, `desync`, `loop_error`, `spectator_joined`, `spectator_left`, `join_rejected`, `auth_failed`, `bot_start`, `server_start`.

**Trusting the numbers.** Every number in the panel shows where it came from (server or phones), how it is worked out, and how many fights or phones stand behind it. The Data quality page compares independently written records (for example the leaderboard against the match table, and phone reported fight time against the server's clock) and says if any disagree. The full raw log downloads as CSV from the panel for deeper analysis.

**What is stored about players:** Telegram id and first name, device model and OS, network type and how the game ran on their phone. No IP addresses and no chat contents. Tell your testers before the beta.
