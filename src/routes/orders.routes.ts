import type { FastifyInstance } from "fastify";
import { createOrder } from "../modules/orders/controllers/create-order.ts";
import { allocateOrders } from "@/modules/orders/controllers/allocate-orders.ts";

export async function appOrderRoutes(app:FastifyInstance) {
  app.post('/order', createOrder)
  app.post('/orders/allocate', allocateOrders)
}