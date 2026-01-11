/*
  Warnings:

  - You are about to drop the column `enabled` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `ticketPrice` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Stop` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Stop` table. All the data in the column will be lost.
  - You are about to drop the column `plusMins` on the `Stop` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `driverid` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Trip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qrCode]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `basePrice` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameRaw` to the `Stop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyRevenue` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformCommission` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `available` on the `Trip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('SCHEDULED', 'BOARDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'CONFIRMED', 'USED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "JourneyStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "enabled",
DROP COLUMN "ticketPrice",
ADD COLUMN     "aiCheckedAt" TIMESTAMP(3),
ADD COLUMN     "aiFlags" JSONB,
ADD COLUMN     "basePrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stop" DROP COLUMN "enabled",
DROP COLUMN "name",
DROP COLUMN "plusMins",
ADD COLUMN     "aiCheckedAt" TIMESTAMP(3),
ADD COLUMN     "aiConfidence" DOUBLE PRECISION,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "nameNormalized" TEXT,
ADD COLUMN     "nameRaw" TEXT NOT NULL,
ADD COLUMN     "needsReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plusMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "province" TEXT,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "enabled",
DROP COLUMN "invoiceId",
DROP COLUMN "paymentStatus",
ADD COLUMN     "companyRevenue" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "platformCommission" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "seatNumber" INTEGER,
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "driverid",
DROP COLUMN "enabled",
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "driverId" TEXT NOT NULL,
ADD COLUMN     "status" "TripStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "vehicleId" TEXT,
DROP COLUMN "available",
ADD COLUMN     "available" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "logo" TEXT,
    "commission" DECIMAL(5,2) NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "model" TEXT,
    "year" INTEGER,
    "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "DriverStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "platformFee" DECIMAL(10,2) NOT NULL,
    "status" "JourneyStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyLeg" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "JourneyLeg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_cuit_key" ON "Company"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "Driver"("licenseNumber");

-- CreateIndex
CREATE INDEX "Journey_passengerId_idx" ON "Journey"("passengerId");

-- CreateIndex
CREATE INDEX "Journey_status_idx" ON "Journey"("status");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyLeg_ticketId_key" ON "JourneyLeg"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyLeg_journeyId_sequence_key" ON "JourneyLeg"("journeyId", "sequence");

-- CreateIndex
CREATE INDEX "Stop_routeId_idx" ON "Stop"("routeId");

-- CreateIndex
CREATE INDEX "Stop_nameNormalized_idx" ON "Stop"("nameNormalized");

-- CreateIndex
CREATE INDEX "Stop_city_province_idx" ON "Stop"("city", "province");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_qrCode_key" ON "Ticket"("qrCode");

-- CreateIndex
CREATE INDEX "Ticket_tripId_idx" ON "Ticket"("tripId");

-- CreateIndex
CREATE INDEX "Ticket_passengerId_idx" ON "Ticket"("passengerId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Trip_routeId_departureTime_idx" ON "Trip"("routeId", "departureTime");

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "Trip"("status");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyLeg" ADD CONSTRAINT "JourneyLeg_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyLeg" ADD CONSTRAINT "JourneyLeg_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
