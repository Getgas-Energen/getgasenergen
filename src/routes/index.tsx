import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ShieldCheck, Gauge, Wrench, CheckCircle2, Building2, Factory, Home as HomeIcon,
  Cpu, Radar, GraduationCap, Stethoscope, Hotel, Sprout, Landmark, ExternalLink,
  Cog, FlaskConical, Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import heroImage from "@/assets/hero-storage.jpg";
import manifoldImage from "@/assets/project-manifold.jpg";
import residentialImage from "@/assets/project-residential.jpg";
import commercialImage from "@/assets/project-commercial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Getgas Energen — East Africa's LPG Infrastructure & Energy Engineering Company" },
      { name: "description", content: "Designing, Building, Metering and Operating LPG Infrastructure for Residential, Commercial, Industrial and Institutional Clients." },
      { property: "og:title", content: "Getgas Energen — LPG Infrastructure Engineering" },
      { property: "og:description", content: "Design. Build. Meter. Protect. Operate. Scale." },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: Network, title: "Residential Gas Reticulation", body: "Centralized piped gas for apartments, estates and mixed-use developments." },
  { icon: Building2, title: "Commercial LPG Systems", body: "Restaurants, malls, corporate kitchens and food courts." },
  { icon: Factory, title: "Industrial LPG Infrastructure", body: "Boilers, process heat and manufacturing — designed for demand." },
  { icon: Gauge, title: "Bulk Storage Installations", body: "Above-ground and mounded LPG tanks, manifolds and changeovers." },
  { icon: Cpu, title: "Smart Metering & Vending", body: "Prepaid, postpaid, IoT-connected, mobile-money ready." },
  { icon: Radar, title: "Safety Systems", body: "Leak detection, ESD, automatic shut-off, fire alarm integration." },
  { icon: Wrench, title: "Operations & Maintenance", body: "Scheduled service, leak surveys, recertification, emergency response." },
  { icon: Cog, title: "Engineering & EPC", body: "Feasibility, design, procurement, construction and commissioning." },
];

const industries = [
  { icon: HomeIcon, label: "Residential" },
  { icon: GraduationCap, label: "Education" },
  { icon: Stethoscope, label: "Healthcare" },
  { icon: Hotel, label: "Hospitality" },
  { icon: Sprout, label: "Agriculture" },
  { icon: Factory, label: "Industrial" },
  { icon: Landmark, label: "Government" },
  { icon: ShieldCheck, label: "Defence" },
];

const metrics = [
  { v: "120+", l: "Projects Delivered" },
  { v: "180km", l: "Pipe Installed" },
  { v: "4,500+", l: "Meters Connected" },
  { v: "250m³", l: "Storage Installed" },
  { v: "12", l: "Counties Served" },
  { v: "60+", l: "Years Combined Exp." },
];

const projects = [
  { img: residentialImage, type: "Residential", title: "120-unit estate reticulation", location: "Kiambu" },
  { img: manifoldImage, type: "Manifold", title: "Auto-changeover LOT system", location: "Westlands" },
  { img: commercialImage, type: "Commercial", title: "Hotel kitchen piped gas", location: "Mombasa" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-white" style={{ background: "var(--gradient-royal)" }}>
        <div className="absolute inset-0 blueprint-grid-dark opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:px-8 py-20 lg:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Engineering · EPC · Metering · Safety
            </p>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05]">
              East Africa's <span className="text-accent">LPG Infrastructure</span> & Energy Engineering Company.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
              Designing, Building, Metering and Operating LPG Infrastructure for
              Residential, Commercial, Industrial and Institutional clients.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Request Feasibility Study <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link to="/contact">Talk to an Engineer</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Link to="/contact">Calculate Project Cost</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-accent/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-xl border border-white/15 shadow-2xl">
              <img src={heroImage} alt="LPG bulk storage installation" width={1920} height={1080} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[--royal-deep]/60 via-transparent to-cyan-300/10 mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-lg bg-background px-4 py-3 text-foreground shadow-xl border border-border">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-accent/15 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">EPRA · KEBS · NEMA</p>
                <p className="text-sm font-semibold">Compliant by design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((m) => (
            <div key={m.l}>
              <p className="font-display text-2xl lg:text-3xl font-bold text-primary">{m.v}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          eyebrow="What we do"
          title="End-to-end LPG engineering"
          description="Eight integrated disciplines under one accountable team — from the first feasibility study to decades of safe operation."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:-translate-y-0.5">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-primary text-accent">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
            Explore all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading eyebrow="Industries we serve" title="Built for every sector that runs on energy." />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {industries.map((ind) => (
              <Link key={ind.label} to="/industries" className="group rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/50 hover:shadow-md">
                <ind.icon className="mx-auto h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                <p className="mt-3 text-sm font-semibold text-foreground">{ind.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Why Getgas Energen"
            title="Engineering expertise, end-to-end."
            description="We don't just install — we engineer. Every system is sized, modelled, certified and monitored by the same team that designs it."
          />
          <ul className="mt-8 space-y-4">
            {[
              "Licensed engineering team (Energy / Mechanical / Safety)",
              "EPRA, KEBS, NEMA & Petroleum Act 2019 compliant",
              "Smart metering & remote monitoring on every system",
              "End-to-end EPC: one contract, one accountable team",
              "Regional coverage across Kenya & East Africa",
              "Digital project portal — drawings, photos, certificates",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <FlaskConical className="h-6 w-6 text-primary" />
            <p className="mt-4 font-display text-2xl font-bold">Design-first</p>
            <p className="mt-1 text-sm text-muted-foreground">Hydraulic calcs, P&IDs, pressure modelling.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Cpu className="h-6 w-6 text-primary" />
            <p className="mt-4 font-display text-2xl font-bold">Connected</p>
            <p className="mt-1 text-sm text-muted-foreground">IoT meters, dashboards, M-Pesa billing.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Radar className="h-6 w-6 text-primary" />
            <p className="mt-4 font-display text-2xl font-bold">Safe by default</p>
            <p className="mt-1 text-sm text-muted-foreground">ESD, leak detection, fail-safe valves.</p>
          </div>
          <div className="col-span-2 rounded-xl p-6 text-white" style={{ background: "var(--gradient-royal)" }}>
            <p className="font-display text-3xl font-bold">Design. Build. Meter.</p>
            <p className="font-display text-3xl font-bold text-accent">Protect. Operate. Scale.</p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Featured projects" title="Selected installations" />
            <Link to="/projects" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary">
              All projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <article key={p.title} className="group overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold">{p.type}</p>
                  <h3 className="mt-2 font-display font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AGREGAS cross-link */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Also from Getgas Holdings</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Need cooking gas, not infrastructure?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg">
              On-demand LPG cylinders, accessories and same-day delivery are handled
              by our sister marketplace — AGREGAS. Engineering enquiries stay with us.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href="https://getgas.co.ke" target="_blank" rel="noopener noreferrer">
                  Visit AGREGAS <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/marketplace">Browse our equipment catalog</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-sm">
            <p className="font-semibold text-foreground">Getgas Holdings PLC</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>↳ <span className="text-foreground font-medium">Getgas Energen</span> — Engineering & Infrastructure (you're here)</li>
              <li>↳ <span className="text-foreground font-medium">Getgas Kenya</span> — On-demand cooking gas</li>
              <li>↳ <span className="text-foreground font-medium">AGREGAS</span> — LPG marketplace</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-2xl text-white p-10 sm:p-14" style={{ background: "var(--gradient-royal)" }}>
          <div className="absolute inset-0 blueprint-grid-dark opacity-30" />
          <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Book an Engineering Assessment.</h2>
              <p className="mt-3 text-white/80 max-w-xl">
                Tell us about your site — we'll come back with a scope, compliance
                checklist and a fixed-price design proposal within 5 working days.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Start your project <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
