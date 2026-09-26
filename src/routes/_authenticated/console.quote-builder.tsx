import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { computeQuote, ebkMechanicalFee, ebkStageLines, ebkTimeCharge, EBK_RATES, type EbkCategory, type Risk } from "@/lib/quote-engine";
import { saveEngQuote } from "@/lib/quote-builder.functions";

export const Route = createFileRoute("/_authenticated/console/quote-builder")({
  head: () => ({ meta: [{ title: "Quote builder | Getgas Energen Console" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: QuoteBuilder,
});

type Line = { description: string; qty: number; unitCost: number | null };
const kes = (v: number) => `KES ${Math.round(v).toLocaleString("en-KE")}`;
const Tip = ({ children }: { children: React.ReactNode }) => <p className="mt-1 text-xs text-muted-foreground">{children}</p>;

function QuoteBuilder() {
  const save = useServerFn(saveEngQuote);
  const [client, setClient] = useState({ clientName: "", clientEmail: "", clientPhone: "", projectName: "", location: "" });
  const [quoteClass, setQuoteClass] = useState<"residential" | "commercial_kitchen" | "estate">("residential");
  const [lines, setLines] = useState<Line[]>([{ description: "", qty: 1, unitCost: null }]);
  const [labour, setLabour] = useState(0);
  const [transport, setTransport] = useState(0);
  const [ebkMode, setEbkMode] = useState<"percent" | "time">("percent");
  const [ebkPct, setEbkPct] = useState(7);
  const [ebkCategory, setEbkCategory] = useState<EbkCategory>("E4");
  const [ebkHours, setEbkHours] = useState(0);
  const [risk, setRisk] = useState<Risk>("medium");
  const [marginPct, setMarginPct] = useState(25);
  const [busy, setBusy] = useState(false);

  const material = lines.reduce((a, l) => a + l.qty * (l.unitCost ?? 0), 0);
  const fee = ebkMode === "percent" ? ebkMechanicalFee(material + labour, ebkPct) : ebkTimeCharge(ebkCategory, ebkHours);
  const r = useMemo(() => computeQuote({ lines, labour, transport, engineeringFee: fee, overheadPct: 0, risk, contingencyPct: { low: 3, medium: 5, high: 10 }, marginPct, minMarginPct: 20, vatPct: 16 }), [lines, labour, transport, fee, risk, marginPct]);

  const setLine = (i: number, p: Partial<Line>) => setLines(lines.map((l, j) => (j === i ? { ...l, ...p } : l)));

  async function onSave() {
    setBusy(true);
    try {
      const res = await save({ data: { ...client, quoteClass, lines: lines.filter((l) => l.description), labour, transport, ebkMode, ebkPct, ebkCategory, ebkHours, risk, marginPct } });
      toast.success(`Saved draft ${res.quoteNo}`);
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Quote builder</h1>
        <p className="text-sm text-muted-foreground">Prices use target gross margin (price = cost ÷ (1 − margin)). VAT is shown separately. Engineering fees follow the EBK Scale of Fees (LN 20/2022).</p>
      </div>

      <section className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
        {(["clientName", "clientEmail", "clientPhone", "projectName", "location"] as const).map((k) => (
          <Input key={k} placeholder={k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} value={client[k]} onChange={(e) => setClient({ ...client, [k]: e.target.value })} />
        ))}
        <select className="h-9 rounded-md border bg-background px-2 text-sm" value={quoteClass} onChange={(e) => setQuoteClass(e.target.value as typeof quoteClass)}>
          <option value="residential">Residential / Villa</option>
          <option value="commercial_kitchen">Commercial kitchen</option>
          <option value="estate">Estate / Apartment</option>
        </select>
      </section>

      <section className="space-y-2 rounded-lg border p-4">
        <h2 className="font-medium">Bill of quantities</h2>
        <Tip>Leave cost empty if unknown — the quote is blocked from approval until every price is real. No prices are guessed.</Tip>
        {lines.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_140px_auto] gap-2">
            <Input placeholder="Item" value={l.description} onChange={(e) => setLine(i, { description: e.target.value })} />
            <Input type="number" value={l.qty} onChange={(e) => setLine(i, { qty: Number(e.target.value) })} />
            <Input type="number" placeholder="Unit cost" value={l.unitCost ?? ""} onChange={(e) => setLine(i, { unitCost: e.target.value === "" ? null : Number(e.target.value) })} />
            <Button variant="ghost" onClick={() => setLines(lines.filter((_, j) => j !== i))}>✕</Button>
          </div>
        ))}
        <Button variant="outline" onClick={() => setLines([...lines, { description: "", qty: 1, unitCost: null }])}>Add line</Button>
        <div className="grid gap-2 pt-2 md:grid-cols-2">
          <label className="text-sm">Labour (KES)<Input type="number" value={labour} onChange={(e) => setLabour(Number(e.target.value))} /></label>
          <label className="text-sm">Transport (KES)<Input type="number" value={transport} onChange={(e) => setTransport(Number(e.target.value))} /></label>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="font-medium">EBK engineering fee</h2>
        <div className="flex gap-2">
          <Button variant={ebkMode === "percent" ? "default" : "outline"} onClick={() => setEbkMode("percent")}>% of works</Button>
          <Button variant={ebkMode === "time" ? "default" : "outline"} onClick={() => setEbkMode("time")}>Time charge</Button>
        </div>
        {ebkMode === "percent" ? (
          <label className="block text-sm">Mechanical fee: {ebkPct}%
            <input type="range" min={7} max={10} step={0.5} value={ebkPct} onChange={(e) => setEbkPct(Number(e.target.value))} className="w-full" />
            <Tip>Seventh Schedule: mechanical-lead projects 7–10% of cost of works (materials + labour).</Tip>
          </label>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            <select className="h-9 rounded-md border bg-background px-2 text-sm" value={ebkCategory} onChange={(e) => setEbkCategory(e.target.value as EbkCategory)}>
              {Object.entries(EBK_RATES).map(([k, v]) => <option key={k} value={k}>{k} — {kes(v.hourly)}/h</option>)}
            </select>
            <Input type="number" placeholder="Hours" value={ebkHours} onChange={(e) => setEbkHours(Number(e.target.value))} />
            <Tip>Minimum statutory rates. Over 200 hours, the monthly rate applies.</Tip>
          </div>
        )}
        <div className="text-sm">Fee: <b>{kes(fee)}</b> — {ebkStageLines(fee).map((s) => `${s.label} ${kes(s.amount)}`).join(" · ")}</div>
        <Tip>These fees only cover professional engineering services, not materials or ordinary installation labour.</Tip>
      </section>

      <section className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
        <label className="text-sm">Risk / contingency
          <select className="mt-1 h-9 w-full rounded-md border bg-background px-2" value={risk} onChange={(e) => setRisk(e.target.value as Risk)}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </label>
        <label className="text-sm">Target margin: {marginPct}%
          <input type="range" min={0} max={60} value={marginPct} onChange={(e) => setMarginPct(Number(e.target.value))} className="w-full" />
        </label>
      </section>

      <section className="rounded-lg border p-4 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <span>Materials</span><span className="text-right">{kes(r.material)}</span>
          <span>Contingency</span><span className="text-right">{kes(r.contingency)}</span>
          <span>Total cost</span><span className="text-right">{kes(r.cost)}</span>
          <span>Selling subtotal</span><span className="text-right">{kes(r.subtotal)}</span>
          <span>VAT 16%</span><span className="text-right">{kes(r.vat)}</span>
          <span className="font-semibold">Total</span><span className="text-right font-semibold">{kes(r.total)}</span>
        </div>
        {r.quoteOnly && <p className="mt-2 text-primary">Above KES 850,000 — Quote Only.</p>}
        {r.warnings.map((w) => <p key={w} className="mt-1 text-destructive">⚠ {w}</p>)}
        <Button className="mt-4" disabled={busy || client.clientName.length < 2} onClick={onSave}>Save draft</Button>
      </section>
    </div>
  );
}
