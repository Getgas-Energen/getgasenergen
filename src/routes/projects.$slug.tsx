import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublishedProject, PROJECT_CATEGORY_LABELS } from "@/lib/projects.functions";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const { project } = await getPublishedProject({ data: { slug: params.slug } });
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    const title = project ? `${project.title} | Getgas Energen Projects` : "Project | Getgas Energen";
    const description =
      project?.summary?.slice(0, 155) ||
      "LPG reticulation and bulk storage project delivered by Getgas Energen Ltd.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">This project could not be loaded</h1>
      <Button asChild className="mt-6">
        <Link to="/projects">Back to projects</Link>
      </Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Project not found</h1>
      <Button asChild className="mt-6">
        <Link to="/projects">Back to projects</Link>
      </Button>
    </div>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project } = Route.useLoaderData();

  const facts = [
    ["Client", project.client_name],
    ["Location", project.location],
    ["Sector", project.sector],
    ["Capacity", project.capacity],
    ["Category", PROJECT_CATEGORY_LABELS[project.category]],
    ["Completed", project.completion_date],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <article className="pb-24">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-1 h-4 w-4" /> All projects
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {PROJECT_CATEGORY_LABELS[project.category]}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{project.title}</h1>
          {project.summary && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{project.summary}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            {(project.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs">
                #{tag}
              </span>
            ))}
          </div>
          <Button asChild className="mt-8">
            <a href={`/api/public/project-pdf/${project.slug}`} target="_blank" rel="noopener">
              <FileDown className="mr-2 h-4 w-4" /> Download project data sheet (PDF)
            </a>
          </Button>
        </div>
      </div>

      {project.cover_url && (
        <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
          <img
            src={project.cover_url}
            alt={project.title}
            className="w-full rounded-xl border border-border object-cover"
          />
        </div>
      )}

      <div className="mx-auto mt-12 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
        <div>
          {project.scope && (
            <section>
              <h2 className="font-display text-xl font-semibold">Scope of works</h2>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {project.scope}
              </p>
            </section>
          )}

          {project.body && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Project details</h2>
              <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
                {project.body.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {(project.gallery_urls ?? []).length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Gallery</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.gallery_urls.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt={project.title}
                    loading="lazy"
                    className="rounded-lg border border-border object-cover"
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {facts.length > 0 && (
            <dl className="rounded-xl border border-border bg-card p-6 text-sm">
              {facts.map(([label, value]) => (
                <div key={label} className="border-b border-border py-2 last:border-0">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="font-display font-semibold">Planning something similar?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit your building requirements and get an indicative budget in seconds.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link to="/quote">Get a budget estimate</Link>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
