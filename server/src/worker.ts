#!/usr/bin/env node
/**
 * Paperclip Background Worker
 * Processa tarefas em background como heartbeats, rotinas e jobs de plugins
 */

import { createDb } from "@paperclipai/db";
import { loadConfig } from "./config.js";
import { heartbeatService, routineService } from "./services/index.js";
import { logger } from "./middleware/logger.js";

const WORKER_INTERVAL_MS = 30_000; // 30 segundos

async function startWorker() {
  logger.info("🚀 Starting Paperclip background worker...");

  const config = loadConfig();
  
  // Criar conexão com o banco
  const db = createDb(config.databaseUrl || "postgres://localhost:5432/paperclip");
  
  // Inicializar serviços
  const heartbeat = heartbeatService(db);
  const routine = routineService(db);

  logger.info("✅ Worker initialized and ready");

  // Loop principal do worker
  async function workerLoop() {
    try {
      // Processar heartbeats pendentes
      const heartbeatResult = await heartbeat.tickTimers();
      if (heartbeatResult.enqueued > 0) {
        logger.info({ ...heartbeatResult }, "Heartbeat worker processed runs");
      }

      // Processar rotinas agendadas
      const routineResult = await routine.tickScheduledTriggers();
      if (routineResult.triggered > 0) {
        logger.info({ ...routineResult }, "Routine worker processed routines");
      }

      // Retomar runs que estavam em fila
      await heartbeat.resumeQueuedRuns();

    } catch (error) {
      logger.error({ error }, "Worker loop error");
    }
  }

  // Executar imediatamente e depois a cada intervalo
  await workerLoop();
  const intervalId = setInterval(workerLoop, WORKER_INTERVAL_MS);

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    logger.info("🛑 Worker received SIGTERM, shutting down gracefully...");
    clearInterval(intervalId);
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    logger.info("🛑 Worker received SIGINT, shutting down gracefully...");
    clearInterval(intervalId);
    process.exit(0);
  });

  logger.info(`⏱️  Worker running every ${WORKER_INTERVAL_MS}ms`);
}

startWorker().catch((error) => {
  logger.error({ error }, "Failed to start worker");
  process.exit(1);
});
