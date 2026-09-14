#!/usr/bin/env bash
# Builds the upload bundle for HostPinnacle cPanel (Node.js / Passenger).
#
# Run this on your own computer or CI (NOT inside the Lovable editor).
#
# Usage:  bash scripts/build-cpanel.sh
# Output: cpanel-bundle/  and  getgas-energen-cpanel.zip
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD="$ROOT/dist-cpanel"
OUT="$ROOT/cpanel-bundle"

echo "==> Installing dependencies"
cd "$ROOT"
npm ci || npm install

echo "==> Building the Node.js production server + client"
npm run build:cpanel

if [ ! -f "$BUILD/server/index.mjs" ]; then
  echo "Build output $BUILD/server/index.mjs was not created. Aborting." >&2
  exit 1
fi

echo "==> Assembling $OUT"
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R "$BUILD/server" "$OUT/server"
cp -R "$BUILD/client" "$OUT/client"
cp "$ROOT/deploy/app.js" "$OUT/app.js"
cp "$ROOT/deploy/.htaccess" "$OUT/.htaccess"
cp "$ROOT/deploy/.env.example" "$OUT/.env.example"
cp "$ROOT/deploy/package.json" "$OUT/package.json"
cp "$ROOT/deploy/README.md" "$OUT/README.md"

echo "==> Creating archive"
cd "$OUT"
rm -f "$ROOT/getgas-energen-cpanel.zip"
zip -qr "$ROOT/getgas-energen-cpanel.zip" . -x '*.DS_Store'

echo
echo "Done."
echo "  Folder : $OUT"
echo "  Archive: $ROOT/getgas-energen-cpanel.zip"
echo "Upload the archive contents to your cPanel application root and follow README.md."
