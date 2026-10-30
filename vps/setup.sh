#!/usr/bin/env bash
# ==============================================================================
# Ultimate Mortal Kombat 3 - 1-Click VPS Provisioning Script
# ==============================================================================
set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "Usage: sudo bash setup.sh <YOUR_DOMAIN_OR_SUBDOMAIN>"
    echo "Example: sudo bash setup.sh umk3.example.com"
    exit 1
fi

echo "=== 1. Updating packages & Installing Nginx, Python3-venv, Certbot ==="
apt update && apt install -y nginx python3 python3-pip python3-venv certbot python3-certbot-nginx rsync

echo "=== 2. Creating web directory /var/www/umk3 ==="
mkdir -p /var/www/umk3
chown -R www-data:www-data /var/www/umk3
chmod -R 755 /var/www/umk3

echo "=== 3. Configuring Nginx ==="
sed "s/YOUR_DOMAIN/$DOMAIN/g" nginx.conf > /etc/nginx/sites-available/umk3.conf
ln -sf /etc/nginx/sites-available/umk3.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo "=== 4. Obtaining Let's Encrypt SSL Certificate ==="
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" || true

systemctl reload nginx

echo "=== 5. Setting up Python Virtual Environment for Bot ==="
mkdir -p /opt/umk3-bot
python3 -m venv /opt/umk3-bot/venv
/opt/umk3-bot/venv/bin/pip install --upgrade pip
/opt/umk3-bot/venv/bin/pip install aiogram python-dotenv aiohttp

cp ../bot.py /opt/umk3-bot/bot.py
if [ -f ../.env ]; then
    cp ../.env /opt/umk3-bot/.env
fi

echo "=== 6. Installing Systemd Service for Bot ==="
cp umk3-bot.service /etc/systemd/system/umk3-bot.service
systemctl daemon-reload
systemctl enable umk3-bot.service
systemctl restart umk3-bot.service || true

echo "=============================================================================="
echo "Deployment Complete!"
echo "Web URL: https://$DOMAIN/player/"
echo "=============================================================================="
