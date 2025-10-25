import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
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

app.use('/api/stops', stopRouter);
app.use('/api/routes', routeRouter);
app.use('/api/trips', tripRouter);
app.use('/api/tickets', ticketRouter);

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
