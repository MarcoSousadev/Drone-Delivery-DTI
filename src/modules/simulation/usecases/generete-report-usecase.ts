import type { DeliveryRepository } from "@/modules/delivery/repository/delivery-repository";
import type { OrdersRepository } from "@/modules/orders/repositories/ordersRepository";
import type { DronesRepository } from "@/modules/drones/repositories/drones-repository";

export type SimulationReport = {
  deliveriesCount: number;
  avgDeliveryTimeMinutes: number;
  bestDrone: { id: string; deliveries: number } | null;
  // pode expandir com outras métricas depois
};

export class GenerateReportUseCase {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly dronesRepository: DronesRepository
  ) {}

  public async execute(): Promise<SimulationReport> {
    // todas deliveries finalizadas
    const deliveries = await this.deliveryRepository.findAllFinished?.();
    const deliveriesCount = deliveries?.length ?? 0;

    // tempo médio
    let avgDeliveryTimeMinutes = 0;
    if (deliveries && deliveries.length > 0) {
      const times = deliveries
        .filter(d => d.startedAt && d.finishedAt)
        .map(d => {
          const diffMs = d.finishedAt!.getTime() - d.startedAt!.getTime();
          return diffMs / 60000; // em minutos
        });
      avgDeliveryTimeMinutes = times.reduce((a, b) => a + b, 0) / times.length;
    }

    // drone mais eficiente (mais entregas concluídas)
    let bestDrone: { id: string; deliveries: number } | null = null;
    if (deliveries && deliveries.length > 0) {
      const counts: Record<string, number> = {};
      for (const d of deliveries) {
        counts[d.droneId] = (counts[d.droneId] ?? 0) + 1;
      }
      const [id, deliveriesCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      bestDrone = { id, deliveries: deliveriesCount };
    }

    return { deliveriesCount, avgDeliveryTimeMinutes, bestDrone };
  }
}
