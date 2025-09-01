import { DroneSimulation } from "./simulation-utils/simulation.ts";
import { SimulationState } from "./simulation-utils/simulation-state.ts";

interface StartSimulationRequest {
  drones: string[]; 
}

export class StartSimulation {
  execute(request: StartSimulationRequest): DroneSimulation[] {
    return request.drones.map(
      (id) => new DroneSimulation(id, SimulationState.Idle)
    );
  }
}
