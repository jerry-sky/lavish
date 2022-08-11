/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Colour" AS ENUM ('Red', 'Green', 'Blue', 'Black', 'White');

-- CreateEnum
CREATE TYPE "GameCardStatus" AS ENUM ('Acquired', 'Charted', 'Hidden', 'Drawn');

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_id_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "Email" VARCHAR(255) NOT NULL,
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD COLUMN     "Password" TEXT NOT NULL,
ADD COLUMN     "Username" VARCHAR(63) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("ID");

-- CreateTable
CREATE TABLE "Player" (
    "ID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "gameID" INTEGER NOT NULL,
    "Red" SMALLINT NOT NULL,
    "Green" SMALLINT NOT NULL,
    "Blue" SMALLINT NOT NULL,
    "Black" SMALLINT NOT NULL,
    "White" SMALLINT NOT NULL,
    "Golden" SMALLINT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Game" (
    "ID" SERIAL NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Card" (
    "ID" SERIAL NOT NULL,
    "CostRed" INTEGER NOT NULL,
    "CostGreen" INTEGER NOT NULL,
    "CostBlue" INTEGER NOT NULL,
    "CostBlack" INTEGER NOT NULL,
    "CostWhite" INTEGER NOT NULL,
    "Score" INTEGER NOT NULL,
    "Colour" "Colour" NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "GameCard" (
    "ID" SERIAL NOT NULL,
    "cardID" INTEGER NOT NULL,
    "playerID" INTEGER,
    "Status" "GameCardStatus" NOT NULL,

    CONSTRAINT "GameCard_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_ID_key" ON "Player"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "Game_ID_key" ON "Game"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "Card_ID_key" ON "Card"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "GameCard_ID_key" ON "GameCard"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "User_ID_key" ON "User"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "Game"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_cardID_fkey" FOREIGN KEY ("cardID") REFERENCES "Card"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_playerID_fkey" FOREIGN KEY ("playerID") REFERENCES "Player"("ID") ON DELETE SET NULL ON UPDATE CASCADE;
