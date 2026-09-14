import { createFileRoute } from "@tanstack/react-router";

/**
 * Public read-through for article cover images stored in the private
 * `post-media` bucket. Only serves objects referenced by published posts.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const objectPath = params._splat ?? "";
        if (!objectPath || objectPath.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const publicUrl = `/api/public/media/${objectPath}`;

        const { data: post } = await supabaseAdmin
          .from("posts")
          .select("id")
          .eq("status", "published")
          .eq("cover_url", publicUrl)
          .maybeSingle();

        let allowed = Boolean(post);

        if (!allowed) {
          const { data: project } = await supabaseAdmin
            .from("projects")
            .select("id")
            .eq("status", "published")
            .or(`cover_url.eq.${publicUrl},gallery_urls.cs.{"${publicUrl}"}`)
            .maybeSingle();
          allowed = Boolean(project);
        }

        if (!allowed) {
          return new Response("Not found", { status: 404 });
        }

        const { data, error } = await supabaseAdmin.storage.from("post-media").download(objectPath);
        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
