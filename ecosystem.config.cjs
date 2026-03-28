const fs = require('fs');
const path = require('path');

// Carrega variáveis do .env
function loadEnvFile(filePath) {
  try {
    const envContent = fs.readFileSync(filePath, 'utf-8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          // Remove aspas se presentes
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          envVars[key] = value;
        }
      }
    });
    return envVars;
  } catch (error) {
    console.error('Erro ao carregar .env:', error);
    return {};
  }
}

const envVars = loadEnvFile(path.join(__dirname, '.env'));

module.exports = {
  apps: [
    {
      name: 'paperclip-web',
      script: './server/dist/index.js',
      cwd: '/Users/mia/.openclaw/workspace/05-PROJETOS/paperclip',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3100,
        HOST: '0.0.0.0',
        ...envVars,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'paperclip-worker',
      script: './server/dist/worker.js',
      cwd: '/Users/mia/.openclaw/workspace/05-PROJETOS/paperclip',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'background',
        ...envVars,
      },
      error_file: './logs/worker-err.log',
      out_file: './logs/worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
