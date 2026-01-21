/*
  Warnings:

  - A unique constraint covering the columns `[routeId,sequence]` on the table `Stop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequence` to the `Stop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stop" ADD COLUMN     "sequence" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stop_routeId_sequence_key" ON "Stop"("routeId", "sequence");
