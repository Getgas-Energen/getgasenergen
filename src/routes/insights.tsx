import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Newspaper, PenLine, CalendarDays } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { listPublishedPosts } from "@/lib/insights.functions";
import logoAsset from "@/assets/getgas-logo.png.asset.json";

const insightsQuery = queryOptions({
  queryKey: ["published-posts"],
  queryFn: () => listPublishedPosts(),
});

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — LPG Engineering News & Articles | Getgas Energen" },
      {
        name: "description",
        content:
          "News, project updates and technical articles on LPG reticulation, bulk storage, smart metering and gas safety across East Africa.",
      },
      { property: "og:title", content: "Insights — Getgas Energen Ltd" },
      {
        property: "og:description",
        content: "LPG engineering news, project updates and technical articles from Getgas Energen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(insightsQuery),
  component: InsightsPage,
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Insights unavailable</h1>
      <p className="mt-3 text-sm text-muted-foreground">Please try again in a moment.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Nothing here yet</h1>
    </div>
  ),
});

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function InsightsPage() {
  const { data } = useSuspenseQuery(insightsQuery);
  const [filter, setFilter] = useState<"all" | "news" | "blog">("all");

  const posts = data.posts.filter((p) => filter === "all" || p.category === filter);

  const tabs = [
    { key: "all", label: "All" },
    { key: "news", label: "News" },
    { key: "blog", label: "Blog" },
  ] as const;

  return (
    <>
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading
            eyebrow="Insights"
            title="News, projects and engineering notes."
            description="Announcements from Getgas Energen alongside practical articles on designing, metering and operating LPG infrastructure."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={
                filter === tab.key
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {data.error && <p className="mt-8 text-sm text-muted-foreground">{data.error}</p>}

        {!data.error && posts.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">
            No articles published yet — check back soon.
          </p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to="/insights/$slug"
              params={{ slug: post.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden bg-surface">
                <img
                  src={post.cover_url || logoAsset.url}
                  alt={post.title}
                  loading="lazy"
                  className={
                    post.cover_url
                      ? "h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                      : "h-full w-full object-contain p-10 opacity-70"
                  }
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  {post.category === "news" ? (
                    <Newspaper className="h-3 w-3" />
                  ) : (
                    <PenLine className="h-3 w-3" />
                  )}
                  {post.category}
                </span>
                <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(post.published_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
