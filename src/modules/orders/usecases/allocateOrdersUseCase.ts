import { prisma } from "../../../infra/prisma/prisma.ts";
import { PriorityQueue } from "../../../core/queue/priorityQueue.ts";
import type { Order } from "@prisma/client";

// Drone de exemplo (pode ser buscado do banco futuramente)
const drone = {
  id: "some-drone-id",
  capacity: 50, // kg
  maxDistance: 20, // km
};

// Função para calcular distância incremental usando Haversine
function calculateDistance(existingOrders: Order[], newOrder: Order): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // base inicial
  let fromLat = 0;
  let fromLon = 0;

  if (existingOrders.length > 0) {
    const lastOrder = existingOrders[existingOrders.length - 1];
    if (!lastOrder) {
      throw new Error("Last order is undefined");
    }
    fromLat = lastOrder.latitude.toNumber();
    fromLon = lastOrder.longitude.toNumber();
  }

  const toLat = newOrder.latitude.toNumber();
  const toLon = newOrder.longitude.toNumber();

  const dLat = toRad(toLat - fromLat);
  const dLon = toRad(toLon - fromLon);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function allocateOrders() {
  // 1) Buscar pedidos pendentes do banco
  const pendingOrders = await prisma.order.findMany({
    where: { status: "PENDING" },
  });

  const priorityQueue = new PriorityQueue(0, 0); // base em (0,0)
  const sortedOrders = priorityQueue.sort(pendingOrders);

  // 3) Criar deliveries diretamente no banco
  while (sortedOrders.length > 0) {
    const deliveryOrders: Order[] = [];

    for (let i = 0; i < sortedOrders.length; i++) {
      const currentOrder = sortedOrders[i];

      if (!currentOrder) continue

      // soma peso atual + novo pedido
      const newWeight =
        deliveryOrders.reduce((sum, o) => sum + o.packageWeight.toNumber(), 0) +
        currentOrder.packageWeight.toNumber();

      // soma distância incremental
      const newDistance =
        deliveryOrders.reduce(
          (sum, o, idx, arr) =>
            sum + calculateDistance(idx === 0 ? [] : arr.slice(0, idx), o),
          0
        ) + calculateDistance(deliveryOrders, currentOrder);

      if (newWeight <= drone.capacity && newDistance <= drone.maxDistance) {
        deliveryOrders.push(currentOrder);
        sortedOrders.splice(i, 1);
        i--;
      }
    }

    // Persistir Delivery no banco
    await prisma.delivery.create({
      data: {
        droneId: drone.id,
        orders: {
          connect: deliveryOrders.map((o) => ({ id: o.id })),
        },
      },
    });

    // Atualizar status das Orders para ALLOCATED
    await prisma.order.updateMany({
      where: { id: { in: deliveryOrders.map((o) => o.id) } },
      data: { status: "ALLOCATED" },
    });
  }

  return { message: "Orders allocated to deliveries successfully" };
}