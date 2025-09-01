import { haversineKm } from "@/core/utils/harversineKm.ts";

const asNumber = (v: any) =>
  v == null ? 0 : typeof v === "number" ? v : typeof v.toNumber === "function" ? v.toNumber() : Number(v);

const priorityRank: Record<"HIGH" | "MEDIUM" | "LOW", number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export class PriorityQueue {
  constructor(private readonly baseLatitude: number, private readonly baseLongitude: number) {}

  private distanceFromBase(latitude: any, longitude: any) {
    return haversineKm(this.baseLatitude, this.baseLongitude, asNumber(latitude), asNumber(longitude));
  }

  public sort<T extends {
    priority: "HIGH" | "MEDIUM" | "LOW";
    packageWeight: any;
    latitude: any;
    longitude: any;
    createdAt?: Date;
  }>(orders: T[]): T[] {
    return [...orders].sort((orderA, orderB) => {
      // 1) prioridade
      const prioDiff = priorityRank[orderB.priority] - priorityRank[orderA.priority];
      if (prioDiff !== 0) return prioDiff;

      // 2) peso (maior primeiro)
      const weightDiff = asNumber(orderB.packageWeight) - asNumber(orderA.packageWeight);
      if (weightDiff !== 0) return weightDiff;

      // 3) proximidade da base (mais perto primeiro)
      const distanceOrderA = this.distanceFromBase(orderA.latitude, orderA.longitude);
      const distanceOrderB = this.distanceFromBase(orderB.latitude, orderB.longitude);
      const distDiff = distanceOrderA - distanceOrderB;
      if (distDiff !== 0) return distDiff;

      // 4) desempate por data (mais antigo primeiro)
      const timeA = orderA.createdAt ? orderA.createdAt.getTime() : 0;
      const timeB = orderB.createdAt ? orderB.createdAt.getTime() : 0;
      return timeA - timeB;
    });
  }
}
