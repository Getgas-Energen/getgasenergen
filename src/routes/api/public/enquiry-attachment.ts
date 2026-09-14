import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.ms-excel",
  "application/acad",
  "image/vnd.dwg",
  "application/zip",
];

/**
 * Accepts a single enquiry attachment from the public contact form and stores
 * it in the private `submissions` bucket. Returns the storage path only.
 */
export const Route = createFileRoute("/api/public/enquiry-attachment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid upload" }), { status: 400 });
        }

        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ error: "No file provided" }, { status: 400 });
        }
        if (file.size === 0 || file.size > MAX_BYTES) {
          return Response.json({ error: "File must be between 1 byte and 15 MB" }, { status: 400 });
        }
        if (file.type && !ALLOWED.includes(file.type)) {
          return Response.json({ error: "Unsupported file type" }, { status: 400 });
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "attachment";
        const objectPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.storage
          .from("submissions")
          .upload(objectPath, await file.arrayBuffer(), {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (error) {
          console.error("enquiry attachment upload", error);
          return Response.json({ error: "Upload failed" }, { status: 500 });
        }

        return Response.json({ path: objectPath });
      },
    },
  },
});
