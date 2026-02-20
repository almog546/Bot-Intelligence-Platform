/*
  Warnings:

  - You are about to drop the column `equityAfterTrade` on the `Trade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "initialCapital" DOUBLE PRECISION NOT NULL DEFAULT 10000;

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "equityAfterTrade";
