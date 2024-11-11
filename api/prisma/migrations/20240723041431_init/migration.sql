-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Role
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL, -- Example: Admin, Passenger, Driver
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UserRole (Relation between users and roles)
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE
);

-- CreateTable: City
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Car
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL, -- Car seating capacity
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Stop (Bus stop)
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL, -- Name of the stop
    "cityId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Stop_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT
);

-- CreateTable: Route (Journey)
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL, -- Name of the route
    "startCityId" TEXT NOT NULL,
    "endCityId" TEXT NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Route_startCityId_fkey" FOREIGN KEY ("startCityId") REFERENCES "City"("id") ON DELETE RESTRICT,
    CONSTRAINT "Route_endCityId_fkey" FOREIGN KEY ("endCityId") REFERENCES "City"("id") ON DELETE RESTRICT
);

-- CreateTable: RouteStop (Assignment of stops to a route)
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "stopOrder" INTEGER NOT NULL, -- Order of the stop in the route

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE,
    CONSTRAINT "RouteStop_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE CASCADE
);

-- CreateTable: Schedule (Journey schedule)
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL, -- Driver (user with the role of driver)
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Schedule_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE,
    CONSTRAINT "Schedule_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL,
    CONSTRAINT "Schedule_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL
);

-- CreateTable: Reservation (Booking)
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL, -- Passenger (user with the role of passenger)
    "scheduleId" TEXT NOT NULL, -- Specific schedule
    "startStopId" TEXT NOT NULL, -- Pick-up stop
    "endStopId" TEXT NOT NULL, -- Drop-off stop
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Reservation_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE,
    CONSTRAINT "Reservation_startStopId_fkey" FOREIGN KEY ("startStopId") REFERENCES "Stop"("id") ON DELETE RESTRICT,
    CONSTRAINT "Reservation_endStopId_fkey" FOREIGN KEY ("endStopId") REFERENCES "Stop"("id") ON DELETE RESTRICT
);

-- CreateTable: Invoice (Invoice)
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL, -- User (client to whom the invoice is issued)
    "reservationId" TEXT NOT NULL, -- Reservation associated with the invoice
    "amount" DECIMAL(10, 2) NOT NULL, -- Total amount of the invoice
    "status" TEXT NOT NULL, -- Example: 'paid', 'unpaid', 'pending'
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Invoice creation date
    "dueDate" TIMESTAMP(3), -- Due date of the invoice
    "updatedAt" TIMESTAMP(3) NOT NULL, -- Last updated date

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Invoice_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE
);

-- CreateTable: PasswordRecoveryToken (Password recovery token)
CREATE TABLE "PasswordRecoveryToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL, -- User who requested the recovery
    "token" TEXT NOT NULL, -- The unique token for password recovery
    "expiresAt" TIMESTAMP(3) NOT NULL, -- Expiration date of the token
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Token creation date

    CONSTRAINT "PasswordRecoveryToken_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PasswordRecoveryToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- CreateTable: AuthToken (Authentication token)
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL, -- User who owns the authentication token
    "token" TEXT NOT NULL, -- The unique token for authentication
    "expiresAt" TIMESTAMP(3) NOT NULL, -- Expiration date of the token
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Token creation date

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- CreateIndex: Unique email for User
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
