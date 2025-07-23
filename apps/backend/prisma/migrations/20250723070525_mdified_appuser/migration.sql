/*
  Warnings:

  - You are about to drop the column `saasId` on the `AppUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "saasId";

-- CreateTable
CREATE TABLE "_AppUserToSaaSConfig" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppUserToSaaSConfig_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AppUserToSaaSConfig_B_index" ON "_AppUserToSaaSConfig"("B");

-- AddForeignKey
ALTER TABLE "_AppUserToSaaSConfig" ADD CONSTRAINT "_AppUserToSaaSConfig_A_fkey" FOREIGN KEY ("A") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppUserToSaaSConfig" ADD CONSTRAINT "_AppUserToSaaSConfig_B_fkey" FOREIGN KEY ("B") REFERENCES "SaaSConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
