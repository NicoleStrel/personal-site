#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cp "$ROOT/shared/data/experience.csv" "$ROOT/site-2022/src/data/experience.csv"
cp "$ROOT/shared/data/projects.csv" "$ROOT/site-2022/src/data/projects.csv"

mkdir -p "$ROOT/site/public/data"
cp "$ROOT/shared/data/"*.csv "$ROOT/site/public/data/"

mkdir -p "$ROOT/site/public/img/exp" "$ROOT/site/public/img/projects" "$ROOT/site/public/img/indiehacking"
cp "$ROOT/shared/img/sketch.png" "$ROOT/site/public/img/sketch.png"
cp -R "$ROOT/shared/img/exp/"* "$ROOT/site/public/img/exp/" 2>/dev/null || true
cp -R "$ROOT/shared/img/projects/"* "$ROOT/site/public/img/projects/" 2>/dev/null || true
cp -R "$ROOT/shared/img/indiehacking/"* "$ROOT/site/public/img/indiehacking/" 2>/dev/null || true

mkdir -p "$ROOT/site/src/assets"
cp "$ROOT/shared/img/sketch.png" "$ROOT/site/src/assets/sketch.png"
