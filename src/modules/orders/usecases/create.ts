import { prisma } from "../../../infra/prisma/prisma.ts"
import type { OrdersRepository } from "../repositories/ordersRepository.ts"
import { PrismaOrdersRepository } from "../repositories/prisma-orders-repository.ts"

interface createOrderUseCaseRequest {
  latitude: number
  longitude: number
  packageWeight: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export class CreateOrderUseCase{

  constructor(
    private ordersRepository: OrdersRepository,

  ) {}

   async execute({
    latitude,
    longitude,
    packageWeight,
    priority
}: createOrderUseCaseRequest){

  if(packageWeight > 2.3) {
   throw new Error('Package Weight is higher than supported by the drones')
  } 

    //  const prismaOrdersRepositoru = new PrismaOrdersRepository()


     await this.ordersRepository.create({
      latitude,
      longitude,
      packageWeight,
      priority
     })
}}
 
 