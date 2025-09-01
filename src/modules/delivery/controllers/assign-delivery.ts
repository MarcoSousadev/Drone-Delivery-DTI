import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { AssignDeliveryUseCase } from "../usecases/assign-delivery.ts";
import { PrismaOrdersRepository } from "../../orders/repositories/prisma-orders-repository.ts";
import { PrismaDroneRepository } from "../../drones/repositories/prisma-drones-repository.ts";
import { PrismaDeliveryRepository } from "../repository/prisma-delivery-repository.ts";

export async function assignDelivery(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    orderId: z.string()
  });

  const { orderId } = bodySchema.parse(request.body);

  try {
    const prismaOrdersRepository = new PrismaOrdersRepository()
          const prismaDronesRepository = new PrismaDroneRepository()
          const prismaDeliveryRepository = new PrismaDeliveryRepository()
        const assignDeliveryUseCase = new AssignDeliveryUseCase(prismaOrdersRepository,prismaDronesRepository,prismaDeliveryRepository)
    const result = await assignDeliveryUseCase.execute({ orderId });

    // segue seu padrão: 201 quando cria algo
    return reply.status(201).send(result);
  } catch (err: any) {
    return reply.status(400).send({ message: err?.message ?? "Failed to assign delivery" });
  }
}
