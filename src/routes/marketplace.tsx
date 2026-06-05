import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Gauge, Wrench, ShieldCheck, CircleDot, Cylinder, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Gas Pipes, Fittings & Fireplaces | Getgas Energen" },
      { name: "description", content: "Browse pipes, fittings, regulators, valves, fireplaces, cylinders and safety accessories. Request a quote and we deliver across Kenya." },
      { property: "og:title", content: "Marketplace — Getgas Energen" },
      { property: "og:description", content: "Quality gas hardware: pipes, fittings, fireplaces and more." },
    ],
  }),
  component: MarketplacePage,
});

const categories = [
  { id: "all", label: "All", icon: Gauge },
  { id: "pipes", label: "Pipes & Fittings", icon: Wrench },
  { id: "regulators", label: "Regulators & Valves", icon: CircleDot },
  { id: "fireplaces", label: "Fireplaces", icon: Flame },
  { id: "cylinders", label: "Cylinders & Manifolds", icon: Cylinder },
  { id: "safety", label: "Safety Accessories", icon: ShieldCheck },
] as const;

type CatId = (typeof categories)[number]["id"];

const products: { name: string; category: Exclude<CatId, "all">; spec: string; icon: typeof Gauge }[] = [
  { name: "Copper Pipe — 15mm × 3m", category: "pipes", spec: "EN 1057 R250, half-hard", icon: Wrench },
  { name: "Brass Compression Tee — 15mm", category: "pipes", spec: "DZR brass, BS EN 1254", icon: Wrench },
  { name: "Black Iron Pipe — 1/2\" × 6m", category: "pipes", spec: "ASTM A53, threaded ends", icon: Wrench },
  { name: "Flexible Stainless Hose", category: "pipes", spec: "AISI 304, 1m, ½\" BSP", icon: Wrench },
  { name: "Auto-Changeover Regulator", category: "regulators", spec: "2 × 4 kg/h, 37 mbar outlet", icon: CircleDot },
  { name: "OPSO / UPSO Safety Valve", category: "regulators", spec: "Excess pressure shut-off", icon: ShieldCheck },
  { name: "First-Stage Regulator — 12 kg/h", category: "regulators", spec: "0.75 bar outlet, bulk service", icon: CircleDot },
  { name: "Ball Valve — ½\" BSP", category: "regulators", spec: "Brass, lever handle, gas-rated", icon: CircleDot },
  { name: "Built-in Linear Fireplace", category: "fireplaces", spec: "1.2 m glass front, LPG, remote", icon: Flame },
  { name: "Free-standing Patio Heater", category: "fireplaces", spec: "Stainless, 13 kW, piezo ignition", icon: Flame },
  { name: "Cast Iron Stove Fireplace", category: "fireplaces", spec: "8 kW, viewing glass, LPG kit", icon: Flame },
  { name: "13 kg LPG Cylinder", category: "cylinders", spec: "EN 1442, refillable", icon: Cylinder },
  { name: "47.5 kg LOT Cylinder", category: "cylinders", spec: "Liquid off-take, manifold-ready", icon: Cylinder },
  { name: "6-Cylinder GOT Manifold", category: "cylinders", spec: "Auto-changeover, copper pigtails", icon: Cylinder },
  { name: "Gas Leak Detector", category: "safety", spec: "LPG-specific, audible + visual", icon: ShieldCheck },
  { name: "Emergency Shut-off Solenoid", category: "safety", spec: "12V DC, ½\" BSP, NC", icon: ShieldCheck },
];

function MarketplacePage() {
  const [active, setActive] = useState<CatId>("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading
            eyebrow="Marketplace"
            title="Gas hardware, sourced right."
            description="Pipes, fittings, regulators, fireplaces and safety gear — request a quote and we deliver across Kenya."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={
                    isActive
                      ? "inline-flex items-center gap-2 rounded-full bg-steel px-4 py-2 text-sm font-semibold text-steel-foreground"
                      : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  }
                >
                  <c.icon className="h-4 w-4" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <article key={p.name} className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-lg">
              <div className="relative aspect-square blueprint-grid bg-surface flex items-center justify-center">
                <p.icon className="h-16 w-16 text-blueprint" strokeWidth={1.4} />
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider rounded bg-card/90 px-2 py-1 font-semibold text-muted-foreground border border-border">
                  {categories.find((c) => c.id === p.category)?.label}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground flex-1">{p.spec}</p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/contact" search={{ product: p.name } as never}>
                    Request quote
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-steel text-steel-foreground p-8 sm:p-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold">Need a bulk quote or custom spec?</h3>
            <p className="mt-2 text-white/70">Share your BOQ and we'll get back with pricing, lead times and delivery options.</p>
          </div>
          <div className="flex lg:justify-end">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Get a quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
