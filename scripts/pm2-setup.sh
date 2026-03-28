#!/bin/bash

# Paperclip PM2 Setup Script
# Este script configura o Paperclip para rodar com PM2

echo "🚀 Configurando Paperclip no PM2..."

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 não encontrado. Instalando..."
    npm install -g pm2
fi

# Criar diretório de logs se não existir
mkdir -p logs

# Build do projeto
echo "📦 Building project..."
pnpm build

# Iniciar com PM2
echo "🟢 Iniciando Paperclip no PM2..."
pm2 start ecosystem.config.js

# Salvar configuração para iniciar no boot
pm2 save

# Configurar startup script (requer sudo)
echo "⚙️  Configurando inicialização automática..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sudo pm2 startup launchd
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo pm2 startup systemd
fi

echo "✅ Paperclip configurado no PM2!"
echo ""
echo ""
echo "✅ Dois serviços configurados:"
echo "  - paperclip-web    (API Web na porta 3100)"
echo "  - paperclip-worker (Background worker)"
echo ""
echo "Comandos úteis:"
echo "  pm2 status                      - Ver status de todos os serviços"
echo "  pm2 logs paperclip-web          - Logs da API web"
echo "  pm2 logs paperclip-worker       - Logs do worker"
echo "  pm2 restart paperclip-web       - Reiniciar API"
echo "  pm2 restart paperclip-worker    - Reiniciar worker"
echo "  pm2 stop all                    - Parar todos os serviços"
echo "  pm2 monit                       - Monitor de recursos"
echo ""
echo "Acesse: http://localhost:3100"
