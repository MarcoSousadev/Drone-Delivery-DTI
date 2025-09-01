import { SimulationState } from "./simulation-state.ts";


export class DroneSimulation {
  constructor(
    public id: string,
    public state: SimulationState = SimulationState.Idle,
    public currentOrderId?: string,
  ) {}

 
  transitionTo(newState: SimulationState) {
    this.state = newState;
  }
}
