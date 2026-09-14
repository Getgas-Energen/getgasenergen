import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/gas-reticulation")({
  head: () => ({
    meta: [
      { title: "Gas Reticulation Design & Installation in Kenya | Getgas Energen" },
      {
        name: "description",
        content:
          "Centralised piped LPG reticulation for apartments, estates, hotels and industry: load calculation, pipe sizing, manifolds, metering, pressure testing and commissioning by Getgas Energen.",
      },
      { property: "og:title", content: "Gas Reticulation Design & Installation | Getgas Energen" },
      {
        property: "og:description",
        content:
          "Engineered piped LPG systems — load calculation, pipe sizing, metering, testing and commissioning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GasReticulationPage,
});

const stages = [
  {
    title: "1. Load assessment",
    body: "We total the connected appliance load in kW, apply diversity factors for the building type and occupancy pattern, and establish design flow in kg/h for each riser and branch.",
  },
  {
    title: "2. Route and pipe sizing",
    body: "Risers, laterals and appliance drops are sized so pressure drop stays inside allowable limits at full diversified flow, with routes chosen for ventilation, access and future expansion.",
  },
  {
    title: "3. Drawings and approvals",
    body: "Layouts, isometrics, schematics, a bill of quantities and a compliance file are issued for client, project manager and regulatory review before any material is ordered.",
  },
  {
    title: "4. Installation",
    body: "Certified fitters install copper, steel or approved multilayer pipework with correct supports, sleeves through structure, isolation valves per unit and clear labelling.",
  },
  {
    title: "5. Testing and commissioning",
    body: "Strength and tightness tests, regulator lock-up checks, appliance flame and combustion checks, then handover documents: test certificates, as-builts and a maintenance schedule.",
  },
];

const components = [
  ["Storage or manifold", "Bulk tank, or cylinder manifold banks (GOT/LOT) with automatic changeover"],
  ["First and second stage regulation", "Stage pressure reduction to service and appliance pressure"],
  ["Distribution network", "Buried and surface pipework, risers, laterals, sleeves and supports"],
  ["Isolation", "Emergency shut-off at source, riser isolation and per-unit isolation valves"],
  ["Metering", "Mechanical or prepaid smart meters for per-tenant billing and leak alerting"],
  ["Safety", "Gas detection, solenoid shut-off, ventilation and fire-system integration"],
];

function GasReticulationPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Engineering"
            title="Gas reticulation design and installation"
            description="A centralised LPG system replaces loose cylinders in every kitchen with one engineered supply, piped safely to each appliance and metered per user. We design, install, test and maintain these systems across Kenya."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/quote">Get a budget estimate</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/projects">See delivered projects</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold">How we deliver a reticulated system</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage) => (
            <article key={stage.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold text-primary">{stage.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold">What a complete system includes</h2>
          <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
            {components.map(([label, detail]) => (
              <div key={label} className="grid gap-1 p-5 sm:grid-cols-[220px_1fr] sm:gap-6">
                <dt className="font-display font-semibold">{label}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold">Ready for a design?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Send us floor plans or simply the number of units and appliances. You will get an
          indicative budget immediately and a formal engineered quotation from our team.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/quote">Start in the client portal</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/technical-specifications">Technical specifications</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
