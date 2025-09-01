import { DroneSimulation } from "./simulation-utils/simulation.ts";

export class FinishSimulation {
  execute(drones: DroneSimulation[]): void {
    console.log("Finalizando simulação com drones:", drones);
  }
}
