# Deployment Instructions — Ultimate Mortal Kombat 3

This document contains step-by-step instructions for deploying the **Ultimate Mortal Kombat 3** Web Runner and Telegram Mini App (TMA) to your VPS and keeping it automatically synchronized via GitHub Actions.

---

## 1. Quick Links

- **GitHub Repository**: [https://github.com/JavohirX/umk3](https://github.com/JavohirX/umk3)
- **Live Web Player (GitHub Pages)**: [https://javohirx.github.io/umk3/player/](https://javohirx.github.io/umk3/player/)
- **Repository Secrets Page**: [https://github.com/JavohirX/umk3/settings/secrets/actions](https://github.com/JavohirX/umk3/settings/secrets/actions)
- **Actions Workflow Page**: [https://github.com/JavohirX/umk3/actions](https://github.com/JavohirX/umk3/actions)

---

## 2. GitHub Secrets Setup (Required for VPS Deployment)

To allow GitHub Actions to SSH into your server and deploy updates automatically:

1. Go to **Settings ➔ Secrets and variables ➔ Actions** in the repository.
2. Click **New repository secret** and add the following 4 secrets:

| Secret Name | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VPS_HOST` | **Yes** | Your VPS IPv4 address or domain | `193.36.236.221` |
| `VPS_USERNAME` | **Yes** | SSH login user | `root` or `ubuntu` |
| `VPS_SSH_KEY` | **Yes** | Private SSH Key (ed25519 or rsa) | `-----BEGIN OPENSSH PRIVATE KEY...` |
| `VPS_PORT` | Optional | SSH Port (defaults to 22 if omitted) | `22` |

> [!TIP]
> Ensure your public key (`id_ed25519.pub` or `id_rsa.pub`) is added to `~/.ssh/authorized_keys` on your VPS so GitHub Actions can authenticate without a password.

---

## 3. Initial One-Time VPS Server Setup

Run these commands once on your VPS (Ubuntu 22.04 / 24.04 or Debian 11 / 12):

### Step A: Connect to your server
```bash
ssh root@YOUR_VPS_IP
```

### Step B: Clone the repository into `/var/www/umk3`
```bash
git clone https://github.com/JavohirX/umk3 /var/www/umk3
cd /var/www/umk3
```

### Step C: Run the 1-Click Provisioning Script
```bash
sudo bash vps/setup.sh your-domain.com
```

This script will automatically:
- Install `nginx`, `python3-pip`, `python3-venv`, `certbot`, and `python3-certbot-nginx`.
- Configure `/etc/nginx/sites-available/umk3.conf` with Telegram Mini App CSP headers (`frame-ancestors`) and byte-range request support (`Accept-Ranges bytes`).
- Issue a free Let's Encrypt SSL certificate.
- Create a Python virtual environment at `/opt/umk3-bot/venv`.
- Install and start the `umk3-bot.service` systemd background daemon.

---

## 4. Telegram Bot Configuration (Optional)

If you plan to launch the game as a **Telegram Mini App**:

1. Create a bot using [@BotFather](https://t.me/BotFather) and copy the HTTP API token.
2. Create or edit `/opt/umk3-bot/.env` on your VPS:
   ```env
   TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ"
   WEBAPP_URL="https://your-domain.com/player/"
   ```
3. Restart the bot service:
   ```bash
   sudo systemctl restart umk3-bot
   ```
4. Verify the bot status:
   ```bash
   sudo systemctl status umk3-bot
   ```

---

## 5. How to Redeploy

### Option A: Automatic Push Deployment
Whenever you push code changes to the `main` branch, the workflow [`.github/workflows/deploy-vps.yml`](.github/workflows/deploy-vps.yml) automatically triggers, pulls the new code on the VPS, reloads Nginx, and restarts the bot.

### Option B: Manual Trigger in GitHub UI
1. Go to **Actions ➔ Deploy to VPS Server**.
2. Click **Run workflow** ➔ Select branch `main` ➔ Click **Run workflow**.

---

## 6. Maintenance & Troubleshooting Commands

### Nginx
```bash
# Test Nginx syntax
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# View real-time access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Telegram Bot
```bash
# Check service status
sudo systemctl status umk3-bot

# Restart bot
sudo systemctl restart umk3-bot

# View live bot logs
sudo journalctl -u umk3-bot -f
```

### Web Directory Permissions
If you ever encounter permission issues when serving files:
```bash
sudo chown -R www-data:www-data /var/www/umk3
sudo chmod -R 755 /var/www/umk3
```
