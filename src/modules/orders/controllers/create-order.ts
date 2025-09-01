import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { CreateOrderUseCase } from '../usecases/create.ts'
import { PrismaOrdersRepository } from '../repositories/prisma-orders-repository.ts'

export async function createOrder(request: FastifyRequest, reply: FastifyReply ) {
  const createOrderBodySchema = z.object({
    longitude: z.number().refine( value => { 
      return Math.abs(value) <= 180
    }),
    latitude: z.number().refine( value => { 
      return Math.abs(value) <= 90
    }),
    packageWeight: z.number(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"])
  })

  const { latitude, longitude, packageWeight, priority } = createOrderBodySchema.parse(request.body)

  try { 
    const prismaOrdersRepository = new PrismaOrdersRepository()
    const createOrderUseCase = new CreateOrderUseCase(prismaOrdersRepository)

    await createOrderUseCase.execute({
      latitude, longitude, packageWeight, priority
    })

  } catch(err) {
    reply.status(406).send({ message: 'Weight not supported by the drones'})
  }
  

  return reply.status(201).send()
  } 

