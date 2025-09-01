import type { FastifyInstance } from "fastify";
import { getDroneSatus } from "../modules/drones/controllers/get-drone-status.ts";
import { createDrone } from "../modules/drones/controllers/create-drone.ts";

export async function appDroneRoutes(app:FastifyInstance) {
  app.post('/drones', createDrone )
  app.get('/drones/:id/status', getDroneSatus)
}



