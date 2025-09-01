export interface GenerateReportOutput {
  deliveriesCount: number;
  ordersDelivered: number;
  totalKm: number;
  totalWeightKg: number;
  avgDeliveryMinutes: number;
  topDroneId: string; // nunca null/undefined
  droneRanking: {
    droneId: string;
    trips: number;
    totalKm: number;
    totalWeightKg: number;
    avgKmPerTrip: number;
    avgWeightKg: number;
    totalDurationMin: number;
  }[];
}
