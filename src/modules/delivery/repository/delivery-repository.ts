import type { Delivery } from "@prisma/client";
import type { DeliveryWithOrders } from "../interfaces/delivery-with-orders.ts";
import type { CreateDelivery } from "../interfaces/create-delivery.ts";
import type { CompletedDeliveryWithDroneAndOrders } from "../interfaces/find-all-with-orders-and-drone.ts";



export interface DeliveryRepository {
  findAllCompletedWithDroneAndOrders():Promise<CompletedDeliveryWithDroneAndOrders[] | null>
  findOpenByDroneId(droneId: string):Promise<DeliveryWithOrders | null>
  create({ droneId, orderIds, startedAt }: CreateDelivery):Promise<Delivery>
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