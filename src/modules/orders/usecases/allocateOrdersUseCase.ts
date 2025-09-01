import type { OrdersRepository } from "../repositories/ordersRepository.ts";
import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";
import type { DeliveryRepository } from "../../delivery/repository/delivery-repository.ts";

import { PriorityQueue } from "@/core/queue/priorityQueue.ts";
import { routeDistanceKm } from "@/core/utils/routeDistance.ts";

const DRONE_CAPACITY_KG = 2.3;
const DEFAULT_RANGE_KM = 12;

const asNumber = (v: any) =>
  v == null ? 0 : typeof v === "number" ? v : typeof v.toNumber === "function" ? v.toNumber() : Number(v);

type AllocationReport = {
  deliveriesCreated: number;
  assignedOrders: number;
  skippedOrders: string[];
};

export class AllocateOrdersUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly dronesRepository: DronesRepository,
    private readonly deliveryRepository: DeliveryRepository
  ) {}

  public async execute(): Promise<AllocationReport> {
    const pendingOrders = await this.ordersRepository.findManyPending("ALL"); // ajuste conforme seu repo
    if (!pendingOrders || pendingOrders.length === 0) {
      return { deliveriesCreated: 0, assignedOrders: 0, skippedOrders: [] };
    }

    const drones = await this.dronesRepository.listAll?.();
    if (!drones || drones.length === 0) {
      return { deliveriesCreated: 0, assignedOrders: 0, skippedOrders: pendingOrders.map(o => o.id) };
    }

    let deliveriesCreated = 0;
    let assignedOrders = 0;
    const skippedOrders: string[] = [];

    // pool inicial de pedidos
    let pool = [...pendingOrders];

    for (const drone of drones) {
      if (drone.status !== "IDLE") continue;

      const base = {
        latitude: asNumber((drone as any).baseLatitude ?? 0),
        longitude: asNumber((drone as any).baseLongitude ?? 0),
      };
      const rangeKm = asNumber((drone as any).rangeKm ?? DEFAULT_RANGE_KM);

      // ordenar por prioridade/peso/distância
      const pq = new PriorityQueue(base.latitude, base.longitude);
      const sorted = pq.sort(pool);

      const chosen: typeof pool = [];
      let totalWeight = 0;

      for (const order of sorted) {
        const w = asNumber(order.packageWeight);
        if (w <= 0) continue;
        if (totalWeight + w > DRONE_CAPACITY_KG) continue;

        const stops = [...chosen, order].map((o) => ({
          latitude: asNumber(o.latitude),
          longitude: asNumber(o.longitude),
        }));

        const tripDist = routeDistanceKm(base, stops);
        if (tripDist > rangeKm) continue;

        chosen.push(order);
        totalWeight += w;
      }

      if (chosen.length === 0) continue;

      // criar delivery para esse drone
      const delivery = await this.deliveryRepository.create({
        droneId: drone.id,
        orderIds: chosen.map(o => o.id),
        startedAt: new Date(),
      });

      // atualizar status dos pedidos
      for (const o of chosen) {
        await this.ordersRepository.updateStatus(o.id, "ALLOCATED");
      }

      // atualizar drone
      await this.dronesRepository.updateStatus(drone.id, "LOADING");

      deliveriesCreated++;
      assignedOrders += chosen.length;

      // tirar escolhidos do pool
      pool = pool.filter(o => !chosen.some(c => c.id === o.id));
    }

    // tudo que sobrou no pool foram pedidos não alocados
    skippedOrders.push(...pool.map(o => o.id));

    return { deliveriesCreated, assignedOrders, skippedOrders };
  }
}
