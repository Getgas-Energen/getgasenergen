import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Gauge, Wrench, Flame, CheckCircle2, Building2, Factory, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import heroImage from "@/assets/hero-storage.jpg";
import manifoldImage from "@/assets/project-manifold.jpg";
import residentialImage from "@/assets/project-residential.jpg";
import commercialImage from "@/assets/project-commercial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Getgas Energen Ltd — Engineering Gas Reticulation & Storage Design" },
      { name: "description", content: "Kenya's trusted engineering partner for LPG reticulation, bulk storage and piped gas infrastructure. Safe, compliant, built to last." },
      { property: "og:title", content: "Getgas Energen Ltd — Engineering Gas Reticulation & Storage Design" },
      { property: "og:description", content: "Designing and installing safe LPG reticulation and bulk storage for homes, estates and industry." },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: Gauge, title: "Reticulation Design", body: "Centralized piped gas systems for estates, apartments and commercial kitchens." },
  { icon: Flame, title: "Bulk LPG Storage", body: "Bulk tanks, GOT and LOT cylinder manifolds engineered to demand." },
  { icon: Wrench, title: "Installation", body: "Pipework, valves and metering installed by certified gas technicians." },
  { icon: ShieldCheck, title: "Inspection & Maintenance", body: "Pressure testing, leak detection and scheduled service contracts." },
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
      <section className="relative overflow-hidden bg-steel text-steel-foreground">
        <div className="absolute inset-0 blueprint-grid-dark opacity-60" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:px-8 py-20 lg:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Engineering · Reticulation · Storage
            </p>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Engineered gas solutions for <span className="text-accent">homes, estates</span> & industry.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75 leading-relaxed">
              Getgas Energen designs, installs and maintains safe LPG reticulation
              and bulk storage systems across Kenya — built to EPRA standards and
              the Petroleum Act 2019.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">
                  Request a design <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link to="/projects">View projects</Link>
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/55">Since</dt>
                <dd className="mt-1 font-display text-2xl font-bold">2016</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/55">Markets</dt>
                <dd className="mt-1 font-display text-2xl font-bold">KE · CA</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/55">Compliance</dt>
                <dd className="mt-1 font-display text-2xl font-bold">EPRA</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-accent/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <img
                src={heroImage}
                alt="Bulk LPG storage tank installation at a residential complex"
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-lg bg-background px-4 py-3 text-foreground shadow-xl border border-border">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-accent/15 text-accent">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Safety first</p>
                <p className="text-sm font-semibold">Auto-changeover · OPSO · UPSO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          eyebrow="What we do"
          title="End-to-end gas engineering"
          description="From the first sketch to the final commissioning report — we own the full lifecycle of your LPG system."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/40 hover:shadow-lg">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-steel text-accent">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all">
            Explore all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Why Getgas"
              title="Safety, compliance, uptime."
              description="We engineer every system around three principles: it should be safe to live with, compliant on paper, and reliable for decades."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Designs to EPRA & Petroleum (LPG) Regulations 2019",
                "OPSO and UPSO valves on every bulk system",
                "Pressure-tested and certified before handover",
                "Sectors served: residential, hospitality, institutional, industrial",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: HomeIcon, label: "Residential" },
              { icon: Building2, label: "Commercial" },
              { icon: Factory, label: "Industrial" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-6 text-center">
                <s.icon className="mx-auto h-7 w-7 text-blueprint" />
                <p className="mt-3 text-sm font-semibold text-foreground">{s.label}</p>
              </div>
            ))}
            <div className="col-span-3 rounded-xl bg-steel p-6 text-steel-foreground">
              <p className="font-display text-3xl font-bold">9+ years</p>
              <p className="mt-1 text-sm text-white/70">designing & installing LPG infrastructure across East Africa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading eyebrow="Recent work" title="Selected installations" />
          <Link to="/projects" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-accent">
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
                <p className="text-xs uppercase tracking-wider text-accent font-semibold">{p.type}</p>
                <h3 className="mt-2 font-display font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MARKETPLACE TEASER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Marketplace</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Pipes, fittings, regulators & fireplaces.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Source quality gas hardware for your project from a single, trusted
              supplier. Browse our catalog and request a quote — we deliver.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-steel text-steel-foreground hover:bg-steel/90">
                <Link to="/marketplace">Browse marketplace</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="https://getgas.co.ke" target="_blank" rel="noopener noreferrer">
                  Cooking gas on demand
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["Pipes & fittings","Regulators & valves","Fireplaces","Cylinders & manifolds","Safety accessories","Hoses & meters"].map((c) => (
              <div key={c} className="rounded-lg border border-border bg-background px-4 py-3 font-medium">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-steel text-steel-foreground p-10 sm:p-14">
          <div className="absolute inset-0 blueprint-grid-dark opacity-40" />
          <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Have a project on the drawing board?</h2>
              <p className="mt-3 text-white/75 max-w-xl">
                Tell us about your site — we'll come back with a scope, compliance
                checklist and a fixed-price design proposal.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Start a project <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
