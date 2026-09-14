import { createFileRoute } from "@tanstack/react-router";

/**
 * Project data sheet download. Serves the PDF an administrator uploaded when
 * one exists, otherwise generates a branded sheet from the project details.
 */
export const Route = createFileRoute("/api/public/project-pdf/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = (params.slug ?? "").replace(/[^a-z0-9-]/gi, "");
        if (!slug) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: project } = await supabaseAdmin
          .from("projects")
          .select(
            "title, category, tags, summary, body, client_name, location, sector, capacity, scope, completion_date, pdf_path",
          )
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (!project) return new Response("Not found", { status: 404 });

        if (project.pdf_path) {
          const { data: file } = await supabaseAdmin.storage
            .from("post-media")
            .download(project.pdf_path);
          if (file) {
            return new Response(await file.arrayBuffer(), {
              headers: {
                "content-type": "application/pdf",
                "content-disposition": `inline; filename="${slug}.pdf"`,
                "cache-control": "public, max-age=1800",
              },
            });
          }
        }

        const { renderPdf } = await import("@/lib/pdf.server");
        const field = (label: string, value: string | null) =>
          value ? [{ text: label, style: "label" as const }, { text: value }] : [];

        const bytes = renderPdf([
          { text: "GETGAS ENERGEN LTD", style: "label" },
          { text: project.title, style: "title" },
          { text: project.summary || "", style: "body" },
          { text: "Project data", style: "heading" },
          ...field("Client", project.client_name),
          ...field("Location", project.location),
          ...field("Sector", project.sector),
          ...field("Capacity", project.capacity),
          ...field("Category", project.category),
          ...field("Tags", (project.tags ?? []).join(", ") || null),
          ...field("Completed", project.completion_date),
          ...(project.scope
            ? [{ text: "Scope of works", style: "heading" as const }, { text: project.scope }]
            : []),
          ...(project.body
            ? [{ text: "Project details", style: "heading" as const }, { text: project.body }]
            : []),
          { text: "Contact", style: "heading" },
          {
            text: "Getgas Energen Ltd, Tatu City, Nairobi, Kenya. Calls 0702 947 573. WhatsApp 0747 752 600. notifications@getgas.co.ke",
          },
        ]);

        return new Response(bytes, {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": `inline; filename="${slug}.pdf"`,
            "cache-control": "public, max-age=900",
          },
        });
      },
    },
  },
});
