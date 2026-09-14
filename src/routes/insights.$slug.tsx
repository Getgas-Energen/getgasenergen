import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getPublishedPost } from "@/lib/insights.functions";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["published-post", slug],
    queryFn: () => getPublishedPost({ data: { slug } }),
  });

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!result.post) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} | Getgas Energen Insights` : "Insights | Getgas Energen";
    const description = post?.excerpt || "Insights from Getgas Energen Ltd.";
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
  component: PostPage,
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Article unavailable</h1>
      <Link to="/insights" className="mt-4 inline-block text-sm font-semibold text-primary">
        Back to Insights
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Article not found</h1>
      <Link to="/insights" className="mt-4 inline-block text-sm font-semibold text-primary">
        Back to Insights
      </Link>
    </div>
  ),
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQuery(slug));
  const post = data.post!;

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <Link
        to="/insights"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All insights
      </Link>

      <p className="mt-8 inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
        {post.category}
      </p>
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold leading-tight text-foreground">
        {post.title}
      </h1>
      {post.published_at && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {new Date(post.published_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="mt-8 w-full rounded-2xl border border-border object-cover"
        />
      )}

      {post.excerpt && (
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
      )}

      <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground">
        {post.body
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
      </div>
    </article>
  );
}
