import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import superEditorRoutes from './routes/superEditorRoutes.js';
import { loadGeneratedRoutes } from './routes/_generatedRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// CLIENT_URL may hold several comma-separated origins, e.g.
//   CLIENT_URL=https://business-panel.vercel.app,http://localhost:5173
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

// Vercel gives every preview deployment its own hostname, so those are matched
// by pattern rather than being listed one by one. Set STRICT_CORS=true to turn
// that off and accept only the exact origins named in CLIENT_URL.
const previewOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const strictCors = process.env.STRICT_CORS === 'true';

const isAllowedOrigin = (origin) => {
  if (allowedOrigins.includes(origin)) return true;
  if (!strictCors && previewOriginPattern.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header: same-origin request, curl, Postman, health checks.
      if (!origin) return callback(null, true);
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`Blocked by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Business Panel API is running',
    time: new Date(),
    allowedOrigins,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/super-editor', superEditorRoutes);

// Every generated CRUD module (products, sales, purchases, etc.) is mounted
// dynamically from the manifest produced by dev-tools/generate-crud.mjs so
// adding a new module never requires touching this file.
const generatedRoutes = await loadGeneratedRoutes();
for (const { path, route } of generatedRoutes) {
  app.use(path, route);
}

app.use(notFound);
app.use(errorHandler);

export default app;
