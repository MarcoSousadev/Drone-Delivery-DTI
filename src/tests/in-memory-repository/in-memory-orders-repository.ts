import type { OrdersRepository } from "@/modules/orders/repositories/ordersRepository.ts";
import type { Priority, OrderStatus, Order, Prisma } from "@prisma/client";

// mini “decimal-like” para testes
interface DecimalLike { toNumber(): number }
const decimal = (value: number): DecimalLike => ({ toNumber: () => value });

interface InMemoryOrder {
  id: string;
  latitude: DecimalLike;
  longitude: DecimalLike;
  packageWeight: DecimalLike;
  priority: Priority;
  status: OrderStatus;
  createdAt: Date;
  deliveryId: string | null;
}

export class InMemoryOrdersRepository implements OrdersRepository {
  create(data: Prisma.OrderCreateInput): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  findMany(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
  findFirstAvailable(): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }
  public items: InMemoryOrder[] = [];

  /** Use nos testes para popular rapidamente */
  pushRaw(order: {
    id: string;
    latitude: number;
    longitude: number;
    packageWeight: number;
    priority: Priority;
    status?: OrderStatus;
    deliveryId?: string | null;
    createdAt?: Date;
  }) {
    this.items.push({
      id: order.id,
      latitude: decimal(order.latitude),
      longitude: decimal(order.longitude),
      packageWeight: decimal(order.packageWeight),
      priority: order.priority,
      status: order.status ?? "PENDING",
      createdAt: order.createdAt ?? new Date(),
      deliveryId: order.deliveryId ?? null,
    });
  }

  async findById(id: string) {
    const found = this.items.find((o) => o.id === id);
    return found
      ? {
          id: found.id,
          latitude: found.latitude as any,
          longitude: found.longitude as any,
          packageWeight: found.packageWeight as any,
          priority: found.priority,
          status: found.status,
          createdAt: found.createdAt,
          deliveryId: found.deliveryId,
        }
      : null;
  }

  async findManyPending(exceptOrderId?: string) {
    return this.items
      .filter((o) => o.status === "PENDING" && o.id !== exceptOrderId)
      .map((o) => ({
        id: o.id,
        latitude: o.latitude as any,
        longitude: o.longitude as any,
        packageWeight: o.packageWeight as any,
        priority: o.priority,
        status: o.status,
        createdAt: o.createdAt,
        deliveryId: o.deliveryId,
      }));
  }

  async updateStatus(id: string, status: OrderStatus) {
    const found = this.items.find((o) => o.id === id);
    if (found) found.status = status;
  }
}
