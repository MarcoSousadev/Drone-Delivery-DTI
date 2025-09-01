import type { FastifyRequest, FastifyReply } from "fastify";
import { GenerateReportUseCase } from "../usecases/generete-report-usecase.ts";

import { PrismaDeliveryRepository } from "@/modules/delivery/repository/prisma-delivery-repository.ts";
import { PrismaOrdersRepository } from "@/modules/orders/repositories/prisma-orders-repository.ts";
import { PrismaDroneRepository } from "@/modules/drones/repositories/prisma-drones-repository.ts";

export async function reportSimulation(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaDeliveryRepository = new PrismaDeliveryRepository();
    const prismaOrdersRepository = new PrismaOrdersRepository();
    const prismaDroneRepository = new PrismaDroneRepository();

    const usecase = new GenerateReportUseCase(
      prismaDeliveryRepository,
      prismaOrdersRepository,
      prismaDroneRepository
    );

    const result = await usecase.execute();
    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(500).send({ message: err?.message ?? "Fail to generate simulation report" });
  }
}
