/*
  Warnings:

  - Added the required column `category` to the `SaaSConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `SaaSConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SaaSConfig` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Productivity', 'Analytics', 'Ecommerce', 'Communication', 'Finance', 'AIML', 'CRM', 'Marketing', 'Other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive', 'developing');

-- AlterTable
ALTER TABLE "SaaSConfig" ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL;
