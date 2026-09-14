import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, FileDown } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  listPublishedProjects,
  PROJECT_CATEGORY_LABELS,
  type ProjectCategory,
} from "@/lib/projects.functions";
import logoAsset from "@/assets/getgas-logo.png.asset.json";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — LPG Reticulation & Storage Case Studies | Getgas Energen" },
      {
        name: "description",
        content:
          "Detailed case studies of gas reticulation, bulk storage, safety and metering installations delivered by Getgas Energen across Kenya, each with a downloadable data sheet.",
      },
      { property: "og:title", content: "Projects — Getgas Energen Ltd" },
      {
        property: "og:description",
        content: "Piped LPG, bulk storage and safety projects with downloadable project data sheets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublishedProjects(),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Projects are unavailable</h1>
      <p className="mt-3 text-muted-foreground">Please refresh, or call 0702 947 573.</p>
    </div>
  ),
  notFoundComponent: () => <div className="px-4 py-24 text-center">Not found</div>,
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = Route.useLoaderData();
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [tag, setTag] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category))] as ProjectCategory[],
    [projects],
  );
  const tags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags ?? []))].sort(),
    [projects],
  );

  const visible = projects.filter(
    (p) =>
      (category === "all" || p.category === category) && (!tag || (p.tags ?? []).includes(tag)),
  );

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Projects"
            title="Engineered, installed, documented"
            description="Every project below was designed and delivered by our own engineers. Open any one for the full technical write-up and download the project data sheet."
          />

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={
                category === "all"
                  ? "rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
              }
            >
              All projects
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  category === c
                    ? "rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                    : "rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
                }
              >
                {PROJECT_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Tags</span>
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(tag === t ? null : t)}
                  className={
                    tag === t
                      ? "rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground"
                      : "rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-primary"
                  }
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {visible.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <h2 className="font-display text-xl font-semibold">No projects published yet</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Our team publishes completed installations here with full technical details and a
              downloadable data sheet. In the meantime, tell us about your site and we will send
              comparable references.
            </p>
            <Button asChild className="mt-6">
              <Link to="/quote">Get a budget estimate</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl"
              >
                <Link to="/projects/$slug" params={{ slug: p.slug }} className="aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={p.cover_url || logoAsset.url}
                    alt={p.title}
                    loading="lazy"
                    className={
                      p.cover_url
                        ? "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        : "mx-auto h-full w-1/2 object-contain p-6"
                    }
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {PROJECT_CATEGORY_LABELS[p.category]}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.location}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">
                    <Link to="/projects/$slug" params={{ slug: p.slug }}>
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                  {p.capacity && (
                    <p className="mt-4 inline-flex w-fit items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                      {p.capacity}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-4 text-sm font-semibold">
                    <Link to="/projects/$slug" params={{ slug: p.slug }} className="text-primary">
                      Full details <ArrowRight className="ml-1 inline h-4 w-4" />
                    </Link>
                    <a
                      href={`/api/public/project-pdf/${p.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <FileDown className="mr-1 inline h-4 w-4" /> PDF
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
