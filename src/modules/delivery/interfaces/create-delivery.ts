export interface CreateDelivery {
  droneId: string;
  orderIds: string[];
  startedAt?: Date;
};