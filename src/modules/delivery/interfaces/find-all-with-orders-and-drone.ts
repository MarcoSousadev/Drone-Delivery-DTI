export interface CompletedDeliveryWithDroneAndOrders {
  id: string;
  droneId: string;
  startedAt: Date ;
  finishedAt: Date 
  drone: {
    id: string;
    baseLatitude: number;
    baseLongitude: number;
  };
  orders: Array<{
    id: string;
    latitude: number;
    longitude: number;
    packageWeight: number;
   
  }>;
}
