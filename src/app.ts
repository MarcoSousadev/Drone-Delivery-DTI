import { fastify } from 'fastify'
import { appOrderRoutes } from './routes/orders.routes.ts'
import { appDroneRoutes } from './routes/drones.routes.ts'
import { appDeliveryRoutes } from './routes/delivery.routes.ts'
import { appSimulationRoutes } from './routes/simulation.routes.ts'

export const app = fastify()


app.register(appOrderRoutes)
app.register(appDroneRoutes)
app.register(appDeliveryRoutes)
app.register(appSimulationRoutes)
