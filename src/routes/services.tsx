import { createFileRoute, Link } from "@tanstack/react-router";
import { Gauge, Flame, PencilRuler, Wrench, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Gas Reticulation & Storage Design | Getgas Energen" },
      { name: "description", content: "LPG reticulation design, bulk storage, engineering drawings, installation, commissioning and maintenance for residential, commercial and industrial sites." },
      { property: "og:title", content: "Engineering Services — Getgas Energen Ltd" },
      { property: "og:description", content: "End-to-end LPG engineering: design, install, commission, maintain." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Gauge,
    title: "Gas Reticulation System Design",
    body: "Centralized piped LPG networks delivering gas from a bulk source to apartments, hotel rooms, restaurants and laboratories. We size pipework, locate isolation points and integrate metering for billing.",
    points: ["Demand & flow calculations", "Pipework sizing & routing", "Per-unit metering", "Emergency isolation valves"],
  },
  {
    icon: Flame,
    title: "LPG Bulk Storage Design",
    body: "Bulk tanks, Gas Off-Take (GOT) and Liquid Off-Take (LOT) cylinder manifolds engineered for your peak demand, footprint and safety setbacks.",
    points: ["Bulk tank sizing & siting", "Cylinder manifold (GOT/LOT)", "Auto-changeover regulators", "OPSO & UPSO protection"],
  },
  {
    icon: PencilRuler,
    title: "Engineering Design & Drawings",
    body: "P&IDs, isometrics, GA drawings and compliance documentation suitable for landlord approvals, EPRA submissions and contractor handover.",
    points: ["P&ID and isometric drawings", "Material take-offs", "Compliance documentation", "EPRA submission support"],
  },
  {
    icon: Wrench,
    title: "Installation & Commissioning",
    body: "Certified technicians lay, weld and pressure-test pipework, install regulators and tanks, and commission systems against the approved design.",
    points: ["Certified gas fitters", "Pressure & leak testing", "Tank & manifold install", "Handover documentation"],
  },
  {
    icon: ShieldCheck,
    title: "Inspection, Testing & Maintenance",
    body: "Scheduled service contracts that keep your gas system safe, compliant and uninterrupted — including emergency response.",
    points: ["Annual safety inspections", "Leak detection & repair", "Regulator replacement", "24/7 emergency callout"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-steel text-steel-foreground">
        <div className="absolute inset-0 blueprint-grid-dark opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Services</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            Designed, installed and maintained by gas engineers.
          </h1>
          <p className="mt-5 text-white/75 max-w-2xl text-lg">
            Five disciplines, one accountable partner. Whether you're piping gas
            to 200 apartments or storing bulk LPG for a factory, we own the
            engineering from sketch to sign-off.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        {services.map((s, i) => (
          <article key={s.title} className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-steel text-accent">
                <s.icon className="h-7 w-7" />
              </span>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                0{i + 1} / 0{services.length}
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
                {s.title}
              </h2>
            </div>
            <div>
              <p className="text-base text-muted-foreground leading-relaxed">{s.body}</p>
              <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 rounded-lg border border-border bg-card p-4 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Ready to scope your system?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Share your site details and we'll prepare a design proposal with
            compliance checklist within 5 working days.
          </p>
          <Button asChild size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">Get a quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
