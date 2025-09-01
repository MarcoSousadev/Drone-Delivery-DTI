import { prisma } from "../../../infra/prisma/prisma.ts";
import {$Enums, Prisma, type Drone} from '@prisma/client'
import type { DronesRepository } from "./drones-repository.ts";

export class PrismaDroneRepository implements DronesRepository {
  async listAll(){
   const drones = await prisma.drone.findMany()
   return drones
  }
  async updateStatus(id: string, status: $Enums.DroneStatus) {
      await prisma.drone.update({
        where: { id },
        data: { status: status as $Enums.DroneStatus },
      }) }
    
  async findClosestAvaible(lat: number, lon: number) {
 const drones = await prisma.drone.findMany({
    where: { status: "IDLE" },
  });

  if (drones.length === 0) return null;

  const closest = drones.reduce((prev, curr) => {
    const prevDist = Math.sqrt(
      Math.pow(Number(prev.baseLatitude) - lat, 2) +
      Math.pow(Number(prev.baseLongitude) - lon, 2)
    );
    const currDist = Math.sqrt(
      Math.pow(Number(curr.baseLatitude) - lat, 2) +
      Math.pow(Number(curr.baseLongitude) - lon, 2)
    );
    return currDist < prevDist ? curr : prev;
  });

  return closest;
  }
  async findFirstAvailable() {
    const drone = await prisma.drone.findFirst({
      where:{
        status: "IDLE"
      }
    })
    return drone
  }
  async findStatus(id:string){
   const drone = await prisma.drone.findUnique({
    where: {
      id
    },
    select: {status: true}

   })
   return drone?.status ?? 'IDLE'

  }
  async create(data: Prisma.DroneCreateInput) {
    const drone = await prisma.drone.create({
          data,
        })

      return drone
  }
 
}
