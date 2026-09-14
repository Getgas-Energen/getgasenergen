#!/usr/bin/env bash
# Builds the upload bundle for HostPinnacle cPanel (Node.js / Passenger).
#
# Usage:  bash scripts/build-cpanel.sh
# Output: dist-cpanel/  and  getgas-energen-cpanel.zip
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/dist-cpanel"

echo "==> Installing dependencies"
cd "$ROOT"
npm ci || npm install

echo "==> Building production server + client"
npm run build

if [ ! -d "$ROOT/.output/server" ]; then
  echo "Build output .output/server was not created. Aborting." >&2
  exit 1
fi

echo "==> Assembling $OUT"
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R "$ROOT/.output" "$OUT/.output"
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
echo "Upload the archive contents to your cPanel application root and follow deploy/README.md."
