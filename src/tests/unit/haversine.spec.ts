import { describe, it, expect } from "vitest";
import { haversineKm } from "@/core/utils/harversineKm.ts";

describe("haversineKm", () => {
  it("retorna 0 para o mesmo ponto", () => {
    expect(haversineKm(0, 0, 0, 0)).toBeCloseTo(0, 6);
  });

  it("aproximadamente 111km por 1 grau de latitude", () => {
    const distanceKm = haversineKm(0, 0, 1, 0);
    expect(distanceKm).toBeGreaterThan(110);
    expect(distanceKm).toBeLessThan(112);
  });
});
