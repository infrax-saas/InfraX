/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubId" TEXT,
ALTER COLUMN "googleId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
