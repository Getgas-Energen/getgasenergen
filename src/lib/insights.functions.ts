import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicServerClient } from "./supabase-public.server";

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  category: "news" | "blog";
  excerpt: string;
  cover_url: string | null;
  published_at: string | null;
}

export interface PostDetail extends PostSummary {
  body: string;
}

const LIST_COLUMNS = "id, slug, title, category, excerpt, cover_url, published_at";

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(60);

  if (error) {
    console.error("listPublishedPosts", error);
    return { posts: [] as PostSummary[], error: "Unable to load articles right now." };
  }

  return { posts: (data ?? []) as PostSummary[], error: null as string | null };
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicServerClient();
    const { data: post, error } = await supabase
      .from("posts")
      .select(`${LIST_COLUMNS}, body`)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) {
      console.error("getPublishedPost", error);
      return { post: null as PostDetail | null };
    }

    return { post: (post ?? null) as PostDetail | null };
  });
