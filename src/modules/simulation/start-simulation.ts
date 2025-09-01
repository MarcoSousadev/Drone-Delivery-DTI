import { DroneSimulation } from "./domain/simulation.ts";
import { SimulationState } from "./domain/simulation-state.ts";

interface StartSimulationRequest {
  drones: string[]; // lista de IDs de drones
}

export class StartSimulation {
  execute(request: StartSimulationRequest): DroneSimulation[] {
    return request.drones.map(
      (id) => new DroneSimulation(id, SimulationState.Idle)
    );
  }
}
