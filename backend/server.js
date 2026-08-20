import app from './src/app.js';
import { env } from './src/config/env.js';
import { emailWorker } from './src/workers/email.worker.js';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Attendance System Backend running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
  emailWorker.start(); // Start background email processing
});

// Handle termination signals
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Gracefully closing server...`);
  emailWorker.stop();
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
