import { haversineKm } from "./harversineKm.ts";

type Point = { latitude: number | { toNumber(): number }; longitude: number | { toNumber(): number } };

const asNumber = (v: any) =>
  v == null ? 0 : typeof v === "number" ? v : typeof v.toNumber === "function" ? v.toNumber() : Number(v);

/**
 * Calcula a distância total (ida + entre paradas + retorno opcional).
 * Por padrão NÃO lança erro. Se quiser forçar limite, passe { maxDistanceKm }.
 */
export function routeDistanceKm(
  base: Point,
  stops: Point[],
  options?: { includeReturn?: boolean; maxDistanceKm?: number }
): number {
  const includeReturn = options?.includeReturn ?? true;

  let distanceKm = 0;
  let currentLat = asNumber(base.latitude);
  let currentLon = asNumber(base.longitude);

  for (const stop of stops) {
    const nextLat = asNumber(stop.latitude);
    const nextLon = asNumber(stop.longitude);
    distanceKm += haversineKm(currentLat, currentLon, nextLat, nextLon);
    currentLat = nextLat;
    currentLon = nextLon;
  }

  if (includeReturn && stops.length > 0) {
    distanceKm += haversineKm(
      currentLat,
      currentLon,
      asNumber(base.latitude),
      asNumber(base.longitude),
    );
  }

  if (options?.maxDistanceKm != null && distanceKm > options.maxDistanceKm) {
    throw new Error(`Route exceeds maxDistanceKm (${distanceKm.toFixed(2)} km > ${options.maxDistanceKm} km)`);
  }

  return distanceKm;
}
