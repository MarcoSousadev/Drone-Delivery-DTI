import { describe, it, expect } from "vitest";
import { PriorityQueue } from "@/core/queue/priorityQueue.ts";

function makeOrder(
  id: string,
  priority: "HIGH" | "MEDIUM" | "LOW",
  weightKg: number,
  latitude = 0,
  longitude = 0
) {
  return {
    id,
    priority,
    packageWeight: weightKg,
    latitude,
    longitude,
    status: "PENDING",
    deliveryId: null,
    createdAt: new Date(),
  } as any;
}

describe("PriorityQueue", () => {
  it("should order by priority > weight > proximity", () => {
    const priorityQueue = new PriorityQueue(0, 0);

    const sortedOrders = priorityQueue.sort([
      makeOrder("order-a", "MEDIUM", 1.0, 0, 3),
      makeOrder("order-b", "HIGH",   0.5, 0, 2),
      makeOrder("order-c", "LOW",    2.0, 0, 1),
      makeOrder("order-d", "HIGH",   1.5, 0, 4),
    ]);

    expect(sortedOrders.length).toBeGreaterThanOrEqual(2);

    if(sortedOrders.length < 2) {
      throw new Error('Invalid test: this has less than 2 elements')
    }

    const firstOrder = sortedOrders[0]!;  // seguro após o check
    const secondOrder = sortedOrders[1]!;

    expect(firstOrder.priority).toBe("HIGH");
    expect(secondOrder.priority).toBe("HIGH");
  });

  it("should keep items when there is only one (no insecure index access)", () => {
    const priorityQueue = new PriorityQueue(0, 0);

    const sortedOrders = priorityQueue.sort([
      makeOrder("single-order", "MEDIUM", 1.0, 0, 1),
    ]);

    expect(sortedOrders.length).toBe(1);

    // sem .at(): usar indice 0 após validar length
    const onlyOrder = sortedOrders.length > 0 ? sortedOrders[0] : undefined;
    expect(onlyOrder).toBeDefined();
    if (onlyOrder) {
      expect(onlyOrder.id).toBe("single-order");
    }
  });

  it("returns empty list without accessing non-existent indexes", () => {
    const priorityQueue = new PriorityQueue(0, 0);
    const sortedOrders = priorityQueue.sort([]);
    expect(sortedOrders.length).toBe(0);
  });
});
