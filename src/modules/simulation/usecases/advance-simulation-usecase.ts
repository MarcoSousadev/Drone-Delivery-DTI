import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";
import type { DeliveryRepository } from "../../delivery/repository/delivery-repository.ts";
import type { OrdersRepository } from "../../orders/repositories/ordersRepository.ts";

/**
 * Relatório de uma "batida" de simulação
 */
type AdvanceSimulationReport = {
  toLoading: string[];     // drones que passaram para LOADING
  toInFlight: string[];    // drones que passaram para IN_FLIGHT
  toDelivering: string[];  // drones que passaram para DELIVERING
  finished: string[];      // deliveries finalizadas (ao sair de DELIVERING)
  toReturning: string[];   // drones que passaram para RETURNING
  toIdle: string[];        // drones que passaram para IDLE
};

export class AdvanceSimulationUseCase {
  constructor(
    private readonly dronesRepository: DronesRepository,
    private readonly deliveryRepository: DeliveryRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  public async execute(): Promise<AdvanceSimulationReport> {
    const drones = await this.dronesRepository.listAll();
    const report: AdvanceSimulationReport = {
      toLoading: [],
      toInFlight: [],
      toDelivering: [],
      finished: [],
      toReturning: [],
      toIdle: [],
    };

    if (!drones || drones.length === 0) return report;

    for (const drone of drones) {
      switch (drone.status) {
        case "IDLE": {
          // Próximo passo depois de alocar pedidos seria LOADING
          await this.dronesRepository.updateStatus(drone.id, "LOADING");
          report.toLoading.push(drone.id);
          break;
        }

        case "LOADING": {
          // Saiu do carregamento, decola
          await this.dronesRepository.updateStatus(drone.id, "IN_FLIGHT");
          report.toInFlight.push(drone.id);
          break;
        }

        case "IN_FLIGHT": {
          // Chegou na área do cliente, inicia ato de entrega
          await this.dronesRepository.updateStatus(drone.id, "DELIVERING");
          report.toDelivering.push(drone.id);
          break;
        }

        case "RETURNING": {
          // pousou na base
          await this.dronesRepository.updateStatus(drone.id, "IDLE");
          report.toIdle.push(drone.id);
          break;
        }

        default: {
          // estados desconhecidos ficam como estão
          break;
        }
      }
    }

    return report;
  }
}
