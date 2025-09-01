type LatLng = { latitude: number; longitude: number };

export type DeliveryPoint =
  | ({ kind: "BASE"; droneId: string } & LatLng)
  | ({ kind: "ORDER"; deliveryId: string; droneId: string } & LatLng);

export interface AsciiMapOptions {
  width?: number;    // default 60
  height?: number;   // default 20
  baseChar?: string; // default "B"
  orderChar?: string;// default "•"
  padding?: number;  // default 1 (margem na renderização)
}

function projectToGrid(
  point: LatLng,
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  width: number,
  height: number
) {
  const { latitude, longitude } = point;
  const { minLat, maxLat, minLon, maxLon } = bounds;

  const latRange = Math.max(1e-9, maxLat - minLat);
  const lonRange = Math.max(1e-9, maxLon - minLon);

  // x: esquerda -> direita
  const x = Math.round(((longitude - minLon) / lonRange) * (width - 1));
  // y: topo -> base (maior lat no topo)
  const y = Math.round(((maxLat - latitude) / latRange) * (height - 1));

  return { x, y };
}

export function renderAsciiDeliveriesMap(
  points: DeliveryPoint[],
  options: AsciiMapOptions = {}
): string {
  const width = options.width ?? 60;
  const height = options.height ?? 20;
  const baseChar = options.baseChar ?? "B";
  const orderChar = options.orderChar ?? "•";

  if (points.length === 0) {
    return "(no points to render)";
  }

  // bounds
  let minLat = +Infinity, maxLat = -Infinity, minLon = +Infinity, maxLon = -Infinity;
  for (const p of points) {
    if (p.latitude < minLat) minLat = p.latitude;
    if (p.latitude > maxLat) maxLat = p.latitude;
    if (p.longitude < minLon) minLon = p.longitude;
    if (p.longitude > maxLon) maxLon = p.longitude;
  }

  // fallback se todos forem iguais (evita divisão por zero)
  if (minLat === maxLat) { minLat -= 0.001; maxLat += 0.001; }
  if (minLon === maxLon) { minLon -= 0.001; maxLon += 0.001; }

  const bounds = { minLat, maxLat, minLon, maxLon };

  // canvas
  const grid: string[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => " ")
  );

  // desenha primeiro orders, depois bases (bases “por cima”)
  for (const p of points.filter(p => p.kind === "ORDER")) {
    const { x, y } = projectToGrid(p, bounds, width, height);
    if (x >= 0 && x < width && y >= 0 && y < height) {
      grid[y]![x] = orderChar;
    }
  }
  for (const p of points.filter(p => p.kind === "BASE")) {
    const { x, y } = projectToGrid(p, bounds, width, height);
    if (x >= 0 && x < width && y >= 0 && y < height) {
      grid[y]![x] = baseChar;
    }
  }

  // bordas
  const topBorder = "┌" + "─".repeat(width) + "┐";
  const bottomBorder = "└" + "─".repeat(width) + "┘";
  const lines = grid.map(row => "│" + row.join("") + "│");

  return [
    topBorder,
    ...lines,
    bottomBorder,
    "",
    `Legend: ${baseChar}=Drone Base, ${orderChar}=Order`,
    `Bounds: lat[${minLat.toFixed(5)}, ${maxLat.toFixed(5)}], lon[${minLon.toFixed(5)}, ${maxLon.toFixed(5)}]`
  ].join("\n");
}
