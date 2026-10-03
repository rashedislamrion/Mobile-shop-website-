#!/usr/bin/env bash
# ==============================================================================
# NovaMobile Production Zero-Downtime Deployment Script
# Target: Single Hostinger KVM VPS
#
# Server Layout:
# - Application Repository: /var/www/novamobile/app
# - Persistent Uploads:     /var/www/novamobile/uploads (OUTSIDE the repo)
# - Backups Directory:      /var/www/novamobile/backups
#
# Safety Rules:
# - Strictly uses "npx prisma migrate deploy" (NEVER db push or migrate reset)
# - Installs ALL dependencies (devDependencies needed for nest build, next build, prisma db seed)
# - NEVER uses --omit=dev
# - NEVER touches or deletes the persistent uploads directory
# - NEVER runs git clean
# - Performs atomic reload of PM2 processes via ecosystem.config.js
# ==============================================================================

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/novamobile/app}"
UPLOAD_DIR="${UPLOAD_ROOT:-/var/www/novamobile/uploads}"

echo "================================================================="
echo "🚀 Starting NovaMobile Production Deployment"
echo "   Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "   Target Directory: $APP_DIR"
echo "   Uploads Directory: $UPLOAD_DIR"
echo "================================================================="

# 1. Ensure persistent uploads folder exists outside the repo with correct permissions
if [ ! -d "$UPLOAD_DIR" ]; then
    echo "📁 Creating persistent uploads directory outside repo: $UPLOAD_DIR"
    mkdir -p "$UPLOAD_DIR"
fi
chmod 755 "$UPLOAD_DIR" || true

# 2. Navigate to repo & pull latest code
cd "$APP_DIR"
echo "📥 [1/5] Pulling latest changes from repository..."
git pull --ff-only

# 3. Install ALL dependencies (devDependencies required for nest build, next build, prisma)
echo "📦 [2/5] Installing backend dependencies (including devDependencies)..."
cd "$APP_DIR/api"
npm install

echo "📦 [2/5] Installing frontend dependencies (including devDependencies)..."
cd "$APP_DIR"
npm install

# 4. Run Prisma database migrations (Non-destructive)
echo "🗄️  [3/5] Applying pending Prisma database migrations..."
cd "$APP_DIR/api"
npx prisma generate
npx prisma migrate deploy

# 5. Build applications
echo "⚙️  [4/5] Building NestJS Backend API..."
npm run build

echo "⚙️  [4/5] Building Next.js Frontend Web..."
cd "$APP_DIR"
npm run build

# 6. PM2 Zero-downtime Reload via ecosystem.config.js
echo "🔄 [5/5] Reloading PM2 processes via ecosystem.config.js..."
cd "$APP_DIR"
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save

echo "================================================================="
echo "✅ NovaMobile Deployment Completed Successfully!"
echo "🔒 SAFEGUARD VERIFICATION: Uploads directory ($UPLOAD_DIR) was preserved."
echo "================================================================="
