#!/bin/bash

# Paperclip Start Script - Garante HOST=0.0.0.0
# Similar ao Mission Control

cd /Users/mia/.openclaw/workspace/05-PROJETOS/paperclip

# Exporta variáveis do .env
export $(grep -v '^#' .env | xargs)

# Força HOST em 0.0.0.0 para acesso externo
export HOST=0.0.0.0
export PORT=3100

echo "🚀 Iniciando Paperclip em http://$HOST:$PORT"
echo "   Acesse de outras máquinas: http://$(ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{print $2}' | head -1):$PORT"
echo ""

# Inicia o servidor
exec node ./server/dist/index.js
