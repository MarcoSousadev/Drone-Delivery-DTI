import type { Delivery } from "@prisma/client";
import { WatchedList } from "../../../core/entities/watched-list.ts";

export class DeliveryWatchedList extends WatchedList<Delivery> {
  constructor(initialItems?: Delivery[]) {
    super(initialItems);
  }

  compareItems(a: Delivery, b: Delivery): boolean {
    return a.id === b.id;
  }

  public update(items: Delivery[]): void {
    const previousItems = [...this.currentItems];
    super.update(items);

    this.currentItems.forEach((delivery) => {
      const oldDelivery = previousItems.find((d) => d.id === delivery.id);
      if (oldDelivery && oldDelivery.finishedAt !== delivery.finishedAt) {
        this.onDeliveryFinished(delivery);
      }
    });
  }

  private onDeliveryFinished(delivery: Delivery) {
    console.log(`Delivery ${delivery.id} concluída em ${delivery.finishedAt}`);
    // Aqui você pode chamar o PrismaDeliveryRepository.conclude()
    // ou emitir eventos para atualizar o dashboard
  }
}
