import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import manifoldImage from "@/assets/project-manifold.jpg";
import residentialImage from "@/assets/project-residential.jpg";
import commercialImage from "@/assets/project-commercial.jpg";
import heroImage from "@/assets/hero-storage.jpg";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — LPG Installations Across Kenya | Getgas Energen" },
      { name: "description", content: "Selected gas reticulation, bulk storage and piped LPG installations by Getgas Energen across residential, commercial and industrial sectors." },
      { property: "og:title", content: "Projects — Getgas Energen Ltd" },
      { property: "og:description", content: "Case studies of LPG reticulation and bulk storage installations." },
    ],
  }),
  component: ProjectsPage,
});

const projects = [
  {
    img: heroImage,
    type: "Bulk storage",
    title: "5,000L bulk tank & manifold",
    location: "Karen, Nairobi",
    scope: "Bulk tank installation with auto-changeover regulators and OPSO/UPSO protection for a 64-unit estate.",
    capacity: "5,000 L · 64 units",
  },
  {
    img: residentialImage,
    type: "Reticulation",
    title: "120-unit estate reticulation",
    location: "Kiambu Road",
    scope: "Centralized piped gas to all 120 apartments with individual metering and emergency isolation per riser.",
    capacity: "120 apartments",
  },
  {
    img: manifoldImage,
    type: "Manifold",
    title: "LOT cylinder manifold",
    location: "Westlands",
    scope: "47.5 kg LOT cylinder manifold with auto-changeover for a mid-rise commercial building.",
    capacity: "16 × 47.5 kg",
  },
  {
    img: commercialImage,
    type: "Commercial kitchen",
    title: "Hotel kitchen piped gas",
    location: "Mombasa",
    scope: "Piped LPG supply to 14 appliances across two commercial kitchens with leak detection and shut-off.",
    capacity: "14 appliances",
  },
  {
    img: residentialImage,
    type: "Residential",
    title: "Townhouse cluster",
    location: "Runda",
    scope: "Shared bulk tank serving 12 townhouses with individual meters and remote leak monitoring.",
    capacity: "12 units",
  },
  {
    img: heroImage,
    type: "Industrial",
    title: "Process heating retrofit",
    location: "Athi River",
    scope: "Converted a diesel-fired process line to bulk LPG with redundant supply and BMS integration.",
    capacity: "Industrial",
  },
];

const sectors = ["All", "Residential", "Commercial", "Industrial"];

function ProjectsPage() {
  return (
    <>
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading
            eyebrow="Projects"
            title="Selected installations"
            description="A snapshot of recent reticulation, bulk storage and piped gas projects we've designed and delivered."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {sectors.map((s, i) => (
              <span
                key={s}
                className={
                  i === 0
                    ? "rounded-full bg-steel px-4 py-1.5 text-xs font-semibold text-steel-foreground"
                    : "rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground"
                }
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <article key={i} className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-wider text-accent font-semibold">{p.type}</span>
                  <span className="text-xs text-muted-foreground">{p.location}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.scope}</p>
                <p className="mt-4 inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                  {p.capacity}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
