import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, Smartphone, Gauge, AlertTriangle, Power, BarChart3, Users, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/smart-metering")({
  head: () => ({
    meta: [
      { title: "Smart Metering & Vending — The Future of LPG Utility Management" },
      { name: "description", content: "Prepaid LPG metering, tenant billing, mobile-money integration, consumption analytics, leak detection and remote shut-off. IoT-connected meters with landlord, tenant and portfolio dashboards." },
      { property: "og:title", content: "Smart Metering & Vending — Getgas Energen" },
      { property: "og:description", content: "Prepaid LPG meters, mobile-money billing, leak detection and remote shut-off — built for property managers." },
    ],
  }),
  component: SmartMeteringPage,
});

const features = [
  { icon: Gauge, title: "Prepaid Metering", body: "Tenants top up; meters dispense gas in real time." },
  { icon: Users, title: "Tenant Billing", body: "Automated per-unit invoicing — no manual reads, ever." },
  { icon: Smartphone, title: "Mobile Money", body: "M-Pesa STK push, USSD top-up, paybill integration." },
  { icon: BarChart3, title: "Consumption Analytics", body: "Per-unit, per-building, per-portfolio — exportable." },
  { icon: AlertTriangle, title: "Leak Alerts", body: "Anomaly detection flags abnormal flow and pressure." },
  { icon: Power, title: "Remote Shut-Off", body: "Isolate any unit or building from the dashboard." },
  { icon: Building2, title: "Owner Dashboard", body: "Revenue, consumption, alerts — at a glance." },
  { icon: Cpu, title: "Portfolio Management", body: "Manage hundreds of meters across all your properties." },
];

const dashboards = [
  { title: "Apartment Dashboard", who: "For property owners", bullets: ["Live consumption per unit", "Top-up history", "Leak & tamper alerts", "Revenue per period"] },
  { title: "Landlord Portfolio", who: "For multi-site operators", bullets: ["Cross-site revenue rollup", "Occupancy vs consumption", "Maintenance schedule", "Billing exports"] },
  { title: "Tenant Portal", who: "For end users", bullets: ["Top-up via M-Pesa", "Consumption history", "Low-balance alerts", "Receipts on demand"] },
];

function SmartMeteringPage() {
  return (
    <>
      <section className="relative overflow-hidden text-white" style={{ background: "var(--gradient-royal)" }}>
        <div className="absolute inset-0 blueprint-grid-dark opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Smart Metering & Vending</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            The future of LPG utility management.
          </h1>
          <p className="mt-5 text-white/80 max-w-2xl text-lg">
            Replace manual reads, paper invoices and supply disputes with an
            IoT-connected metering platform — prepaid, postpaid, mobile-money ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Request a demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading eyebrow="Platform features" title="A complete metering & vending stack." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-primary text-accent">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboards */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading eyebrow="Three dashboards, one platform" title="Built for owners, operators and tenants." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {dashboards.map((d) => (
              <div key={d.title} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="relative aspect-[16/10] blueprint-grid bg-background flex items-center justify-center">
                  <div className="absolute inset-6 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <p className="font-display text-sm text-primary/60 uppercase tracking-wider">Dashboard preview</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-accent font-semibold">{d.who}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold">{d.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl text-white p-10 sm:p-14 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center" style={{ background: "var(--gradient-royal)" }}>
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Replace manual billing this quarter.</h2>
            <p className="mt-3 text-white/80 max-w-xl">Site survey, meter spec and rollout plan in 7 days.</p>
          </div>
          <div className="flex lg:justify-end">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
