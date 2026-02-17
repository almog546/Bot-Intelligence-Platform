/*
  Warnings:

  - Added the required column `maxDrawdown` to the `Strategy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "maxDrawdown" DOUBLE PRECISION NOT NULL;
