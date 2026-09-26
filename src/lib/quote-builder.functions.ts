import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeQuote, ebkMechanicalFee, ebkTimeCharge, type EbkCategory } from "./quote-engine";

async function assertStaff(sb: any, userId: string) {
  const { data } = await sb.from("user_roles").select("role").eq("user_id", userId);
  if (!data?.length) throw new Error("Forbidden: staff only");
}

const line = z.object({ description: z.string().min(1).max(200), qty: z.number().min(0), unitCost: z.number().min(0).nullable() });
const input = z.object({
  quoteClass: z.enum(["residential", "commercial_kitchen", "estate"]),
  clientName: z.string().min(2).max(160),
  clientEmail: z.string().email().max(255).optional().or(z.literal("")),
  clientPhone: z.string().max(20).optional(),
  projectName: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  lines: z.array(line).max(200),
  labour: z.number().min(0),
  transport: z.number().min(0),
  ebkMode: z.enum(["percent", "time"]),
  ebkPct: z.number().min(7).max(10),
  ebkCategory: z.enum(["E1", "E2", "E3", "E4", "E5"]),
  ebkHours: z.number().min(0).max(5000),
  risk: z.enum(["low", "medium", "high"]),
  marginPct: z.number().min(0).max(90),
});

export const saveEngQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data: s } = await context.supabase.from("quote_settings").select("*").eq("id", 1).maybeSingle();
    const material = data.lines.reduce((a, l) => a + l.qty * (l.unitCost ?? 0), 0);
    const engineeringFee = data.ebkMode === "percent"
      ? ebkMechanicalFee(material + data.labour, data.ebkPct)
      : ebkTimeCharge(data.ebkCategory as EbkCategory, data.ebkHours);
    const r = computeQuote({
      lines: data.lines, labour: data.labour, transport: data.transport, engineeringFee,
      overheadPct: Number(s?.overhead_pct ?? 0), risk: data.risk,
      contingencyPct: { low: Number(s?.contingency_low_pct ?? 0), medium: Number(s?.contingency_medium_pct ?? 0), high: Number(s?.contingency_high_pct ?? 0) },
      marginPct: data.marginPct, minMarginPct: Number(s?.min_margin_pct ?? 0), vatPct: Number(s?.vat_pct ?? 16),
    });
    const { data: q, error } = await context.supabase.from("eng_quotes").insert({
      quote_class: data.quoteClass, client_name: data.clientName, client_email: data.clientEmail || null,
      client_phone: data.clientPhone || null, project_name: data.projectName || null, location: data.location || null,
      inputs: data as never, costs: { ...r, engineeringFee } as never, risk: data.risk,
      cost_total_kes: r.cost, sell_subtotal_kes: r.subtotal, vat_kes: r.vat, total_kes: r.total,
      margin_pct: data.marginPct, warnings: r.warnings as never, estimator_id: context.userId,
    }).select("id, quote_no").single();
    if (error) throw new Error(error.message);
    const items = data.lines.map((l, i) => ({ quote_id: q.id, section: "materials", description: l.description, unit: "pc", qty: l.qty, unit_cost_kes: l.unitCost, sort_order: i }));
    items.push({ quote_id: q.id, section: "engineering", description: data.ebkMode === "percent" ? `EBK mechanical fee ${data.ebkPct}%` : `EBK ${data.ebkCategory} time charge, ${data.ebkHours} h`, unit: "lot", qty: 1, unit_cost_kes: engineeringFee, sort_order: items.length });
    if (items.length) await context.supabase.from("eng_quote_items").insert(items);
    return { id: q.id, quoteNo: q.quote_no, result: r };
  });
