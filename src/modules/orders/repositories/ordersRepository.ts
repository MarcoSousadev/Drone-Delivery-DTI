import type { $Enums, Order, Prisma } from "@prisma/client";

export interface OrdersRepository {
  create(data: Prisma.OrderCreateInput):Promise<Order>
  findMany():Promise<Order[]>
  findById(id: string):Promise<Order | null>
  findFirstAvailable(): Promise<Order | null>
  findManyPending(id: string):Promise<Order[]>
  updateStatus(id: string, status: $Enums.OrderStatus): Promise<void>
}