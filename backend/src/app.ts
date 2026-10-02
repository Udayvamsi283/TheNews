import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { csrfProtection } from './middleware/csrf.middleware.js';
import apiRouter from './routes/index.js';

export const createApp = (): Application => {
  const app = express();

  // Trust reverse proxy for secure cookies and accurate IP rate limiting on Render
  app.set('trust proxy', 1);

  // Security Headers
  app.use(helmet());

  // CORS Configuration - In production, restrict strictly to CLIENT_URL
  const allowedOrigins: string[] =
    env.NODE_ENV === 'production'
      ? env.CLIENT_URL.includes(',')
        ? env.CLIENT_URL.split(',').map((u) => u.trim())
        : [env.CLIENT_URL]
      : [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, or same-origin server healthchecks)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS origin ${origin} not permitted.`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-csrf-token']
    })
  );

  // Cookie Parser
  app.use(cookieParser(env.COOKIE_SECRET));

  // CSRF Protection
  app.use(csrfProtection);

  // Rate Limiting
  app.use('/api', apiRateLimiter);

  // Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  }

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Versioned API Routes
  app.use('/api/v1', apiRouter);

  // 404 Handler for unmatched routes
  app.use(notFoundHandler);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
