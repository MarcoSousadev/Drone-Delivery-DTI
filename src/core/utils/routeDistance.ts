import { haversineKm } from "./harversineKm.ts";

export interface Coordinate {
  latitude: number;
  longitude: number;
}


export function routeDistanceKm(base: Coordinate, stops: Coordinate[]): number {
  if (stops.length === 0) return 0;

  const remaining = [...stops];
  let current = base;
  let dist = 0;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let best = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const point = remaining[i]
      if(!point) continue

      const d = haversineKm(
        current.latitude,
        current.longitude,
        point.latitude,
        point.longitude
      );
      if (d < best) {
        best = d;
        bestIdx = i;
      }
    }

    const candidate = remaining[bestIdx];
    if (!candidate) break;  
    

    dist += best;
    current = candidate;
    remaining.splice(bestIdx, 1);
  }

  // volta pra base
  dist += haversineKm(current.latitude, current.longitude, base.latitude, base.longitude);

  if(dist > 12) {
    throw new Error("Not allowed to fly distance futher than 12km by batery issues.")
  }
  return dist;
}