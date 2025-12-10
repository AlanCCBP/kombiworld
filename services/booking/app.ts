import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import 'dotenv/config';

import stopRouter from './src/routes/stopRoutes';
import routeRouter from './src/routes/routeRoutes';
import tripRouter from './src/routes/tripRoutes';
import ticketRouter from './src/routes/ticketRoutes';
import { contextMiddleware } from './src/middlewares/contextMiddleware';
import { prisma } from './src/lib/prisma';

const app: Application = express();

app.use(express.json());
app.use(contextMiddleware);
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use('/api/stops', stopRouter);
app.use('/api/routes', routeRouter);
app.use('/api/trips', tripRouter);
app.use('/api/tickets', ticketRouter);

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
