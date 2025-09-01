import type { FastifyInstance } from "fastify";
import { assignDelivery } from "@/modules/delivery/controllers/assign-delivery.ts";
import { updateDeliveryStatus } from "@/modules/delivery/controllers/update-delivery-status.ts";

export async function appDeliveryRoutes(app:FastifyInstance) {
  app.post('/deliveries/assign', assignDelivery)
  app.post('/deliveries/:id/status', updateDeliveryStatus)
}



