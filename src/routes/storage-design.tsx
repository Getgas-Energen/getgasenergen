import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/storage-design")({
  head: () => ({
    meta: [
      { title: "LPG Bulk Storage Design & Installation Kenya | Getgas Energen" },
      {
        name: "description",
        content:
          "Bulk LPG storage engineering: tank sizing, above and below ground installations, separation distances, foundations, vaporisers, filling points and statutory compliance.",
      },
      { property: "og:title", content: "LPG Bulk Storage Design | Getgas Energen" },
      {
        property: "og:description",
        content:
          "Tank sizing, siting, foundations, vaporisers, filling points and compliance for bulk LPG storage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StorageDesignPage,
});

const sizing = [
  ["Consumption profile", "Measured or estimated daily and peak-hour demand per appliance group"],
  ["Refill interval", "Tank sized so refills suit delivery logistics — typically 10 to 21 days"],
  ["Vapour off-take", "Vaporisation capacity checked against peak draw and ambient conditions"],
  ["Growth allowance", "Headroom for additional phases, kitchens or process lines"],
];

const options = [
  {
    title: "Above-ground tanks",
    body: "Lowest capital cost and simplest inspection. Requires separation distances from buildings, boundaries and ignition sources, protective bollards and a bunded, well-drained standing.",
  },
  {
    title: "Mounded or underground tanks",
    body: "Where land is tight or visual impact matters. Cathodic protection, coating integrity and inspection provisions are engineered in from the start.",
  },
  {
    title: "Cylinder manifold banks",
    body: "GOT/LOT banks with automatic changeover suit smaller loads and phased developments, with a clear upgrade path to a bulk tank later.",
  },
];

const compliance = [
  "Separation distances and site layout per Kenyan LPG regulations and EPRA requirements",
  "Reinforced foundations and tank saddles designed for full-load and seismic considerations",
  "Relief valve venting, remote shut-off and emergency isolation",
  "Tanker filling point with spill containment, bonding and safe standing",
  "Fire water, extinguisher provision and hydrant coordination",
  "Level, pressure and temperature instrumentation with optional telemetry",
];

function StorageDesignPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Engineering"
            title="Bulk LPG storage design"
            description="Storage is the heart of a reticulated system. We size, site and install tank farms and manifold banks that meet regulatory separation requirements, refill logistics and future demand."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/quote">Size my storage</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/gas-reticulation">Reticulation design</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold">How we size a tank</h2>
        <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
          {sizing.map(([label, detail]) => (
            <div key={label} className="grid gap-1 p-5 sm:grid-cols-[220px_1fr] sm:gap-6">
              <dt className="font-display font-semibold">{label}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold">Installation options</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {options.map((option) => (
              <article key={option.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold text-primary">{option.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold">Safety and compliance built in</h2>
        <ul className="mt-6 space-y-3">
          {compliance.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-8">
          <Link to="/quote">Request a storage design</Link>
        </Button>
      </section>
    </>
  );
}
