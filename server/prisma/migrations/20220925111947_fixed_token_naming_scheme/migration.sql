/*
  Warnings:

  - You are about to drop the column `CostBlack` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CostBlue` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CostGreen` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CostRed` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CostWhite` on the `Card` table. All the data in the column will be lost.
  - Added the required column `Black` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Blue` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Green` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Red` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `White` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "CostBlack",
DROP COLUMN "CostBlue",
DROP COLUMN "CostGreen",
DROP COLUMN "CostRed",
DROP COLUMN "CostWhite",
ADD COLUMN     "Black" INTEGER NOT NULL,
ADD COLUMN     "Blue" INTEGER NOT NULL,
ADD COLUMN     "Green" INTEGER NOT NULL,
ADD COLUMN     "Red" INTEGER NOT NULL,
ADD COLUMN     "White" INTEGER NOT NULL;
