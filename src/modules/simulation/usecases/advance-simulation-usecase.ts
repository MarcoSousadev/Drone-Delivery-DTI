import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";
import type { DeliveryRepository } from "../../delivery/repository/delivery-repository.ts";
import type { OrdersRepository } from "../../orders/repositories/ordersRepository.ts";


type AdvanceSimulationReport = {
  toLoading: string[];     
  toInFlight: string[];   
  toDelivering: string[];  
  finished: string[];     
  toReturning: string[];   
  toIdle: string[];        
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
          
          await this.dronesRepository.updateStatus(drone.id, "LOADING");
          report.toLoading.push(drone.id);
          break;
        }

        case "LOADING": {
          
          await this.dronesRepository.updateStatus(drone.id, "IN_FLIGHT");
          report.toInFlight.push(drone.id);
          break;
        }

        case "IN_FLIGHT": {
         
          await this.dronesRepository.updateStatus(drone.id, "DELIVERING");
          report.toDelivering.push(drone.id);
          break;
        }

        case "RETURNING": {
          
          await this.dronesRepository.updateStatus(drone.id, "IDLE");
          report.toIdle.push(drone.id);
          break;
        }

        default: {
          
          break;
        }
      }
    }

    return report;
  }
}
