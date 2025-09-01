import type { DronesRepository } from "@/modules/drones/repositories/drones-repository.ts";
import type { Drone, DroneStatus, Prisma } from "@prisma/client";
import { decimal, type DecimalLike } from "../decimal-like.ts";

interface InMemoryDrone {
  id: string;
  baseLatitude: DecimalLike;
  baseLongitude: DecimalLike;
  status: DroneStatus;
  rangeKm: DecimalLike | number;
  capacityKg: DecimalLike | number;
}

export class InMemoryDronesRepository implements DronesRepository {
  create(data: Prisma.DroneCreateInput): Promise<Drone> {
    throw new Error("Method not implemented.");
  }
  findStatus(id: string): Promise<DroneStatus> {
    throw new Error("Method not implemented.");
  }
  findClosestAvaible(lat: number, lon: number): Promise<Drone | null> {
    throw new Error("Method not implemented.");
  }
  public items: InMemoryDrone[] = [];

  pushRaw(drone: {
    id: string;
    baseLatitude: number;
    baseLongitude: number;
    status?: DroneStatus;
    rangeKm?: number;
    capacityKg?: number;
  }) {
    this.items.push({
      id: drone.id,
      baseLatitude: decimal(drone.baseLatitude),
      baseLongitude: decimal(drone.baseLongitude),
      status: drone.status ?? "IDLE",
      rangeKm: drone.rangeKm ?? 0,
      capacityKg: drone.capacityKg ?? 0,
    });
  }

  async findFirstAvailable() {
    const available = this.items.find((drone) => drone.status === "IDLE");
    return available
      ? ({
          id: available.id,
          baseLatitude: available.baseLatitude as any,
          baseLongitude: available.baseLongitude as any,
          status: available.status,
          rangeKm: available.rangeKm as any,
          capacityKg: available.capacityKg as any,
        })
      : null;
  }

  async listAll() {
    return this.items.map((drone) => ({
      id: drone.id,
      baseLatitude: drone.baseLatitude as any,
      baseLongitude: drone.baseLongitude as any,
      status: drone.status,
      rangeKm: drone.rangeKm as any,
      capacityKg: drone.capacityKg as any,
    }));
  }

  async updateStatus(id: string, status: DroneStatus) {
    const found = this.items.find((drone) => drone.id === id);
    if (found) found.status = status;
  }
}
