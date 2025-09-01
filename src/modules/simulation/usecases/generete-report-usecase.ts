import type { DeliveryRepository } from "@/modules/delivery/repository/delivery-repository.ts";
import type { GenerateReportOutput } from "../interfaces/generate-report-interface.ts";

const toNumber = (value: unknown): number => {
  if (value && typeof value === "object" && "toNumber" in (value as any)) {
    return (value as any).toNumber();
  }
  return Number(value ?? 0);
};


const roughKmForDelivery = (ordersCount: number): number => {

  return Math.max(0, ordersCount);
};


function getOrInitDroneBucket(
  store: Record<string, {
    trips: number;
    totalKm: number;
    totalWeightKg: number;
    totalDurationMin: number;
  }>,
  droneId: string
) {
  if (!store[droneId]) {
    store[droneId] = {
      trips: 0,
      totalKm: 0,
      totalWeightKg: 0,
      totalDurationMin: 0,
    };
  }
  return store[droneId];
}

export class GenerateReportUseCase {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  public async execute(): Promise<GenerateReportOutput> {
    const completed = await this.deliveryRepository.findAllCompletedWithDroneAndOrders();


    if (!completed || completed.length === 0) {
      return {
        deliveriesCount: 0,
        ordersDelivered: 0,
        totalKm: 0,
        totalWeightKg: 0,
        avgDeliveryMinutes: 0,
        topDroneId: "N/A",
        droneRanking: [],
      };
    }

    const deliveriesCount = completed.length;


    let ordersDelivered = 0;
    let totalWeightKg = 0;
    let totalDurationMinutes = 0;

    const byDrone: Record<string, {
      trips: number;
      totalKm: number;
      totalWeightKg: number;
      totalDurationMin: number;
    }> = {};

    for (const delivery of completed) {
      const droneId = delivery.drone?.id ?? delivery.droneId;


      const bucket = getOrInitDroneBucket(byDrone, droneId);

      const weightThisDelivery = delivery.orders.reduce((sum, order) => {
        return sum + toNumber(order.packageWeight);
      }, 0);

    
      const finished = delivery.finishedAt ?? delivery.startedAt;
      const durationMin = (finished.getTime() - delivery.startedAt.getTime()) / (1000 * 60);

      const kmThisDelivery = roughKmForDelivery(delivery.orders.length);

      ordersDelivered += delivery.orders.length;
      totalWeightKg += weightThisDelivery;
      totalDurationMinutes += durationMin;

      bucket.trips += 1;
      bucket.totalKm += kmThisDelivery;
      bucket.totalWeightKg += weightThisDelivery;
      bucket.totalDurationMin += durationMin;
    }

    const avgDeliveryMinutes =
      deliveriesCount > 0 ? totalDurationMinutes / deliveriesCount : 0;

 
    const droneRanking = Object.entries(byDrone).map(([droneId, stats]) => ({
      droneId,
      trips: stats.trips,
      totalKm: stats.totalKm,
      totalWeightKg: stats.totalWeightKg,
      avgKmPerTrip: stats.trips > 0 ? stats.totalKm / stats.trips : 0,
      avgWeightKg: stats.trips > 0 ? stats.totalWeightKg / stats.trips : 0,
      totalDurationMin: stats.totalDurationMin,
    }));

    droneRanking.sort((a, b) => b.avgWeightKg - a.avgWeightKg);

    const topDroneId = droneRanking[0]?.droneId ?? "N/A";

    const totalKm = droneRanking.reduce((sum, item) => sum + item.totalKm, 0);

    return {
      deliveriesCount,
      ordersDelivered,
      totalKm,
      totalWeightKg,
      avgDeliveryMinutes,
      topDroneId,
      droneRanking,
    };
  }
}
