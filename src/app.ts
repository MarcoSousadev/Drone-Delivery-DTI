import { fastify } from 'fastify'
import { prisma } from './infra/prisma/prisma.ts'
import z from 'zod'
import { createOrder } from './modules/orders/controllers/create-order.ts'
import { appOrderRoutes } from './routes/orders.routes.ts'

export const app = fastify()


app.register(appOrderRoutes)
