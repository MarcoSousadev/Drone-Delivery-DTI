import { describe, it, expect } from "vitest";
import { AssignDeliveryUseCase } from "@/modules/delivery/usecases/assign-delivery.ts";
import { InMemoryOrdersRepository } from "../in-memory-repository/in-memory-orders-repository.ts";
import { InMemoryDronesRepository } from "../in-memory-repository/in-memory-drones-repository.ts";
import { InMemoryDeliveryRepository } from "../in-memory-repository/in-memory-delivery-repository.ts";

describe("Simulation Load Test", () => {
  it("distribui 50 pedidos em 2 drones respeitando peso e alcance", async () => {
    const ordersRepository = new InMemoryOrdersRepository();
    const dronesRepository = new InMemoryDronesRepository();
    const deliveryRepository = new InMemoryDeliveryRepository();

    // pedidos próximos da base para não estourar alcance
    for (let i = 0; i < 50; i++) {
      ordersRepository.pushRaw({
        id: `order-${i}`,
        latitude: (Math.random() - 0.5) * 0.04,   // -0.02 .. 0.02  (~2.2 km)
        longitude: (Math.random() - 0.5) * 0.04,  // -0.02 .. 0.02
        packageWeight: Number((Math.random() * 0.9 + 0.1).toFixed(2)),
        priority: i % 2 === 0 ? "HIGH" : "LOW",
      });
    }

    // 2 drones com bom alcance
    dronesRepository.pushRaw({
      id: "drone-1",
      baseLatitude: 0,
      baseLongitude: 0,
      status: "IDLE",
      rangeKm: 20,
      capacityKg: 2.3,
    });
    dronesRepository.pushRaw({
      id: "drone-2",
      baseLatitude: 0,
      baseLongitude: 0,
      status: "IDLE",
      rangeKm: 20,
      capacityKg: 2.3,
    });

    const useCase = new AssignDeliveryUseCase(
      ordersRepository,
      dronesRepository,
      deliveryRepository
    );

    // tenta alocar enquanto houver pedidos pendentes
    for (let i = 0; i < 50; i++) {
      const order = await ordersRepository.findById(`order-${i}`);
      if (order?.status === "PENDING") {
        const { delivery } = await useCase.execute({ orderId: order.id });

        // liberar drone para próxima iteração (simula fim da viagem)
        await dronesRepository.updateStatus(delivery.droneId, "IDLE");
      }
    }

    // Verifica quantos pedidos ficaram pendentes
    const remaining = await ordersRepository.findManyPending();
    const pendingCount = remaining.length;
    const allocatedOrders = 50 - pendingCount;

    // esperamos que a MAIORIA dos pedidos tenha sido alocada
    expect(allocatedOrders).toBeGreaterThan(30);
  });
});
