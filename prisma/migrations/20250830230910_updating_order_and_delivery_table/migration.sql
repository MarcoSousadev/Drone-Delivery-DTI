/*
  Warnings:

  - You are about to drop the `_DeliveryToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_DeliveryToOrder" DROP CONSTRAINT "_DeliveryToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DeliveryToOrder" DROP CONSTRAINT "_DeliveryToOrder_B_fkey";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "deliveryId" TEXT;

-- DropTable
DROP TABLE "public"."_DeliveryToOrder";

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
