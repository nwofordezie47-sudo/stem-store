import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import connectDB from './config/db';
import { globalLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import stemRoutes from './routes/stems';
import paymentRoutes from './routes/payments';
import purchaseRoutes from './routes/purchases';
import favoriteRoutes from './routes/favorites';
import adminRoutes from './routes/admin';

const app = express();

// ─── Reverse Proxy Trust (Required for Render & rate-limiting) ─────────────
app.set('trust proxy', 1);

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
// Strip any accidental trailing slashes from allowed origins
const normalizeUrl = (url?: string) => url?.trim().replace(/\/+$/, '');
const allowedOrigins = [
  normalizeUrl(process.env.CLIENT_URL),
  normalizeUrl(process.env.ADMIN_URL),
].filter((o): o is string => Boolean(o));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
      callback(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials: true,
  })
);

// ─── Raw body for Paystack webhook ──────────────────────────────────────────
// MUST be registered before express.json() — once json() has parsed the body,
// express.raw() cannot re-read it, and HMAC verification will always fail.
app.use(
  '/api/payments/webhook',
  express.raw({ type: '*/*' })
);

// ─── Body parsers ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Global rate limiter ─────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/stems', stemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ────────────────────────────────────────────────────
// All errors forwarded via next(err) or thrown in asyncHandler land here.
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.status ?? 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message;
  res.status(status).json({ error: message });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
