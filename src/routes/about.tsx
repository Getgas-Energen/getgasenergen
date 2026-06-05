import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Award, Globe2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Getgas Energen Ltd | Kenya LPG Engineering" },
      { name: "description", content: "Founded in 2016, Getgas Energen is a Kenyan LPG engineering company expanding safe access to gas through reticulation, storage and on-demand supply." },
      { property: "og:title", content: "About Getgas Energen Ltd" },
      { property: "og:description", content: "Kenyan LPG engineering company, founded 2016, headquartered in Nairobi with presence in Canada." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: ShieldCheck, title: "Safety", body: "Every system is built to fail safe — OPSO, UPSO, isolation and detection are non-negotiable." },
  { icon: Award, title: "Compliance", body: "Designs follow EPRA and the Petroleum (LPG) Regulations 2019 from day one." },
  { icon: Users, title: "Accountability", body: "One team owns design, install and commissioning — no finger-pointing on site." },
  { icon: Globe2, title: "Access", body: "We exist to grow safe LPG access for Kenyan homes, businesses and institutions." },
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-steel text-steel-foreground">
        <div className="absolute inset-0 blueprint-grid-dark opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">About us</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight">
              Engineering safer, smarter access to LPG.
            </h1>
            <p className="mt-5 text-white/75 max-w-2xl text-lg leading-relaxed">
              Getgas Energen was founded in 2016 with a clear mission: build the
              infrastructure that makes safe, affordable cooking gas accessible
              to more Kenyans — at home, at work, and at scale.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 lg:gap-8 border-t border-white/10 pt-6 lg:border-0 lg:pt-0">
            <div><dt className="text-xs uppercase tracking-wider text-white/55">Founded</dt><dd className="mt-1 font-display text-3xl font-bold">2016</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-white/55">HQ</dt><dd className="mt-1 font-display text-3xl font-bold">Nairobi</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-white/55">Markets</dt><dd className="mt-1 font-display text-3xl font-bold">KE · CA</dd></div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeading eyebrow="Our story" title="From aggregator to engineering partner." />
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We started as an LPG online aggregator, connecting customers to a
              countrywide network of suppliers. As demand grew, so did the
              questions we kept hearing: <em>"How do we pipe gas to every flat?"</em>,
              <em> "Can we share one bulk tank?"</em>, <em>"Is this installation safe?"</em>
            </p>
            <p>
              The engineering arm — Getgas Energen — exists to answer those
              questions properly. We design, install and maintain reticulation
              systems, bulk storage and commercial piped gas, all under one
              accountable team.
            </p>
            <p>
              Today we serve residential estates, hotels, restaurants and
              industrial sites across Kenya, with a growing presence in Canada.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h3 className="font-display text-lg font-semibold">Certifications & compliance</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              "EPRA-licensed for LPG installations",
              "Designs to Petroleum (LPG) Regulations 2019",
              "KEBS-compliant materials & cylinders",
              "Certified gas fitters on every job",
              "Public liability insured",
            ].map((c) => (
              <li key={c} className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading eyebrow="What we stand for" title="Four values, every project." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-steel text-accent">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl bg-steel text-steel-foreground p-10 sm:p-14 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Let's build something safer.</h2>
            <p className="mt-3 text-white/75 max-w-xl">Tell us about your site and we'll send back a proposal.</p>
          </div>
          <div className="flex lg:justify-end">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Contact us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
