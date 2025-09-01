import { WatchedList } from "../../../core/entities/watched-list.ts";
import { DroneSimulation } from "../../simulation/domain/simulation.ts";
import { SimulationState } from "../../simulation/domain/simulation-state.ts";

export class DroneWatchedList extends WatchedList<DroneSimulation> {
  constructor(initialItems?: DroneSimulation[]) {
    super(initialItems);
  }

  // Comparação baseada no ID do drone
  compareItems(a: DroneSimulation, b: DroneSimulation): boolean {
    return a.id === b.id;
  }

  // Override update para disparar eventos de transição
  public update(items: DroneSimulation[]): void {
    const previousItems = [...this.currentItems];
    super.update(items);

    // Detecta mudanças de estado
    this.currentItems.forEach((drone) => {
      const oldDrone = previousItems.find((d) => d.id === drone.id);
      if (oldDrone && oldDrone.state !== drone.state) {
        this.onStateChanged(drone, oldDrone.state, drone.state);
      }
    });
  }

  private onStateChanged(drone: DroneSimulation, oldState: SimulationState, newState: SimulationState) {
    console.log(`Drone ${drone.id} mudou de ${oldState} para ${newState}`);
    // Aqui você pode atualizar o banco via repository ou emitir eventos
  }
}
