import type { DeliveryRepository } from "../../delivery/repository/delivery-repository.ts";
import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";

type StartSimulationResponse = {
  startedAtCount: number;
  dronesToFlight: string[];
};

export class StartSimulationUseCase {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly dronesRepository: DronesRepository
  ) {}

  public async execute(): Promise<StartSimulationResponse> {
    const drones = await this.dronesRepository.listAll?.();
    const dronesToFlight: string[] = [];

    if (drones && drones.length > 0) {
      for (const d of drones) {
        if (d.status === "LOADING") {
          await this.dronesRepository.updateStatus(d.id, "IN_FLIGHT");
          dronesToFlight.push(d.id);
        }
      }
    }

    let startedAtCount = 0;
    if (this.deliveryRepository.findOpenByDroneId) {
      if (drones) {
        for (const d of drones) {
          const open = await this.deliveryRepository.findOpenByDroneId(d.id);
          if (open && !open.startedAt) {
            await this.deliveryRepository.setStartedAt(open.id, new Date());
            startedAtCount++;
          }
        }
      }
    }

    return { startedAtCount, dronesToFlight };
  }
}
