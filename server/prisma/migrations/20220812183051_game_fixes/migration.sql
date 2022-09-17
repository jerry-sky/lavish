/*
  Warnings:

  - Added the required column `gameID` to the `GameCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameCard" ADD COLUMN     "gameID" INTEGER NOT NULL,
ALTER COLUMN "Status" SET DEFAULT 'Hidden';

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "Game"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
