import type { Drone,Prisma } from "@prisma/client";

export interface DronesRepository {
  create(data: Prisma.DroneCreateInput):Promise<Drone>

}