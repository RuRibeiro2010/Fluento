/**
 * FLUENTO EXPRESS SERVER ENTRYPOINT
 * 
 * Configures the Express server for both Development (via Vite middleware)
 * and Production (serving static dist/ assets).
 * Serves secure /api/* endpoints on port 3000 at 0.0.0.0.
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { aiRouter } from './server/routes/ai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers
  const isProd = process.env.NODE_ENV === 'production';
  
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': isProd 
            ? ["'self'"] 
            : ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for Vite/HMR in dev
          'img-src': ["'self'", 'data:', 'blob:', 'https:*'],
          'connect-src': ["'self'", 'ws:', 'wss:', 'https:*'],
          'style-src': ["'self'", "'unsafe-inline'"], // Tailwind requires inline styles
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // Rate Limiting for API routes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
    skip: (req) => req.path === '/api/health', // Don't rate limit health checks
  });

  // JSON Body Parser with security limit
  app.use(express.json({ limit: '1mb' }));

  // Apply rate limiter to API routes
  app.use('/api/', apiLimiter);

  // API Routes
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
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler - Security Hardened
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Fluento Server Error]:', err.stack);
    }
    
    const status = typeof err.status === 'number' ? err.status : (typeof err.statusCode === 'number' ? err.statusCode : 500);
    const isProd = process.env.NODE_ENV === 'production';
    
    res.status(status).json({
      error: isProd ? 'An internal server error occurred' : err.message,
      ...(isProd ? {} : { stack: err.stack })
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Fluento Server] Running on http://0.0.0.0:${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Fluento Server] Fatal startup failure:', err);
  process.exit(1);
});
