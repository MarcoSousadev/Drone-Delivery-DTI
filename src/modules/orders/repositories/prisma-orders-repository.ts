import { prisma } from "../../../infra/prisma/prisma.ts";
import {Prisma, type Order} from '@prisma/client'
import type { OrdersRepository } from "./ordersRepository.ts";
import type { PriorityQueue } from "../../../core/queue/priorityQueue.ts";

export class PrismaOrdersRepository implements OrdersRepository {
  sort(PriorityQueue: PriorityQueue) {
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
