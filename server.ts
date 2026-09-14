/**
 * FLUENTO EXPRESS SERVER ENTRYPOINT
 * 
 * Configures the Express server for both Development (via Vite middleware)
 * and Production (serving static dist/ assets).
 * Serves secure /api/* endpoints on port 3000 at 0.0.0.0.
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { aiRouter } from './server/routes/ai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with security limit
  app.use(express.json({ limit: '1mb' }));

  // API Routes FIRST
  app.use('/api/ai', aiRouter);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'fluento-server',
      timestampIso: new Date().toISOString(),
      aiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // Vite middleware for Development vs Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Fluento Server] Running on http://0.0.0.0:${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Fluento Server] Fatal startup failure:', err);
  process.exit(1);
});
