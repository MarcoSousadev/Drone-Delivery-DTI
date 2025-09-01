// src/modules/delivery/controllers/update-delivery-status.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { UpdateDeliveryStatusUseCase } from "../usecases/update-delivery-status.ts";

import { PrismaDeliveryRepository } from "../repository/prisma-delivery-repository.ts";
import { PrismaDroneRepository } from "../../drones/repositories/prisma-drones-repository.ts";
import { PrismaOrdersRepository } from "../../orders/repositories/prisma-orders-repository.ts";

export async function updateDeliveryStatus(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() });
  const bodySchema = z.object({
    action: z.enum(["START", "FINISH", "CANCEL"]),
    startedAt: z.coerce.date().optional(),
    finishedAt: z.coerce.date().optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const { action, startedAt, finishedAt } = bodySchema.parse(request.body);

  try {
    const prismaDeliveryRepository = new PrismaDeliveryRepository()
    const prismaDroneRepository = new PrismaDroneRepository()
    const prismaOrdersRepository = new PrismaOrdersRepository()

    const updateDeliveryStatusUsecase = new UpdateDeliveryStatusUseCase(
      prismaDeliveryRepository, // ← 1º: DeliveryRepository
      prismaDroneRepository,   // ← 2º: DronesRepository
      prismaOrdersRepository    // ← 3º: OrdersRepository
    );

    const result = await updateDeliveryStatusUsecase.execute({
      deliveryId: id,
      action,
      startedAt,
      finishedAt,
    });

    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(400).send({ message: err?.message ?? "Failed to update delivery status" });
  }
}
