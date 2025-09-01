import { DroneSimulation } from "./domain/simulation.ts";

export class FinishSimulation {
  execute(drones: DroneSimulation[]): void {
    // aqui você poderia salvar no banco, emitir eventos, etc
    console.log("Finalizando simulação com drones:", drones);
  }
}
