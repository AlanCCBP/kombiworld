var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { PrismaClient } = require('@prisma/client');

var authRouter = require('./routes/auth');
var carsRouter = require('./routes/cars');
var citiesRouter = require('./routes/cities');
var invoicesRouter = require('./routes/invoices');
var reservationsRouter = require('./routes/reservations');
var userRolesRouter = require('./routes/userRoles');
var routesRouter = require('./routes/routes');
var schedulesRouter = require('./routes/schedules');
var stopsRouter = require('./routes/stops');
var usersRouter = require('./routes/users');

var app = express();
const prisma = new PrismaClient();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/cars', carsRouter);
app.use('/cities', citiesRouter);
app.use('/invoices', invoicesRouter);
app.use('/reservations', reservationsRouter);
app.use('/roles', userRolesRouter);
app.use('/routes', routesRouter);
app.use('/schedules', schedulesRouter);
app.use('/stops', stopsRouter);
app.use('/users', usersRouter);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
