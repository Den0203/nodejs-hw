import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// routes (НЕ виносимо '/notes' сюди)
app.use(notesRoutes);

// 404
app.use(notFoundHandler);

// error handler (останній)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
