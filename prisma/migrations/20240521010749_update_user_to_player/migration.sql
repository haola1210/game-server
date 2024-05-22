/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRoom" DROP CONSTRAINT "UserRoom_roomId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoom" DROP CONSTRAINT "UserRoom_userId_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserRoom";

-- CreateTable
CREATE TABLE "PlayerRoom" (
    "id" SERIAL NOT NULL,
    "playerId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "PlayerRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerRoom_playerId_key" ON "PlayerRoom"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerRoom" ADD CONSTRAINT "PlayerRoom_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoom" ADD CONSTRAINT "PlayerRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
