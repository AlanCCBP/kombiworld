var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { PrismaClient } = require('@prisma/client');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var entrepreneurshipRouter = require('./routes/entrepreneurship');
var socialMediaRouter = require('./routes/socialMedia');
var locationRouter = require('./routes/location');
var imageRouter = require('./routes/image');

var app = express();
const prisma = new PrismaClient();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/entrepreneurships', entrepreneurshipRouter);
app.use('/social-media', socialMediaRouter);
app.use('/locations', locationRouter);
app.use('/images', imageRouter);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
