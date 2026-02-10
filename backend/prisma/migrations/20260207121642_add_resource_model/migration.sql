/*
  Warnings:

  - Made the column `user_low` on table `partners` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_high` on table `partners` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('SAFE_SEX', 'CONSENT', 'MENTAL_HEALTH', 'SEXUAL_WELLBEING');

-- AlterTable
-- Removed problematic ALTER TABLE "partners" which conflicts with generated columns

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "category" "ResourceCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "readTime" TEXT NOT NULL DEFAULT '5 min read',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");
