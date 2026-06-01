#!/usr/bin/env bash

# ─────────────────────────────────────────────────────────────────────────────
# first-deploy-frontend.sh — Premier déploiement du frontend sur le serveur
# À exécuter UNE SEULE FOIS en tant que deploy sur le serveur
# Prérequis : server-setup.sh déjà exécuté
# Usage : bash first-deploy-frontend.sh <GITHUB_OWNER> <GITHUB_TOKEN>
# Ex    : bash first-deploy-frontend.sh moisegondo ghp_xxxxxxxxxxxx
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

GITHUB_OWNER="${1:?Usage: $0 <GITHUB_OWNER> <GITHUB_TOKEN>}"
GITHUB_TOKEN="${2:?Usage: $0 <GITHUB_OWNER> <GITHUB_TOKEN>}"
PROJECT_PATH="/opt/malaykaa/frontend"
FRONTEND_IMAGE="ghcr.io/${GITHUB_OWNER}/malaykaa-frontend:latest"

log() { echo -e "\n\033[1;32m▶ $*\033[0m"; }

# ── 1. Authentification ghcr.io ───────────────────────────────────────────
log "Connexion à GitHub Container Registry..."
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_OWNER" --password-stdin

# ── 2. Vérification des fichiers requis ───────────────────────────────────
log "Vérification des fichiers requis..."

for f in "$PROJECT_PATH/docker-compose.yml" "$PROJECT_PATH/nginx.conf"; do
  if [ ! -f "$f" ]; then
    echo "❌  Fichier manquant : $f"
    echo "    Copie-le depuis ton poste : scp frontend/$(basename $f) deploy@SERVEUR:$f"
    exit 1
  fi
done

# ── 3. Réseau Docker partagé ──────────────────────────────────────────────
log "Réseau Docker partagé..."
docker network create malaykaa_net 2>/dev/null || echo "Réseau déjà existant."

# ── 4. Pull de l'image frontend ───────────────────────────────────────────
log "Téléchargement de l'image frontend..."
docker pull "$FRONTEND_IMAGE"

# ── 5. Démarrage du frontend ──────────────────────────────────────────────
log "Démarrage du frontend..."
cd "$PROJECT_PATH"
FRONTEND_IMAGE="ghcr.io/${GITHUB_OWNER}/malaykaa-frontend" IMAGE_TAG=latest \
  docker compose up -d

# ── 6. Vérification ───────────────────────────────────────────────────────
log "Vérification des containers..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

SERVER_IP=$(curl -s ifconfig.me)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✅  Frontend déployé !"
echo ""
echo "   🌐  Frontend    : http://$SERVER_IP"
echo "   🌐  Frontend    : https://malayka.co"
echo "   🐳  Portainer   : http://$SERVER_IP:9000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ⚠️  Note : Ce script ne déploie que le frontend."
echo "    Assurez-vous que le backend est déjà opérationnel."
echo "    Les services doivent être sur le même réseau (malaykaa_net)."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"