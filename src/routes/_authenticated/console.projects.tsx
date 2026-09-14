import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listProjectsAdmin,
  saveProject,
  deleteProject,
  type AdminProjectRow,
} from "@/lib/admin.functions";
import { PROJECT_CATEGORY_LABELS, type ProjectCategory } from "@/lib/projects.functions";
import { useAccess } from "./console";

export const Route = createFileRoute("/_authenticated/console/projects")({
  head: () => ({
    meta: [
      { title: "Projects | Getgas Energen Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConsoleProjects,
});

const CATEGORIES = Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[];

interface Draft {
  id: string | null;
  title: string;
  slug: string;
  category: ProjectCategory;
  tags: string;
  summary: string;
  body: string;
  clientName: string;
  location: string;
  sector: string;
  capacity: string;
  scope: string;
  completionDate: string;
  coverUrl: string;
  pdfPath: string;
  featured: boolean;
  sortOrder: string;
  published: boolean;
}

const emptyDraft: Draft = {
  id: null,
  title: "",
  slug: "",
  category: "reticulation",
  tags: "",
  summary: "",
  body: "",
  clientName: "",
  location: "",
  sector: "",
  capacity: "",
  scope: "",
  completionDate: "",
  coverUrl: "",
  pdfPath: "",
  featured: false,
  sortOrder: "100",
  published: false,
};

const toDraft = (row: AdminProjectRow): Draft => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  category: row.category,
  tags: (row.tags ?? []).join(", "),
  summary: row.summary ?? "",
  body: row.body ?? "",
  clientName: row.client_name ?? "",
  location: row.location ?? "",
  sector: row.sector ?? "",
  capacity: row.capacity ?? "",
  scope: row.scope ?? "",
  completionDate: row.completion_date ?? "",
  coverUrl: row.cover_url ?? "",
  pdfPath: row.pdf_path ?? "",
  featured: row.featured,
  sortOrder: String(row.sort_order),
  published: row.status === "published",
});

function ConsoleProjects() {
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);
  const queryClient = useQueryClient();

  const fetchProjects = useServerFn(listProjectsAdmin);
  const persist = useServerFn(saveProject);
  const remove = useServerFn(deleteProject);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => fetchProjects({}),
  });

  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState<"cover" | "pdf" | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));

  const saveMutation = useMutation({
    mutationFn: () => {
      const d = draft!;
      return persist({
        data: {
          id: d.id,
          title: d.title,
          slug: d.slug || null,
          category: d.category,
          tags: d.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 12),
          summary: d.summary,
          body: d.body,
          clientName: d.clientName || null,
          location: d.location || null,
          sector: d.sector || null,
          capacity: d.capacity || null,
          scope: d.scope || null,
          completionDate: d.completionDate || null,
          coverUrl: d.coverUrl || null,
          galleryUrls: [],
          pdfPath: d.pdfPath || null,
          featured: d.featured,
          sortOrder: Number(d.sortOrder) || 100,
          status: d.published ? "published" : "draft",
        },
      });
    },
    onSuccess: () => {
      toast.success("Project saved.");
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Project deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete"),
  });

  const upload = async (file: File, kind: "cover" | "pdf") => {
    setUploading(kind);
    const path = `projects/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("post-media").upload(path, file);
    setUploading(null);
    if (error) {
      toast.error("Upload failed. Please try again.");
      return;
    }
    if (kind === "cover") set("coverUrl", `/api/public/media/${path}`);
    else set("pdfPath", path);
    toast.success(kind === "cover" ? "Cover uploaded." : "PDF uploaded.");
  };

  const projects = data?.projects ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Project library</h1>
          <p className="text-sm text-muted-foreground">
            Published projects appear on the website with a downloadable data sheet — uploaded PDF if
            you add one, otherwise generated from these details.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setDraft(emptyDraft)}>
            <Plus className="mr-2 h-4 w-4" /> New project
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {p.title}
                    {p.featured && <span className="ml-2 text-xs text-accent">featured</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {PROJECT_CATEGORY_LABELS[p.category]}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.location ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.status === "published"
                          ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                          : "rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isAdmin && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setDraft(toDraft(p))}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit project" : "New project"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                saveMutation.mutate();
              }}
            >
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  value={draft.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={draft.category}
                    onValueChange={(v) => set("category", v as ProjectCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {PROJECT_CATEGORY_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={draft.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    placeholder="apartments, bulk tank, prepaid"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  rows={2}
                  value={draft.summary}
                  onChange={(e) => set("summary", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={draft.clientName}
                    onChange={(e) => set("clientName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={draft.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sector">Sector</Label>
                  <Input
                    id="sector"
                    value={draft.sector}
                    onChange={(e) => set("sector", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity / scale</Label>
                  <Input
                    id="capacity"
                    placeholder="e.g. 4,000 L bulk tank, 96 units"
                    value={draft.capacity}
                    onChange={(e) => set("capacity", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="completion">Completion date</Label>
                  <Input
                    id="completion"
                    type="date"
                    value={draft.completionDate}
                    onChange={(e) => set("completionDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sortOrder">Sort order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={draft.sortOrder}
                    onChange={(e) => set("sortOrder", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="scope">Scope of works</Label>
                <Textarea
                  id="scope"
                  rows={4}
                  value={draft.scope}
                  onChange={(e) => set("scope", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="body">Full project details</Label>
                <Textarea
                  id="body"
                  rows={8}
                  value={draft.body}
                  onChange={(e) => set("body", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Cover image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void upload(file, "cover");
                    }}
                  />
                  {draft.coverUrl && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{draft.coverUrl}</p>
                  )}
                </div>
                <div>
                  <Label>Project data sheet (PDF, optional)</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void upload(file, "pdf");
                    }}
                  />
                  {draft.pdfPath && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{draft.pdfPath}</p>
                  )}
                </div>
              </div>
              {uploading && (
                <p className="text-xs text-muted-foreground">
                  <Loader2 className="mr-1 inline h-3 w-3 animate-spin" /> Uploading…
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 border-t border-border pt-4">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={draft.featured} onCheckedChange={(v) => set("featured", v)} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={draft.published} onCheckedChange={(v) => set("published", v)} />
                  Published
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save project
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
