import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";
import type { DeliveryRepository } from "../../delivery/repository/delivery-repository.ts";
import type { OrdersRepository } from "../../orders/repositories/ordersRepository.ts";

type FinishSimulationReport = {
  deliveriesClosed: string[];
  dronesIdled: string[];
};

export class FinishSimulationUseCase {
  constructor(
    private readonly dronesRepository: DronesRepository,
    private readonly deliveryRepository: DeliveryRepository,
    private readonly ordersRepository: OrdersRepository
  ) {}

  public async execute(): Promise<FinishSimulationReport> {
    const drones = await this.dronesRepository.listAll?.();
    const deliveriesClosed: string[] = [];
    const dronesIdled: string[] = [];

    if (!drones || drones.length === 0) {
      return { deliveriesClosed, dronesIdled };
    }

    for (const drone of drones) {
      if (drone.status === "IN_FLIGHT") {
        const open = await this.deliveryRepository.findOpenByDroneId?.(drone.id);
        if (open) {
          await this.deliveryRepository.setFinishedAt(open.id, new Date());
          for (const currentOrder of open.orders) {
            await this.ordersRepository.updateStatus(currentOrder.id, "DELIVERED");
          }
          deliveriesClosed.push(open.id);
        }
        await this.dronesRepository.updateStatus(drone.id, "RETURNING");
      }

      if (drone.status === "RETURNING") {
        await this.dronesRepository.updateStatus(drone.id, "IDLE");
        dronesIdled.push(drone.id);
      }
    }

    return { deliveriesClosed, dronesIdled };
  }
}
