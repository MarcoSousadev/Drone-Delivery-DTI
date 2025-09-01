import { WatchedList } from "../../../core/entities/watched-list.ts";
import { DroneSimulation } from "../../simulation/simulation-utils/simulation.ts";
import { SimulationState } from "../../simulation/simulation-utils/simulation-state.ts";

export class DroneWatchedList extends WatchedList<DroneSimulation> {
  constructor(initialItems?: DroneSimulation[]) {
    super(initialItems);
  }


  compareItems(a: DroneSimulation, b: DroneSimulation): boolean {
    return a.id === b.id;
  }

  public update(items: DroneSimulation[]): void {
    const previousItems = [...this.currentItems];
    super.update(items);

    this.currentItems.forEach((drone) => {
      const oldDrone = previousItems.find((d) => d.id === drone.id);
      if (oldDrone && oldDrone.state !== drone.state) {
        this.onStateChanged(drone, oldDrone.state, drone.state);
      }
    });
  }

  private onStateChanged(drone: DroneSimulation, oldState: SimulationState, newState: SimulationState) {
    console.log(`Drone ${drone.id} mudou de ${oldState} para ${newState}`);
  }
}
