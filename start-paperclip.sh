#!/bin/zsh
export HOST=0.0.0.0
export PORT=3001
export NODE_ENV=development
export SERVE_UI=false
export PAPERCLIP_MIGRATION_PROMPT=never
export PAPERCLIP_MIGRATION_AUTO_APPLY=true

cd /Users/mia/.openclaw/workspace/05-PROJETOS/paperclip/server
exec pnpm exec tsx src/index.ts
