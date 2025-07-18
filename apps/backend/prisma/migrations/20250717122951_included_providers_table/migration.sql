/*
  Warnings:

  - You are about to drop the column `providers` on the `SaaSConfig` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - Added the required column `BillingPlans` to the `SaaSConfig` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('google', 'github', 'apple', 'microsoft');

-- AlterTable
ALTER TABLE "SaaSConfig" DROP COLUMN "providers",
ADD COLUMN     "BillingPlans" JSONB NOT NULL,
ADD COLUMN     "production" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "provider";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider";

-- DropEnum
DROP TYPE "Provider";

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saasConfigId" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,
    "appId" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_saasConfigId_type_key" ON "Provider"("saasConfigId", "type");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_saasConfigId_fkey" FOREIGN KEY ("saasConfigId") REFERENCES "SaaSConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
