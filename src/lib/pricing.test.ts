import { describe, expect, it } from "vitest";
import { computeTotals } from "./pricing";

describe("pricing", () => {
  it("charges 3,90 € shipping for orders of 65 € or less", () => {
    expect(computeTotals([{ price: 65, qty: 1 }]).shipping).toBe(3.9);
  });
  it("ships free for orders over 65 €", () => {
    expect(computeTotals([{ price: 40, qty: 2 }]).shipping).toBe(0);
  });
  it("adds 2 € for cash on delivery", () => {
    expect(computeTotals([{ price: 10, qty: 1 }], "cod").total).toBe(15.9);
  });
});
