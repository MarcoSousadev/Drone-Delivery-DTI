import type { Delivery, Order, Prisma } from "@prisma/client";

export interface DeliveryRepository {
  create(data: Prisma.DeliveryCreateInput):Promise<Delivery>
  conclude(deliveryId:string,finishedAt: Date):Promise<Partial<Delivery>>
}