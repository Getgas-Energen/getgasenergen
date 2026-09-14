import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/technical-specifications")({
  head: () => ({
    meta: [
      { title: "LPG Technical Specifications & Design Standards | Getgas Energen" },
      {
        name: "description",
        content:
          "Design pressures, pipe materials, testing regimes, metering, ventilation and documentation standards used by Getgas Energen on every LPG reticulation and storage installation.",
      },
      { property: "og:title", content: "LPG Technical Specifications | Getgas Energen" },
      {
        property: "og:description",
        content:
          "Materials, design pressures, testing and documentation standards for engineered LPG systems.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TechnicalSpecificationsPage,
});

const tables: { title: string; rows: [string, string][] }[] = [
  {
    title: "Pressure stages",
    rows: [
      ["Tank / manifold vapour", "Tank pressure, ambient dependent"],
      ["After first stage regulation", "Intermediate service pressure to risers"],
      ["After second stage regulation", "Appliance pressure, typically 28–37 mbar for LPG"],
      ["Design pressure drop", "Held within allowable limits at full diversified flow"],
    ],
  },
  {
    title: "Pipework materials",
    rows: [
      ["Buried service", "Sleeved steel or approved polyethylene with tracer and warning tape"],
      ["Risers and laterals", "Steel or copper to recognised standard, brazed or approved fittings"],
      ["Concealed runs", "Sleeved, ventilated and non-jointed within the sleeve"],
      ["Supports and spacing", "Fixed at standard intervals with expansion allowance"],
    ],
  },
  {
    title: "Testing and commissioning",
    rows: [
      ["Strength test", "Pneumatic or hydrostatic test above design pressure, held and recorded"],
      ["Tightness test", "Pressure hold with no permissible drop over the recorded period"],
      ["Regulator checks", "Lock-up and working pressure verified at each stage"],
      ["Appliance checks", "Flame quality, ventilation adequacy and combustion verification"],
    ],
  },
  {
    title: "Metering and control",
    rows: [
      ["Per-unit metering", "Mechanical or prepaid smart meters with tamper detection"],
      ["Billing integration", "Tenant top-ups by M-Pesa, dashboards for landlords"],
      ["Detection", "Fixed detectors at LEL thresholds with solenoid shut-off"],
      ["Emergency stop", "Manual call points at exits and the storage compound"],
    ],
  },
];

const documents = [
  "Design basis and load calculation sheet",
  "Layout drawings, isometrics and schematics",
  "Bill of quantities and material data sheets",
  "Pressure test and commissioning certificates",
  "As-built drawings and asset register",
  "Operations, maintenance and emergency procedures",
];

function TechnicalSpecificationsPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Engineering"
            title="Technical specifications"
            description="The standards we design and build to. Share this page with your project manager, architect or QS — full project-specific specifications are issued with every quotation."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {tables.map((table) => (
            <div key={table.title} className="overflow-hidden rounded-xl border border-border bg-card">
              <h2 className="border-b border-border bg-surface px-5 py-3 font-display font-semibold">
                {table.title}
              </h2>
              <dl className="divide-y divide-border">
                {table.rows.map(([label, value]) => (
                  <div key={label} className="px-5 py-4">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface p-8">
          <h2 className="font-display text-xl font-semibold">Documentation you receive</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {documents.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/quote">Request project specifications</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/projects">Download project data sheets</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
