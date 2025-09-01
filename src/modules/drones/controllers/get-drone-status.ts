import z from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaDroneRepository } from '../repositories/prisma-drones-repository.ts'
import { GetDroneStatusUseCase } from '../usecases/findDroneStatus.usecase.ts'

export async function getDroneSatus( request: FastifyRequest, reply: FastifyReply){
  const searchStatusParams = z.object({
    id: z.string()
  })

  const { id } = searchStatusParams.parse(request.params)

  try{
    const prismaDroneRepository = new PrismaDroneRepository()
    const getDroneStatusUseCase = new GetDroneStatusUseCase(prismaDroneRepository)

    const droneStatus = await getDroneStatusUseCase.execute({
      id
    })
    return reply.status(201).send(droneStatus)
  }
  catch(err) {
    reply.status(404).send({ message: 'Drone not found'})
  }
}




// // IDLE
//   LOADING
//   IN_FLIGHT
//   RETURNING