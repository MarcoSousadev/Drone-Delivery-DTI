import type { FastifyRequest, FastifyReply } from "fastify";
import { FinishSimulationUseCase } from "../usecases/finish-simulation-usecase.ts";

import { PrismaDeliveryRepository } from "@/modules/delivery/repository/prisma-delivery-repository.ts";
import { PrismaDroneRepository } from "@/modules/drones/repositories/prisma-drones-repository.ts";
import { PrismaOrdersRepository } from "@/modules/orders/repositories/prisma-orders-repository.ts";

export async function finishSimulation(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaDeliveryRepository = new PrismaDeliveryRepository();
    const prismaDroneRepository = new PrismaDroneRepository();
    const prismaOrdersRepository = new PrismaOrdersRepository();

    const finishSimulationUseCase = new FinishSimulationUseCase(
      prismaDroneRepository,
      prismaDeliveryRepository,
      prismaOrdersRepository
    );

    const result = await finishSimulationUseCase.execute();
    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(500).send({ message: err?.message ?? "Fail to finish simulation" });
  }
}
