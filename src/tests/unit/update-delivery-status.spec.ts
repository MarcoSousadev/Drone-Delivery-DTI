import { describe, it, expect } from "vitest";
import { UpdateDeliveryStatusUseCase } from "@/modules/delivery/usecases/update-delivery-status.ts";
import {InMemoryDeliveryRepository} from "../in-memory-repository/in-memory-delivery-repository.ts";
import { InMemoryDronesRepository } from "../in-memory-repository/in-memory-drones-repository.ts";
import { InMemoryOrdersRepository } from "../in-memory-repository/in-memory-orders-repository.ts";

describe("UpdateDeliveryStatusUseCase", () => {
  it("START changes drone to IN_FLIGHT", async () => {
    const ordersRepo = new InMemoryOrdersRepository();
    const dronesRepo = new InMemoryDronesRepository();
    const deliveryRepo = new InMemoryDeliveryRepository();

    dronesRepo.pushRaw({ id: "drone-1", baseLatitude: 0, baseLongitude: 0, status: "LOADING" });
    const created = await deliveryRepo.create({ droneId: "drone-1", orderIds: [], startedAt: new Date() });

    const useCase = new UpdateDeliveryStatusUseCase(deliveryRepo as any, dronesRepo as any, ordersRepo as any);
    const response = await useCase.execute({ deliveryId: created.id, action: "START" });

    const droneAfter = (await dronesRepo.listAll()).find((drone) => drone.id === "drone-1");
    expect(droneAfter?.status).toBe("IN_FLIGHT");
    expect(response.delivery.id).toBe(created.id);
  });

  it("FINISH marks orders as DELIVERED and drone as RETURNING", async () => {
    const ordersRepository = new InMemoryOrdersRepository();
    const dronesRepository = new InMemoryDronesRepository();
    const deliveryRepository = new InMemoryDeliveryRepository();

    ordersRepository.pushRaw({ id: "order-1", latitude: 0, longitude: 0, packageWeight: 1, priority: "HIGH" });
    dronesRepository.pushRaw({ id: "drone-1", baseLatitude: 0, baseLongitude: 0, status: "IN_FLIGHT" });

    const created = await deliveryRepository.create({ droneId: "drone-1", orderIds: ["order-1"], startedAt: new Date() });

    const useCase = new UpdateDeliveryStatusUseCase(deliveryRepository as any, dronesRepository as any, ordersRepository as any);
    await useCase.execute({ deliveryId: created.id, action: "FINISH" });

    const orderAfter = await ordersRepository.findById("order-1");
    const droneAfter = (await dronesRepository.listAll()).find((drone) => drone.id === "drone-1");

    expect(orderAfter?.status).toBe("DELIVERED");
    expect(droneAfter?.status).toBe("RETURNING");
  });
});
