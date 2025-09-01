import type { $Enums } from "@prisma/client"
import type { DronesRepository } from "../repositories/drones-repository.ts"


interface GetDroneStatusUseCaseRequest {
  id: string
}

interface GetDroneStatusUseCaseResponse {
status: $Enums.DroneStatus
}

  
  

export class GetDroneStatusUseCase{

  constructor(
    private dronesRepository: DronesRepository,

  ) {}

   async execute({
    id
}: GetDroneStatusUseCaseRequest):Promise<GetDroneStatusUseCaseResponse>{

  const status = await this.dronesRepository.findStatus(id)

  return {
    status
  }

}}
 
 