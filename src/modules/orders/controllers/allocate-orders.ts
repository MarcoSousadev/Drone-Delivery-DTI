import type { FastifyRequest, FastifyReply } from "fastify";
import { AllocateOrdersUseCase } from "../usecases/allocateOrdersUseCase.ts";
import { PrismaOrdersRepository } from "../repositories/prisma-orders-repository.ts";
import { PrismaDeliveryRepository } from "../../delivery/repository/prisma-delivery-repository.ts";
import { PrismaDroneRepository } from "../../drones/repositories/prisma-drones-repository.ts"

export async function allocateOrders(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaOrdersRepository = new PrismaOrdersRepository()
      const prismaDronesRepository = new PrismaDroneRepository()
      const prismaDeliveryRepository = new PrismaDeliveryRepository()
    const allocateOrdersUseCase = new AllocateOrdersUseCase(prismaOrdersRepository,prismaDronesRepository,prismaDeliveryRepository);

    const report = await allocateOrdersUseCase.execute();

    return reply.status(200).send(report);
  } catch (err: any) {
    return reply.status(500).send({ message: err?.message ?? "Unexpected error" });
  }
}
