import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import { listAllPosts, deletePost } from "@/lib/admin.functions";
import { useAccess } from "./console";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/console/posts")({
  head: () => ({
    meta: [
      { title: "Insights | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: PostsPage,
});

function PostsPage() {
  const queryClient = useQueryClient();
  const { data: access } = useAccess();
  const fetchPosts = useServerFn(listAllPosts);
  const removePost = useServerFn(deletePost);

  const { data, isLoading } = useQuery({ queryKey: ["admin-posts"], queryFn: () => fetchPosts({}) });

  const onDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await removePost({ data: { id } });
      toast.success("Article deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Insights</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            News and blog articles shown on the public Insights page.
          </p>
        </div>
        {access?.isAdmin && (
          <Button asChild>
            <Link to="/console/posts/$id" params={{ id: "new" }}>
              <Plus className="mr-2 h-4 w-4" /> New article
            </Link>
          </Button>
        )}
      </div>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}
      {data && data.posts.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No articles yet.</p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {data?.posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4 last:border-b-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {post.category}
                </span>
                <span
                  className={
                    post.status === "published"
                      ? "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary"
                      : "rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  }
                >
                  {post.status}
                </span>
              </div>
              <p className="mt-1.5 truncate font-medium text-foreground">{post.title}</p>
              <p className="text-xs text-muted-foreground">
                /insights/{post.slug} · updated {new Date(post.updated_at).toLocaleDateString("en-GB")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {post.status === "published" && (
                <Button asChild size="sm" variant="ghost">
                  <Link to="/insights/$slug" params={{ slug: post.slug }} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {access?.isAdmin && (
                <>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/console/posts/$id" params={{ id: post.id }}>
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(post.id, post.title)}
                    aria-label="Delete article"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
