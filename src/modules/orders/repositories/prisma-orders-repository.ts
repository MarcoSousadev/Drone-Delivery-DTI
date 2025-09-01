import { prisma } from "../../../infra/prisma/prisma.ts";
import {$Enums, Prisma, type Order} from '@prisma/client'
import type { OrdersRepository } from "./ordersRepository.ts";
import type { PriorityQueue } from "../../../core/queue/priorityQueue.ts";

export class PrismaOrdersRepository implements OrdersRepository {
  async findManyPending(status: $Enums.OrderStatus){
    const pedingOrders = await prisma.order.findMany({
      where:{
        status: "PENDING"
      }
    })
    return pedingOrders
  }
 async updateStatus(id: string, status: $Enums.OrderStatus) {
    await prisma.order.update({
      where: { id },
      data: { status: status as $Enums.OrderStatus },
    });
  
  }
  async findFirstAvailable() {
   return prisma.order.findFirst({
    where:{
      status:
        "PENDING",
      deliveryId: null,
    },
    orderBy: { createdAt: "asc" }
   })
  }
  async findById(id: string){
    const order = await prisma.order.findUnique({
      where: { id }
    })

    return order
  }
  async sort(PriorityQueue: PriorityQueue) {
    throw new Error("Method not implemented.");
  }
  async findMany() {
    const multOrders = prisma.order.findMany({
      where: {
        packageWeight: {
          lte: 2.3
        }
      }
    })
    return multOrders
  }
  async create(data: Prisma.OrderCreateInput) {
    const order = await prisma.order.create({
          data,
   
        })

      return order
  }
  async findPending() {
    return prisma.order.findMany({
      where: { status: "PENDING" }
    });
  }

  async markAsAllocated(orderIds: string[]) {
    return prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: "ALLOCATED" }
    });
  }
}
