import type {$Enums, Drone,DroneStatus,Prisma } from "@prisma/client";

export interface DronesRepository {
  updateStatus(id: string, arg1: string): unknown;
  create(data: Prisma.DroneCreateInput):Promise<Drone>
  findStatus(id: string):Promise<DroneStatus>
  findClosestAvaible(lat: number, lon: number):Promise<Drone | null>
  findFirstAvailable(): Promise<Drone | null>
  updateStatus(id: string, status: $Enums.DroneStatus):Promise<void>
  listAll():Promise<Drone[]>
}