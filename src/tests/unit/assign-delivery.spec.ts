import { describe, it, expect } from "vitest";
import { AssignDeliveryUseCase } from "@/modules/delivery/usecases/assign-delivery.ts";
import { InMemoryDeliveryRepository } from "../in-memory-repository/in-memory-delivery-repository.ts";
import { InMemoryDronesRepository } from "../in-memory-repository/in-memory-drones-repository.ts";
import { InMemoryOrdersRepository } from "../in-memory-repository/in-memory-orders-repository.ts";

describe("AssignDeliveryUseCase", () => {
  it("should throw error if main order exceeds weight capacity", async () => {
    const ordersRepository = new InMemoryOrdersRepository();
    const dronesRepository = new InMemoryDronesRepository();
    const deliveryRepository = new InMemoryDeliveryRepository();
    // pedidos
    ordersRepository.pushRaw({
      id: "order-heavy",
      latitude: 0,
      longitude: 0,
      packageWeight: 3.0, // > 2.3 kg
      priority: "HIGH",
    });

    // drones
    dronesRepository.pushRaw({
      id: "drone-1",
      baseLatitude: 0,
      baseLongitude: 0,
      status: "IDLE",
      rangeKm: 50,
      capacityKg: 2.3,
    });

    const useCase = new (AssignDeliveryUseCase as any)(
      ordersRepository,
      dronesRepository,
      deliveryRepository
    );

    await expect(useCase.execute({ orderId: "order-heavy" }))
      .rejects
      .toThrow(/excede capacidade/i);
  });

  it("Should allocate multiple orders when they fit in weight and range", async () => {
    const ordersRepository = new InMemoryOrdersRepository();
    const dronesRepository = new InMemoryDronesRepository();
    const deliveryRepository = new InMemoryDeliveryRepository();

    // pedidos próximos (≈ até ~2.2 km)
    ordersRepository.pushRaw({
      id: "order-main",
      latitude: 0,
      longitude: 0.02, // ~2.2km da base
      packageWeight: 1.6,
      priority: "HIGH",
    });
    ordersRepository.pushRaw({
      id: "order-02",
      latitude: 0,
      longitude: 0.022, // ~2.4km da base (bem perto do main)
      packageWeight: 0.4,
      priority: "MEDIUM",
    });
    ordersRepository.pushRaw({
      id: "order-far",
      latitude: 0,
      longitude: 0.1, // ~11.1km (se rangeKm=5, esse deve ficar de fora)
      packageWeight: 0.5,
      priority: "LOW",
    });

    // drone com alcance suficiente para pegar os dois primeiros e voltar
    dronesRepository.pushRaw({
      id: "drone-1",
      baseLatitude: 0,
      baseLongitude: 0,
      status: "IDLE",
      rangeKm: 20, // suficiente para ida e volta em 0.02 + 0.022
      capacityKg: 2.3,
    });


    // drone disponível (use o DRONES repository aqui, não o DELIVERY)
    dronesRepository.pushRaw({
      id: "drone-1",
      baseLatitude: 0,
      baseLongitude: 0,
      status: "IDLE",
      rangeKm: 5, // curto de propósito
      capacityKg: 2.3,
    });

    const useCase = new (AssignDeliveryUseCase as any)(
      ordersRepository,
      dronesRepository,
      deliveryRepository
    );

    const { delivery } = await useCase.execute({ orderId: "order-main" });

    expect(delivery.droneId).toBe("drone-1");

    const mainOrder = await ordersRepository.findById("order-main");
    const nearOrder = await ordersRepository.findById("order-02");
    const farOrder = await ordersRepository.findById("order-far");

    expect(mainOrder?.status).toBe("ALLOCATED");
    expect(nearOrder?.status).toBe("ALLOCATED");
    expect(farOrder?.status).toBe("PENDING");
  });
});
