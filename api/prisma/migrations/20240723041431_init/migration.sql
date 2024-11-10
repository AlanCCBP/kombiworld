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
    "name" TEXT NOT NULL, -- Ej. Admin, Pasajero, Chofer
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable: UserRole (Relación entre usuarios y roles)
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
    "capacity" INTEGER NOT NULL, -- Capacidad del coche (asientos)
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Stop (Parada)
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL, -- Nombre de la parada
    "cityId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Stop_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT
);

-- CreateTable: Route (Recorrido)
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL, -- Nombre del recorrido
    "startCityId" TEXT NOT NULL,
    "endCityId" TEXT NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Route_startCityId_fkey" FOREIGN KEY ("startCityId") REFERENCES "City"("id") ON DELETE RESTRICT,
    CONSTRAINT "Route_endCityId_fkey" FOREIGN KEY ("endCityId") REFERENCES "City"("id") ON DELETE RESTRICT
);

-- CreateTable: RouteStop (Asignación de paradas a un recorrido)
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "stopOrder" INTEGER NOT NULL, -- Orden de la parada en el recorrido

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE,
    CONSTRAINT "RouteStop_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE CASCADE
);

-- CreateTable: Schedule (Horario de un recorrido)
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL, -- Chofer (usuario con rol de chofer)
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Schedule_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE,
    CONSTRAINT "Schedule_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL,
    CONSTRAINT "Schedule_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL
);

-- CreateTable: Reservation (Reserva)
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL, -- Pasajero (usuario con rol de pasajero)
    "scheduleId" TEXT NOT NULL, -- Horario específico
    "startStopId" TEXT NOT NULL, -- Parada de subida
    "endStopId" TEXT NOT NULL, -- Parada de bajada
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Reservation_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE,
    CONSTRAINT "Reservation_startStopId_fkey" FOREIGN KEY ("startStopId") REFERENCES "Stop"("id") ON DELETE RESTRICT,
    CONSTRAINT "Reservation_endStopId_fkey" FOREIGN KEY ("endStopId") REFERENCES "Stop"("id") ON DELETE RESTRICT
);

-- CreateIndex: Unique email for User
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
