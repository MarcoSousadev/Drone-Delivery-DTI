export interface DeliveryWithOrders {
  id: string;
  droneId: string;
  startedAt: Date;
  finishedAt: Date | null;
  orders: { id: string }[];
}
