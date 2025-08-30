import type { FastifyInstance } from "fastify";
import { createOrder } from "../modules/orders/controllers/create-order.ts";

export async function appOrderRoutes(app:FastifyInstance) {
  app.post('/order', createOrder)
}