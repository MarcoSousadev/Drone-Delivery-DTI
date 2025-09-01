import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";
import type { DeliveryRepository } from "../../delivery/repository/delivery-repository.ts";
import type { OrdersRepository } from "../../orders/repositories/ordersRepository.ts";

type AdvanceSimulationReport = {
  toDelivering: string[];  // drones que mudaram para DELIVERING
  finished: string[];      // deliveries finalizadas
  toIdle: string[];        // drones que retornaram para IDLE
};

export class AdvanceSimulationUseCase {
  constructor(
    private readonly dronesRepository: DronesRepository,
    private readonly deliveryRepository: DeliveryRepository,
    private readonly ordersRepository: OrdersRepository
  ) {}

  public async execute(): Promise<AdvanceSimulationReport> {
    const drones = await this.dronesRepository.listAll?.();
    const toDelivering: string[] = [];
    const finished: string[] = [];
    const toIdle: string[] = [];

    if (!drones || drones.length === 0) {
      return { toDelivering, finished, toIdle };
    }

    for (const drone of drones) {
      switch (drone.status) {
        case "IN_FLIGHT": {
          await this.dronesRepository.updateStatus(drone.id, "DELIVERING");
          toDelivering.push(drone.id);
          break;
        }

        case "IN_FLIGHT": {
          // finalizar a entrega aberta desse drone
          const open = await this.deliveryRepository.findOpenByDroneId?.(drone.id);
          if (open) {
            await this.deliveryRepository.setFinishedAt(open.id, new Date());
            // orders -> DELIVERED
            for (const o of open.orders) {
              await this.ordersRepository.updateStatus(o.id, "DELIVERED");
            }
            finished.push(open.id);
          }
          // drone volta
          await this.dronesRepository.updateStatus(drone.id, "RETURNING");
          break;
        }

        case "RETURNING": {
          await this.dronesRepository.updateStatus(drone.id, "IDLE");
          toIdle.push(drone.id);
          break;
        }

        // IDLE / LOADING: não faz nada aqui
        default:
          break;
      }
    }

    return { toDelivering, finished, toIdle };
  }
}