import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'; // ✅ Import real de cors

import stopRouter from './routes/stopRoutes';
import routeRouter from './routes/routeRoutes';
import tripRouter from './routes/tripRoutes';
import ticketRouter from './routes/ticketRoutes';
import { contextMiddleware } from './middlewares/contextMiddleware';
import { PrismaClient } from '@prisma/client';

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(contextMiddleware);
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ CORS config
const allowedOrigins = [
  'http://localhost:3000',
  'http://reservations-service:4000',
];

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

// ✅ Rutas
app.use('/api/stops', stopRouter);
app.use('/api/routes', routeRouter);
app.use('/api/trips', tripRouter);
app.use('/api/tickets', ticketRouter);

// ✅ DB connection
async function start() {
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
