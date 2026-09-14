import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicServerClient } from "./supabase-public.server";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().max(200).optional().default(""),
  email: z.string().email().max(255),
  phone: z.string().min(1).max(50),
  projectType: z.string().min(1).max(100),
  message: z.string().min(1).max(5000),
  attachmentPath: z.string().max(300).optional().nullable(),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicServerClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      project_type: data.projectType,
      message: data.message,
      attachment_path: data.attachmentPath || null,
    });

    if (error) {
      console.error("Contact submission error:", error);
      throw new Error("Failed to submit contact form. Please try again.");
    }

    return { success: true };
  });
