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

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
  res.json({ success: true, message: 'Business Panel API is running', time: new Date() });
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
