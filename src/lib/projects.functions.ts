import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicServerClient } from "./supabase-public.server";

export type ProjectCategory =
  | "reticulation"
  | "storage"
  | "safety"
  | "metering"
  | "maintenance"
  | "other";

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  reticulation: "Gas reticulation",
  storage: "Bulk storage",
  safety: "Safety systems",
  metering: "Smart metering",
  maintenance: "Maintenance",
  other: "Other",
};

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  tags: string[];
  summary: string;
  client_name: string | null;
  location: string | null;
  sector: string | null;
  capacity: string | null;
  completion_date: string | null;
  cover_url: string | null;
  featured: boolean;
}

export interface ProjectDetail extends ProjectSummary {
  body: string;
  scope: string | null;
  gallery_urls: string[];
  pdf_path: string | null;
}

const LIST_COLUMNS =
  "id, slug, title, category, tags, summary, client_name, location, sector, capacity, completion_date, cover_url, featured";

export const listPublishedProjects = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(LIST_COLUMNS)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(120);

  if (error) {
    console.error("listPublishedProjects", error.message);
    return { projects: [] as ProjectSummary[] };
  }
  return { projects: (data ?? []) as unknown as ProjectSummary[] };
});

export const getPublishedProject = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicServerClient();
    const { data: project, error } = await supabase
      .from("projects")
      .select(`${LIST_COLUMNS}, body, scope, gallery_urls, pdf_path`)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) {
      console.error("getPublishedProject", error.message);
      return { project: null as ProjectDetail | null };
    }
    return { project: (project ?? null) as unknown as ProjectDetail | null };
  });
