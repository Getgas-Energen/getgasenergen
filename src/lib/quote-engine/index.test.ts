import { describe, it, expect } from "vitest";
import { ebkTimeCharge, ebkMechanicalFee, ebkStageLines, priceFromMargin, computeQuote } from "./index";

const base = {
  labour: 0, transport: 0, engineeringFee: 0, overheadPct: 0, risk: "low" as const,
  contingencyPct: { low: 0, medium: 5, high: 10 }, marginPct: 25, minMarginPct: 20, vatPct: 16,
};

describe("quote engine", () => {
  it("EBK hourly and monthly time charges", () => {
    expect(ebkTimeCharge("E4", 10)).toBe(70000);
    expect(ebkTimeCharge("E3", 400)).toBe(1700000);
  });
  it("clamps mechanical fee to 7–10%", () => {
    expect(ebkMechanicalFee(1_000_000, 15)).toBe(100000);
    expect(ebkMechanicalFee(1_000_000, 5)).toBe(70000);
  });
  it("splits stages 30/45/25", () => {
    expect(ebkStageLines(100000).map((s) => s.amount)).toEqual([30000, 45000, 25000]);
  });
  it("uses gross margin, not markup", () => {
    expect(priceFromMargin(75000, 25)).toBe(100000);
  });
  it("blocks missing prices and flags low margin", () => {
    const r = computeQuote({ ...base, marginPct: 10, lines: [{ description: "Regulator", qty: 1, unitCost: null }] });
    expect(r.blocked).toBe(true);
    expect(r.warnings.length).toBe(2);
  });
  it("adds VAT separately and flags quote-only", () => {
    const r = computeQuote({ ...base, lines: [{ description: "Tank", qty: 1, unitCost: 750000 }] });
    expect(r.subtotal).toBe(1000000);
    expect(r.vat).toBe(160000);
    expect(r.quoteOnly).toBe(true);
  });
});
