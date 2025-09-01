import type { Delivery, Prisma } from "@prisma/client";
import type { DeliveryWithOrders } from "../interfaces/delivery-with-orders.ts";

interface CreateDeliveryDTO {
  droneId: string;
  orderIds: string[];
  startedAt?: Date;
};

export interface DeliveryRepository {
  findOpenByDroneId(droneId: string):Promise<DeliveryWithOrders | null>
  create({ droneId, orderIds, startedAt }: CreateDeliveryDTO):Promise<Delivery>
  conclude(deliveryId:string,finishedAt: Date):Promise<Partial<Delivery>>
  setStartedAt(id: string, date: Date):Promise<void>
  setFinishedAt(id: string, date: Date):Promise<void>
  clearFinishedAt(id: string):Promise<void>
  findByIdWithOrders(deliveryId: string):Promise<{
  id: string;
  droneId: string;
  startedAt: Date;
  finishedAt: Date | null;
  orders: { id: string }[];
} | null>
}