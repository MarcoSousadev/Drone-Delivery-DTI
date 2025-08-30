/*
  Warnings:

  - Added the required column `battery` to the `Drone` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DroneStatus" AS ENUM ('IDLE', 'LOADING', 'IN_FLIGHT', 'RETURNING');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'ALLOCATED', 'DELIVERED');

-- AlterTable
ALTER TABLE "public"."Drone" ADD COLUMN     "battery" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "public"."DroneStatus" NOT NULL DEFAULT 'IDLE';

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "public"."Delivery" (
    "id" TEXT NOT NULL,
    "droneId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_DeliveryToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeliveryToOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DeliveryToOrder_B_index" ON "public"."_DeliveryToOrder"("B");

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "public"."Drone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DeliveryToOrder" ADD CONSTRAINT "_DeliveryToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DeliveryToOrder" ADD CONSTRAINT "_DeliveryToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
