import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, GraduationCap, Stethoscope, Hotel, Sprout, Factory, Building2, Landmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — LPG Solutions by Sector | Getgas Energen" },
      { name: "description", content: "LPG infrastructure tailored to residential, education, healthcare, hospitality, agriculture, industrial, commercial, government and defence clients." },
      { property: "og:title", content: "Industries — Getgas Energen" },
      { property: "og:description", content: "Sector-specific LPG infrastructure across East Africa." },
    ],
  }),
  component: IndustriesPage,
});

const industries = [
  { icon: Home, name: "Residential", desc: "Apartments, condominiums, mixed-use developments, estates and villas — piped gas to every kitchen.", bullets: ["Centralized bulk storage", "Per-unit smart meters", "Tenant billing portal"] },
  { icon: GraduationCap, name: "Education", desc: "Schools, universities and dormitories with commercial kitchens, science labs and hot-water systems.", bullets: ["Kitchen reticulation", "Lab gas supply", "Hot water systems"] },
  { icon: Stethoscope, name: "Healthcare", desc: "Hospitals, clinics and medical campuses requiring reliable kitchen, sterilisation and heating supply.", bullets: ["Continuous supply guarantee", "Auto-changeover", "Medical-grade safety"] },
  { icon: Hotel, name: "Hospitality", desc: "Hotels, resorts, conference centres, lodges and serviced apartments — kitchens, laundries, water heating.", bullets: ["High-demand kitchens", "Pool & spa heating", "Outdoor fireplaces"] },
  { icon: Sprout, name: "Agriculture", desc: "Poultry, hatcheries, greenhouses, dairy, milk processing, crop drying and agro processing.", bullets: ["Brooder heating", "Greenhouse climate", "Crop drying systems"] },
  { icon: Factory, name: "Industrial", desc: "Boilers, process heat, food processing, textiles, ceramics and manufacturing lines.", bullets: ["Bulk LPG plants", "Process heat systems", "Boiler conversions"] },
  { icon: Building2, name: "Commercial", desc: "Restaurants, food courts, corporate kitchens and catering facilities at scale.", bullets: ["Multi-burner kitchens", "Mall food courts", "Catering compounds"] },
  { icon: Landmark, name: "Government & Defence", desc: "Government institutions, military camps and training schools requiring secure, certified energy infrastructure.", bullets: ["Compliance documentation", "Secure storage", "Training & handover"] },
];

function IndustriesPage() {
  return (
    <>
      <section className="relative overflow-hidden text-white" style={{ background: "var(--gradient-royal)" }}>
        <div className="absolute inset-0 blueprint-grid-dark opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Industries</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            Sector-specific energy infrastructure.
          </h1>
          <p className="mt-5 text-white/80 max-w-2xl text-lg">
            Every sector has a different demand profile, safety regime and uptime requirement.
            We tailor design, metering and safety to each one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <article key={ind.name} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-primary text-accent">
                <ind.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-xl font-semibold">{ind.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-foreground">
                {ind.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Not sure where you fit?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Send us a brief description of your site and we'll match you with the right engineer.
          </p>
          <Button asChild size="lg" className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/contact">Talk to an engineer <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
