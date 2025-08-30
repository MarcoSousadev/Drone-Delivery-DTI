import { prisma } from "../../../infra/prisma/prisma.ts";
import {Prisma, type Order} from '@prisma/client'
import type { PriorityQueue } from "../../../core/queue/priorityQueue.ts";
import type { DeliveryRepository } from "./delivery-repository.ts";

export class PrismaDeliveryRepository implements DeliveryRepository {
  async conclude(deliveryId: string, finishedAt: Date = new Date()) {
    const packageDelivered = await prisma.delivery.update({
      where: {
        id: deliveryId
      },
      data: {
        finishedAt
      }
    })

    return packageDelivered
  }
  async create(data: Prisma.DeliveryCreateInput) {
    const delivery = await prisma.delivery.create({
          data,
        })

      return delivery
  }
 
}
