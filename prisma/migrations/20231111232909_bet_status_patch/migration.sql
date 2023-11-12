/*
  Warnings:

  - The `status` column on the `Bet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'WON', 'LOST');

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "status",
ADD COLUMN     "status" "BetStatus" NOT NULL DEFAULT 'PENDING';
