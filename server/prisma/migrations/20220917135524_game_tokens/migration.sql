/*
  Warnings:

  - Added the required column `Black` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Blue` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Golden` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Green` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Red` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `White` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "Black" SMALLINT NOT NULL,
ADD COLUMN     "Blue" SMALLINT NOT NULL,
ADD COLUMN     "Golden" SMALLINT NOT NULL,
ADD COLUMN     "Green" SMALLINT NOT NULL,
ADD COLUMN     "Red" SMALLINT NOT NULL,
ADD COLUMN     "White" SMALLINT NOT NULL;
