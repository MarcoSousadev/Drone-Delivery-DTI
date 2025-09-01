import { prisma } from "../../../infra/prisma/prisma.ts";
import {Prisma, type Order} from '@prisma/client'
import type { DeliveryRepository } from "./delivery-repository.ts";
import type { CreateDelivery } from "../interfaces/create-delivery.ts";



const asNumber = (v: unknown): number => {
  if (v && typeof v === "object" && "toNumber" in (v as any)) {
    return (v as any).toNumber();
  }
  return Number(v ?? 0);
};

export class PrismaDeliveryRepository implements DeliveryRepository {
 public async findAllCompletedWithDroneAndOrders() {
    const rows = await prisma.delivery.findMany({
      where: { finishedAt: { not: null } },
      include: {
        drone: { select: { id: true, baseLatitude: true, baseLongitude: true } },
        orders: {
          select: {
            id: true,
            latitude: true,
            longitude: true,
            packageWeight: true,
          },
        },
      },
      orderBy: { finishedAt: "desc" },
    });

    return rows
      .filter(d => d.finishedAt) // só por garantia
      .map((d) => ({
        id: d.id,
        droneId: d.droneId,
        startedAt: d.startedAt,
        finishedAt: d.finishedAt as Date,
        drone: {
          id: d.drone.id,
          baseLatitude: asNumber(d.drone.baseLatitude),
          baseLongitude: asNumber(d.drone.baseLongitude),
        },
        orders: d.orders.map((o) => ({
          id: o.id,
          latitude: asNumber(o.latitude),
          longitude: asNumber(o.longitude),
          packageWeight: asNumber(o.packageWeight),
        })),
      }));
  }

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
  async create({ droneId, orderIds, startedAt }: CreateDelivery) {
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
