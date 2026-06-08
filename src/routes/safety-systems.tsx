import { createFileRoute, Link } from "@tanstack/react-router";
import { Radar, Power, Cpu, Siren, Radio, ShieldCheck, FileBadge, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/safety-systems")({
  head: () => ({
    meta: [
      { title: "Safety Systems — Gas Leak Detection, ESD & Fire Integration | Getgas Energen" },
      { name: "description", content: "Intelligent gas safety infrastructure: continuous leak detection, automatic shut-off, gas control panels, fire alarm integration, emergency shutdown and 24/7 remote monitoring." },
      { property: "og:title", content: "Safety Systems — Getgas Energen" },
      { property: "og:description", content: "Detect. Isolate. Protect. Respond." },
    ],
  }),
  component: SafetySystemsPage,
});

const subsystems = [
  { icon: Radar, title: "Gas Leak Detection", body: "Continuous LPG, methane, CO and combustible-gas monitoring with alarm escalation." },
  { icon: Power, title: "Automatic Shut-Off", body: "Solenoid valves and emergency isolation that fail safe on detection or signal loss." },
  { icon: Cpu, title: "Gas Control Panels", body: "Alarm monitoring, valve control, sensor health and event logging — local or remote." },
  { icon: Siren, title: "Fire Alarm Integration", body: "Two-way comms with FLS, BMS, SCADA and addressable / conventional fire panels." },
  { icon: ShieldCheck, title: "Emergency Shutdown (ESD)", body: "Manual and remote ESD stations for facility-wide isolation in seconds." },
  { icon: Radio, title: "Remote Monitoring", body: "24/7 cloud monitoring, real-time alerts, incident logs and predictive maintenance." },
  { icon: FileBadge, title: "Compliance & Certification", body: "EPRA, NEMA, OSHA, KEBS — full documentation pack handed over with the system." },
];

function SafetySystemsPage() {
  return (
    <>
      <section className="relative overflow-hidden text-white" style={{ background: "var(--gradient-royal)" }}>
        <div className="absolute inset-0 blueprint-grid-dark opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Safety Systems</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            Detect. Isolate. Protect. Respond.
          </h1>
          <p className="mt-5 text-white/80 max-w-2xl text-lg">
            When gas leaks occur, every second matters. We design integrated safety
            systems that automatically detect leaks, isolate supplies, notify operators
            and interface directly with fire and life-safety infrastructure.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {["Gas Leak Detection","Automatic Shut-Off","Fire Integration","Remote Monitoring"].map((b) => (
              <div key={b} className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-xs font-semibold text-center">
                ✓ {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading eyebrow="Subsystems" title="Layered safety, end-to-end." />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subsystems.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-primary text-accent">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detection flow */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading eyebrow="Detection-to-response flow" title="Automated, in under 3 seconds." align="center" />
          <ol className="mt-12 grid gap-4 sm:grid-cols-5 max-w-5xl mx-auto">
            {["Sensor detects gas","Panel raises alarm","Solenoid valves close","Operators notified","Incident logged"].map((step, i) => (
              <li key={step} className="relative rounded-xl border border-border bg-card p-5 text-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 grid h-7 w-7 place-items-center rounded-full bg-primary text-accent text-xs font-bold">
                  {i + 1}
                </span>
                <p className="mt-2 text-sm font-semibold text-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl text-white p-10 sm:p-14 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center" style={{ background: "var(--gradient-royal)" }}>
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Audit your site's gas safety.</h2>
            <p className="mt-3 text-white/80 max-w-xl">Free walkthrough and a prioritised safety upgrade plan.</p>
          </div>
          <div className="flex lg:justify-end">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Book a safety audit <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
