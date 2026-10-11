#!/usr/bin/env bash
# Publica o site no GitHub Pages: gera o build e envia a pasta dist para a branch gh-pages.
# Uso: npm run publicar
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
REMOTO=$(git remote get-url origin)
TMP=$(mktemp -d)
cp -R dist/. "$TMP"
touch "$TMP/.nojekyll"
cd "$TMP"
git init -q -b gh-pages
git add -A
git commit -q -m "Publicação $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTO" gh-pages
cd - >/dev/null
rm -rf "$TMP"
echo "Publicado. Em 1 ou 2 minutos o site atualiza."
