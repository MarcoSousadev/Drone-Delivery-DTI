import type { $Enums, Drone } from "@prisma/client"
import type { DronesRepository } from "../repositories/drones-repository.ts"
import type { Decimal } from "@prisma/client/runtime/library"


interface CreateDroneUseCaseRequest {
  baseLongitude: number
  baseLatitude: number
}

interface CreateDroneUseCaseResponse {
  id: string
  baseLongitude: Decimal
  baseLatitude: Decimal
  status: $Enums.DroneStatus

}

  

export class CreateDroneUseCase{

  constructor(
    private dronesRepository: DronesRepository,

  ) {}

   async execute({

    baseLongitude,
    baseLatitude,
}: CreateDroneUseCaseRequest):Promise<CreateDroneUseCaseResponse>{

  const drone = await this.dronesRepository.create({
    baseLatitude,
    baseLongitude,

  })
  
  return drone

}}
 
 