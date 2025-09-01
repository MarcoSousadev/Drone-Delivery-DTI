import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { PrismaDroneRepository } from '../repositories/prisma-drones-repository.ts'
import { CreateDroneUseCase } from '../usecases/createDrone.ts'


export async function createDrone(request: FastifyRequest, reply: FastifyReply ) {
  const createDroneBodySchema = z.object({
    baseLongitude: z.number().refine( value => { 
      return Math.abs(value) <= 180
    }),
    baseLatitude: z.number().refine( value => { 
      return Math.abs(value) <= 90
    })
  })

  const {  baseLongitude,baseLatitude } = createDroneBodySchema.parse(request.body)

  try { 
    const prismaDroneRepository = new PrismaDroneRepository()
    const createDroneUseCase = new CreateDroneUseCase(prismaDroneRepository)

    const drone = await createDroneUseCase.execute({
      baseLongitude,
      baseLatitude,
    })
     return reply.status(201).send(drone)

  } catch(err) {
    return reply.status(400).send({ message: 'bad request'})
  }
  } 

