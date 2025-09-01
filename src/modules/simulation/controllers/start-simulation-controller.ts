import type { FastifyRequest, FastifyReply } from "fastify";
import { StartSimulationUseCase } from "../usecases/start-simulation-usecase.ts";

import { PrismaDeliveryRepository } from "@/modules/delivery/repository/prisma-delivery-repository.ts";
import { PrismaDroneRepository } from "@/modules/drones/repositories/prisma-drones-repository.ts";

export async function startSimulation(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaDeliveryRepository = new PrismaDeliveryRepository();
    const prismaDroneRepository = new PrismaDroneRepository();

    const startSimulationUseCase = new StartSimulationUseCase(
      prismaDeliveryRepository,
      prismaDroneRepository
    );

    const result = await startSimulationUseCase.execute();
    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(500).send({ message: err?.message ?? "Falha ao iniciar simulação" });
  }
}
