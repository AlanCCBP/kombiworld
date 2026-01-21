import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import 'dotenv/config';

import { prisma } from './src/libs/prisma';

import routesRoutes from './src/modules/routes/routes.routes';
import stopsRoutes from './src/modules/stops/stops.routes';

import { contextMiddleware } from './src/middlewares/context.Middleware';

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

app.use('/routes', routesRoutes);
app.use('/stops', stopsRoutes);

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
