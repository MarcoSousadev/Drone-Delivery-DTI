import type { FastifyRequest, FastifyReply } from "fastify";
import { AdvanceSimulationUseCase } from "../usecases/advance-simulation-usecase.ts";
import { PrismaDeliveryRepository } from "@/modules/delivery/repository/prisma-delivery-repository.ts";
import { PrismaDroneRepository } from "@/modules/drones/repositories/prisma-drones-repository.ts";
import { PrismaOrdersRepository } from "@/modules/orders/repositories/prisma-orders-repository.ts";

export async function advanceSimulation(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaDeliveryRepository = new PrismaDeliveryRepository();
    const prismaDroneRepository = new PrismaDroneRepository();
    const prismaOrdersRepository = new PrismaOrdersRepository();

    const advanceSimulationUseCase = new AdvanceSimulationUseCase(
      prismaDroneRepository,
      prismaDeliveryRepository,
      prismaOrdersRepository
    );

    const result = await advanceSimulationUseCase.execute();
    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(500).send({ message: err?.message ?? "Falha ao avançar simulação" });
  }
}
