export interface DecimalLike { toNumber(): number }

export function decimal(value: number): DecimalLike {
  return { toNumber: () => value };
}

// helper para converter Decimal | DecimalLike | number -> number
export function asNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (value && typeof (value as any).toNumber === "function") {
    return (value as any).toNumber();
  }
  return Number(value);
}
