/*
  Warnings:

  - The `priority` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "priority",
ADD COLUMN     "priority" "public"."Priority" NOT NULL DEFAULT 'LOW';
