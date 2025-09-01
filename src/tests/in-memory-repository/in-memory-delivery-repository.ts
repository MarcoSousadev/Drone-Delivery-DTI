import type { DeliveryRepository } from "@/modules/delivery/repository/delivery-repository.ts";
import type { Delivery } from "@prisma/client";

interface InMemoryDelivery {
  id: string;
  droneId: string;
  orders: { id: string }[];
  startedAt: Date;
  finishedAt: Date | null;
}

export class InMemoryDeliveryRepository implements DeliveryRepository {
  conclude(deliveryId: string, finishedAt: Date): Promise<Partial<Delivery>> {
    throw new Error("Method not implemented.");
  }
  public items: InMemoryDelivery[] = [];

  async create(data: { droneId: string; orderIds: string[]; startedAt?: Date }) {
    const delivery: InMemoryDelivery = {
      id: crypto.randomUUID(),
      droneId: data.droneId,
      orders: data.orderIds.map((id) => ({ id })),
      startedAt: data.startedAt ?? new Date(),
      finishedAt: null,
    };
    this.items.push(delivery);

    // se seu contrato de create retorna orders, mantenha; se não, remova `orders`
    return {
      id: delivery.id,
      droneId: delivery.droneId,
      startedAt: delivery.startedAt,
      finishedAt: delivery.finishedAt,
      orders: delivery.orders.map((o) => ({ id: o.id })),
    } as any;
  }

  async findByIdWithOrders(id: string) {
    const found = this.items.find((delivery) => delivery.id === id);
    return found
      ? ({
          id: found.id,
          droneId: found.droneId,
          startedAt: found.startedAt,
          finishedAt: found.finishedAt,
          orders: found.orders.map((o) => ({ id: o.id })),
        })
      : null;
  }

  async findOpenByDroneId(droneId: string) {
    const found = this.items.find(
      (delivery) => delivery.droneId === droneId && delivery.finishedAt === null
    );
    return found
      ? ({
          id: found.id,
          droneId: found.droneId,
          startedAt: found.startedAt,
          finishedAt: found.finishedAt,
          orders: found.orders.map((o) => ({ id: o.id })),
        })
      : null;
  }

  async setStartedAt(id: string, date: Date) {
    const found = this.items.find((delivery) => delivery.id === id);
    if (found) found.startedAt = date;
  }

  async setFinishedAt(id: string, date: Date) {
    const found = this.items.find((delivery) => delivery.id === id);
    if (found) found.finishedAt = date;
  }

  async clearFinishedAt(id: string) {
    const found = this.items.find((delivery) => delivery.id === id);
    if (found) found.finishedAt = null;
  }

  // usado no report (se precisar depois)
  async findAllFinished() {
    return this.items
      .filter((delivery) => delivery.finishedAt !== null)
      .map((delivery) => ({
        id: delivery.id,
        droneId: delivery.droneId,
        startedAt: delivery.startedAt,
        finishedAt: delivery.finishedAt,
      }));
  }
}
