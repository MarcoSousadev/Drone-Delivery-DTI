// src/core/queue/priorityQueue.ts
import { Priority } from "@prisma/client";
import type { Order } from "@prisma/client";

// Haversine para distância real (em km)
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // raio da Terra em km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

export class PriorityQueue {
  private priorityOrder: Record<Priority, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  constructor(private baseLat = 0, private baseLon = 0) {}

  sort(orders: Order[]): Order[] {
    return orders.sort((orderA, orderB) => {
      // 1º prioridade
      if (this.priorityOrder[orderA.priority] !== this.priorityOrder[orderB.priority]) {
        return this.priorityOrder[orderB.priority] - this.priorityOrder[orderA.priority];
      }

      // 2º peso (maior primeiro)
      if (!orderA.packageWeight.equals(orderB.packageWeight)) {
        return (
          orderB.packageWeight.toNumber() - orderA.packageWeight.toNumber()
        );
      }

      // 3º distância da base
      const distanceOrderA = haversineDistance(
        this.baseLat,
        this.baseLon,
        orderA.latitude.toNumber(),
        orderA.longitude.toNumber()
      );
      const distanceOrderB = haversineDistance(
        this.baseLat,
        this.baseLon,
        orderB.latitude.toNumber(),
        orderB.longitude.toNumber()
      );

      return distanceOrderA - distanceOrderB;
    });
  }
}
