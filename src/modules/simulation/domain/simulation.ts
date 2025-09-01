import { SimulationState } from "./simulation-state.ts";

// Representa um Drone dentro da simulação
export class DroneSimulation {
  constructor(
    public id: string,
    public state: SimulationState = SimulationState.Idle,
    public currentOrderId?: string,
  ) {}

  // Transição de estado simples (pode ser refinada depois)
  transitionTo(newState: SimulationState) {
    this.state = newState;
  }
}
