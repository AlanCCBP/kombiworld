import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import 'dotenv/config';
import authRouter from './src/modules/auth/auth.routes';
import companiesRoutes from './src/modules/companies/companies.routes';

import { authMiddleware } from './src/middlewares/auth.middleware';
import { errorMiddleware } from './src/middlewares/error.middleware';

import { prisma } from './src/libs/prisma';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Application = express();
app.set('trust proxy', 1);
const corsOrigins = process.env.CORS_ORIGINS || '';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(errorMiddleware);

app.use('/auth', authRouter);
app.use('/companies', companiesRoutes);
app.use(authMiddleware);

async function start(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

start();

export default app;
