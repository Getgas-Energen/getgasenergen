/**
 * Getgas Energen Quote Engine — pure pricing core (no framework / DB imports).
 * Sources: Commercial Quote Engine guide; EBK Scale of Fees LN 20/2022.
 */

export type EbkCategory = "E1" | "E2" | "E3" | "E4" | "E5";
export type Risk = "low" | "medium" | "high";

export const EBK_RATES: Record<EbkCategory, { hourly: number; daily: number; monthly: number }> = {
  E1: { hourly: 12500, daily: 75000, monthly: 1250000 },
  E2: { hourly: 10500, daily: 63000, monthly: 1050000 },
  E3: { hourly: 8500, daily: 51000, monthly: 850000 },
  E4: { hourly: 7000, daily: 42000, monthly: 700000 },
  E5: { hourly: 4500, daily: 27000, monthly: 450000 },
};

export const EBK_STAGES = [
  { code: "feasibility", label: "Feasibility & preliminary design", pct: 30 },
  { code: "detailed_design", label: "Detailed design", pct: 45 },
  { code: "supervision", label: "Construction / installation supervision", pct: 25 },
] as const;

export const QUOTE_ONLY_THRESHOLD_KES = 850000;

/** Time charge: monthly rate applies once hours exceed 200 (Rule 30). */
export function ebkTimeCharge(category: EbkCategory, hours: number): number {
  const r = EBK_RATES[category];
  if (hours <= 0) return 0;
  if (hours > 200) return Math.round((hours / 200) * r.monthly);
  return hours * r.hourly;
}

/** Mechanical-lead discipline fee (7th Schedule, 7–10% of cost of works). */
export function ebkMechanicalFee(costOfWorks: number, pct: number, min = 7, max = 10): number {
  const p = Math.min(max, Math.max(min, pct));
  return Math.round(costOfWorks * (p / 100));
}

/** Split a fee into EBK stage lines (14th Schedule minimum allocations). */
export function ebkStageLines(fee: number, stages: readonly { code: string; label: string; pct: number }[] = EBK_STAGES) {
  return stages.map((s) => ({ ...s, amount: Math.round((fee * s.pct) / 100) }));
}

/** Target gross margin pricing: price = cost / (1 − margin). */
export function priceFromMargin(cost: number, marginPct: number): number {
  if (marginPct >= 100) throw new Error("Margin must be below 100%");
  return Math.round(cost / (1 - marginPct / 100));
}

export interface QuoteLine { description: string; qty: number; unitCost: number | null }
export interface QuoteInput {
  lines: QuoteLine[];
  labour: number;
  transport: number;
  engineeringFee: number;
  overheadPct: number;
  risk: Risk;
  contingencyPct: Record<Risk, number>;
  marginPct: number;
  minMarginPct: number;
  vatPct: number;
}

export function computeQuote(q: QuoteInput) {
  const warnings: string[] = [];
  let material = 0;
  for (const l of q.lines) {
    if (l.unitCost == null) warnings.push(`Missing price: ${l.description}`);
    else if (l.unitCost === 0) warnings.push(`Zero cost: ${l.description}`);
    else material += l.qty * l.unitCost;
  }
  const direct = material + q.labour + q.transport + q.engineeringFee;
  const overhead = direct * (q.overheadPct / 100);
  const contingency = (direct + overhead) * (q.contingencyPct[q.risk] / 100);
  const cost = Math.round(direct + overhead + contingency);
  if (q.marginPct < q.minMarginPct) warnings.push(`Margin ${q.marginPct}% below minimum ${q.minMarginPct}%`);
  const subtotal = priceFromMargin(cost, q.marginPct);
  const vat = Math.round(subtotal * (q.vatPct / 100));
  const total = subtotal + vat;
  return {
    material, overhead: Math.round(overhead), contingency: Math.round(contingency),
    cost, subtotal, vat, total, warnings,
    blocked: warnings.some((w) => w.startsWith("Missing price")),
    quoteOnly: total > QUOTE_ONLY_THRESHOLD_KES,
  };
}
