import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();

app.use(pino());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get('/', (_req, res) => {
  res.send('API is running');
});

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error', err);
    process.exit(1);
  });
