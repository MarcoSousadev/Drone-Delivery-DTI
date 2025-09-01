import { DroneSimulation } from "./domain/simulation.ts";
import { SimulationState } from "./domain/simulation-state.ts";

export class AdvanceSimulation {
  execute(drones: DroneSimulation[]): DroneSimulation[] {
    return drones.map((drone) => {
      switch (drone.state) {
        case SimulationState.Idle:
          drone.transitionTo(SimulationState.Loading);
          break;

        case SimulationState.Loading:
          drone.transitionTo(SimulationState.Flying);
          break;

        case SimulationState.Flying:
          drone.transitionTo(SimulationState.Delivering);
          break;

        case SimulationState.Delivering:
          drone.transitionTo(SimulationState.Returning);
          break;

        case SimulationState.Returning:
          drone.transitionTo(SimulationState.Idle);
          break;
      }
      return drone;
    });
  }
}
