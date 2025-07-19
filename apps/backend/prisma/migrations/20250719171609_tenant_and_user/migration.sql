/*
  Warnings:

  - You are about to drop the column `userId` on the `SaaSConfig` table. All the data in the column will be lost.
  - Added the required column `tenantId` to the `SaaSConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saasId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SaaSConfig" DROP CONSTRAINT "SaaSConfig_userId_fkey";

-- AlterTable
ALTER TABLE "SaaSConfig" DROP COLUMN "userId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "saasId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_saasId_fkey" FOREIGN KEY ("saasId") REFERENCES "SaaSConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaaSConfig" ADD CONSTRAINT "SaaSConfig_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
