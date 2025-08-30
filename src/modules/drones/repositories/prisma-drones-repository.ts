import { prisma } from "../../../infra/prisma/prisma.ts";
import {Prisma} from '@prisma/client'
import type { DronesRepository } from "./drones-repository.ts";

export class PrismaDroneRepository implements DronesRepository {
  async create(data: Prisma.DroneCreateInput) {
    const drone = await prisma.drone.create({
          data,
        })

      return drone
  }
 
}
