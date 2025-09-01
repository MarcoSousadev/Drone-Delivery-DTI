import { prisma } from "../../../infra/prisma/prisma.ts";
import {Prisma, type Order} from '@prisma/client'
import type { PriorityQueue } from "../../../core/queue/priorityQueue.ts";
import type { DeliveryRepository } from "./delivery-repository.ts";
import type { DeliveryWithOrders } from "../interfaces/delivery-with-orders.ts";

interface CreateDeliveryDTO {
  droneId: string;
  orderIds: string[];
  startedAt?: Date;
};

export class PrismaDeliveryRepository implements DeliveryRepository {
  async findOpenByDroneId(droneId: string){
    return prisma.delivery.findFirst({
    where: {
      droneId,
      finishedAt: null,
    },
    select: {
      id: true,
      droneId: true,
      startedAt: true,
      finishedAt: true,
      orders: {
        select: { id: true },
      },
    },
  });
  }
  async setStartedAt(id: string, date: Date) {
     await prisma.delivery.update({
      where:{
        id
      },
      data: { startedAt: date}
    })
    
  }
  async setFinishedAt(id: string, date: Date) {
    await prisma.delivery.update({
      where:{
        id
      },
      data: { finishedAt: date}
    })
  }
  async clearFinishedAt(id: string): Promise<void> {
    await prisma.delivery.update({
      where:{
        id
      },
      data: { finishedAt: null}
    })
  }
  async findByIdWithOrders(deliveryId: string) {
      return prisma.delivery.findUnique({
      where: { id: deliveryId },
      select: {
        id: true,
        droneId: true,
        startedAt: true,
        finishedAt: true,
        orders: { select: { id: true } },
      },
    });
  }
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
  async create({ droneId, orderIds, startedAt }: CreateDeliveryDTO) {
    const delivery = await prisma.delivery.create({
      data: {
        drone: { connect: { id: droneId } },
        orders: { connect: orderIds.map(id => ({ id })) },
        startedAt: startedAt ?? new Date(),
      },
      include: { drone: true, orders: true },
    });
      return delivery
 
}
}
