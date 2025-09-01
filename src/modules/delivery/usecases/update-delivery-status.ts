import type { DeliveryRepository } from "../repository/delivery-repository.ts";
import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";
import type { OrdersRepository } from "../../orders/repositories/ordersRepository.ts";

type UpdateAction = "START" | "FINISH" | "CANCEL";

type UpdateDeliveryStatusInput = {
  deliveryId: string;
  action: UpdateAction;
  finishedAt?: Date | undefined;
  startedAt?: Date | undefined;
};

type DeliverySummaryDTO = {
  id: string;
  droneId: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  orderIds: string[];
};

type UpdateDeliveryStatusResponse = { delivery: DeliverySummaryDTO };

const asDate = (d?: Date) => d ?? new Date();

export class UpdateDeliveryStatusUseCase {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly dronesRepository: DronesRepository,
    private readonly ordersRepository: OrdersRepository
  ) {}

  public async execute(input: UpdateDeliveryStatusInput): Promise<UpdateDeliveryStatusResponse> {
    const { deliveryId, action } = input;

    const delivery = await this.deliveryRepository.findByIdWithOrders(deliveryId);
    if (!delivery) throw new Error("Delivery não encontrada");

    const orderIds = delivery.orders.map(o => o.id);

    switch (action) {
      case "START": {
        if (!delivery.startedAt) {
          await this.deliveryRepository.setStartedAt(delivery.id, asDate(input.startedAt));
        }
        await this.dronesRepository.updateStatus(delivery.droneId, "IN_FLIGHT");
        break;
      }

      case "FINISH": {
        const finishedAt = asDate(input.finishedAt);
        await this.deliveryRepository.setFinishedAt(delivery.id, finishedAt);
        for (const id of orderIds) {
          await this.ordersRepository.updateStatus(id, "DELIVERED");
        }
        await this.dronesRepository.updateStatus(delivery.droneId, "RETURNING");
        break;
      }

      case "CANCEL": {
        for (const id of orderIds) {
          await this.ordersRepository.updateStatus(id, "PENDING");
        }
        await this.deliveryRepository.clearFinishedAt(delivery.id);
        await this.dronesRepository.updateStatus(delivery.droneId, "IDLE");
        break;
      }

      default:
        throw new Error("Ação inválida");
    }

    const updated = await this.deliveryRepository.findByIdWithOrders(deliveryId);
    if (!updated) throw new Error("Falha ao recarregar a delivery");

    return {
      delivery: {
        id: updated.id,
        droneId: updated.droneId,
        startedAt: updated.startedAt ?? null,
        finishedAt: updated.finishedAt ?? null,
        orderIds: updated.orders.map(o => o.id),
      },
    };
  }
}
