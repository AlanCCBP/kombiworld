const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

// Prisma Client import
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import routes
const userRoutes = require('./routes/userRoutes');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', userRoutes);

// Prisma client connection (optional: to check database connection)
async function start() {
  try {
    await prisma.$connect(); // Connect to the database
    console.log('Database connected successfully!');
    // Optional: Run migrations on start
    // await prisma.$executeRaw`SELECT 1`;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the application if connection fails
  }

  // Start the express app
  app.listen(4000, () => {
    console.log('Server running on port 4000');
  });
}

// Initialize the application
start();

// Export app for testing
module.exports = app;
