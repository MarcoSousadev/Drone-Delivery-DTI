import { describe, it, expect } from "vitest";
import { routeDistanceKm } from "@/core/utils/routeDistance.ts";

describe("routeDistanceKm (opções)", () => {
  it("should not return when includeReturn=false", () => {
    const dist = routeDistanceKm(
      { latitude:0, longitude:0 },
      [{ latitude:0, longitude:0.02 }],
      { includeReturn: false }
    );
    expect(dist).toBeGreaterThan(2); // ~2.2km
    expect(dist).toBeLessThan(3);
  });

  it("Should throw if maxDistanceKm is exceeded", () => {
    expect(() =>
      routeDistanceKm(
        { latitude:0, longitude:0 },
        [{ latitude:0, longitude:0.02 }],
        { maxDistanceKm: 1 }
      )
    ).toThrow(/exceeds maxDistanceKm/i);
  });
});
