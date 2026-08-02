#!/usr/bin/env bash
# ONTAS easy installer — pick Docker (recommended) or Node
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ONTAS — one-click style install        ║${NC}"
echo -e "${BLUE}║   Open Nuclear Threat Awareness System   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "Educational only · public data · not an official warning system"
echo ""

has_docker=0
if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1 || docker-compose version >/dev/null 2>&1; then
    has_docker=1
  fi
fi

has_node=0
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  has_node=1
fi

mode="${1:-}"

if [[ -z "$mode" ]]; then
  echo "How do you want to run ONTAS?"
  echo ""
  if [[ $has_docker -eq 1 ]]; then
    echo "  1) Docker  (recommended — one command)"
  else
    echo "  1) Docker  (not detected — install Docker Desktop first)"
  fi
  if [[ $has_node -eq 1 ]]; then
    echo "  2) Node.js (npm install + npm run start)"
  else
    echo "  2) Node.js (not detected — need Node 22+)"
  fi
  echo "  3) Quit"
  echo ""
  read -r -p "Choose 1, 2, or 3: " mode
fi

case "$mode" in
  1|docker|d|D)
    if [[ $has_docker -ne 1 ]]; then
      echo -e "${YELLOW}Docker not found.${NC}"
      echo "Install Docker Desktop: https://www.docker.com/products/docker-desktop/"
      echo "Then run:  ./install.sh docker"
      exit 1
    fi
    echo ""
    echo -e "${GREEN}Building and starting with Docker…${NC}"
    if docker compose version >/dev/null 2>&1; then
      docker compose up --build -d
    else
      docker-compose up --build -d
    fi
    echo ""
    echo -e "${GREEN}✓ ONTAS is running${NC}"
    echo "  Open:  http://localhost:8080"
    echo "  Stop:  docker compose down"
    ;;
  2|node|n|N)
    if [[ $has_node -ne 1 ]]; then
      echo -e "${YELLOW}Node.js not found.${NC}"
      echo "Install Node 22 from https://nodejs.org then re-run ./install.sh node"
      exit 1
    fi
    echo ""
    echo -e "${GREEN}Installing dependencies…${NC}"
    if [[ -f package-lock.json ]]; then
      npm ci || npm install
    else
      npm install
    fi
    echo -e "${GREEN}Building (node-server preset)…${NC}"
    npm run build:node
    echo ""
    echo -e "${GREEN}✓ Starting on http://localhost:8080${NC}"
    echo "  Press Ctrl+C to stop"
    echo ""
    export HOST=0.0.0.0 PORT=8080 NITRO_HOST=0.0.0.0 NITRO_PORT=8080
    exec node .output/server/index.mjs
    ;;
  3|q|Q|quit)
    echo "OK — nothing installed."
    exit 0
    ;;
  *)
    echo "Unknown option: $mode"
    echo "Usage: ./install.sh [docker|node]"
    exit 1
    ;;
esac
