import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { listAllPosts, savePost } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAccess } from "./console";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/console/posts/$id")({
  head: () => ({
    meta: [
      { title: "Edit article | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: PostEditor,
});

function PostEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: access } = useAccess();
  const fetchPosts = useServerFn(listAllPosts);
  const save = useServerFn(savePost);

  const { data } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => fetchPosts({}),
    enabled: !isNew,
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<"news" | "blog">("news");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (isNew || loaded || !data) return;
    const post = data.posts.find((p) => p.id === id);
    if (!post) return;
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setBody(post.body);
    setCoverUrl(post.cover_url);
    setStatus(post.status);
    setLoaded(true);
  }, [data, id, isNew, loaded]);

  const onUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("post-media")
      .upload(path, file, { contentType: file.type, upsert: false });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCoverUrl(`/api/public/media/${path}`);
    toast.success("Cover image uploaded");
  };

  const onSave = async () => {
    setBusy(true);
    try {
      const result = await save({
        data: {
          id: isNew ? null : id,
          title,
          slug: slug || null,
          category,
          excerpt,
          body,
          coverUrl,
          status,
        },
      });
      toast.success(status === "published" ? "Article published" : "Draft saved");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-post", result.slug] });
      navigate({ to: "/console/posts" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the article.");
    } finally {
      setBusy(false);
    }
  };

  if (access && !access.isAdmin) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Only administrators can edit articles.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/console/posts">Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/console/posts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>

      <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
        {isNew ? "New article" : "Edit article"}
      </h1>

      <div className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">Web address (optional)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Type</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as "news" | "blog")}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Summary</Label>
          <Textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="One or two sentences shown in the article list."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Article</Label>
          <Textarea
            id="body"
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the article here. Leave a blank line between paragraphs."
          />
        </div>

        <div className="space-y-2">
          <Label>Cover image</Label>
          <div className="flex flex-wrap items-center gap-4">
            {coverUrl && (
              <img
                src={coverUrl}
                alt="Cover preview"
                className="h-20 w-32 rounded-md border border-border object-cover"
              />
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted">
              <ImagePlus className="h-4 w-4" />
              {uploading ? "Uploading…" : coverUrl ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUpload(file);
                }}
              />
            </label>
            {coverUrl && (
              <button
                type="button"
                onClick={() => setCoverUrl(null)}
                className="text-xs text-muted-foreground underline hover:text-destructive"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            The image only becomes publicly visible once the article is published.
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
          <div className="space-y-2">
            <Label htmlFor="status">Visibility</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
              <SelectTrigger id="status" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (hidden)</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onSave} disabled={busy || uploading || title.trim().length < 3}>
            <Save className="mr-2 h-4 w-4" />
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
