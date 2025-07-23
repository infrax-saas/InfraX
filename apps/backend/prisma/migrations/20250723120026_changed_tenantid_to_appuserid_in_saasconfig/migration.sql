/*
  Warnings:

  - You are about to drop the column `tenantId` on the `SaaSConfig` table. All the data in the column will be lost.
  - You are about to drop the `_AppUserToSaaSConfig` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `appUserId` to the `SaaSConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SaaSConfig" DROP CONSTRAINT "SaaSConfig_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "_AppUserToSaaSConfig" DROP CONSTRAINT "_AppUserToSaaSConfig_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppUserToSaaSConfig" DROP CONSTRAINT "_AppUserToSaaSConfig_B_fkey";

-- AlterTable
ALTER TABLE "SaaSConfig" DROP COLUMN "tenantId",
ADD COLUMN     "appUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AppUserToSaaSConfig";

-- AddForeignKey
ALTER TABLE "SaaSConfig" ADD CONSTRAINT "SaaSConfig_appUserId_fkey" FOREIGN KEY ("appUserId") REFERENCES "AppUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
