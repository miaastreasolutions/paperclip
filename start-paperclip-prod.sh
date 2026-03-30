#!/bin/zsh
export BETTER_AUTH_SECRET=7c4f8a9e2d1b5c3e8f0a2d4b6c9e1f3a5b7d9c2e4f6a8b0c3d5e7f9a1b3c5
export PAPERCLIP_AGENT_JWT_SECRET=7c4f8a9e2d1b5c3e8f0a2d4b6c9e1f3a5b7d9c2e4f6a8b0c3d5e7f9a1b3c5
export DATABASE_URL="postgresql://neondb_owner:npg_plGqFZbkvU45@ep-fancy-voice-am26mkp2-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
export BETTER_AUTH_URL="https://papel.astreasolutions.com.br"
export HOST=0.0.0.0
export PORT=3001
export PAPERCLIP_DEPLOYMENT_MODE=authenticated
export PAPERCLIP_DEPLOYMENT_EXPOSURE=private
export PAPERCLIP_MIGRATION_PROMPT=never
export PAPERCLIP_MIGRATION_AUTO_APPLY=true
export SERVE_UI=true
export PAPERCLIP_ALLOWED_HOSTNAMES=192.168.0.181,localhost,127.0.0.1,::1,papel.astreasolutions.com.br,mc.astreasolutions.com.br
export NODE_ENV=production

cd /Users/mia/.openclaw/workspace/05-PROJETOS/paperclip/server
exec node dist/index.js
