/*
  Warnings:

  - You are about to drop the column `maxDrawdownPercentage` on the `Strategy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Strategy" DROP COLUMN "maxDrawdownPercentage";

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "netProfit" DOUBLE PRECISION NOT NULL,
    "strategyId" TEXT NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
