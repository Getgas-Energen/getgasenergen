import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().max(200).optional().default(""),
  email: z.string().email().max(255),
  phone: z.string().min(1).max(50),
  projectType: z.string().min(1).max(100),
  message: z.string().min(1).max(5000),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      throw new Error("Database configuration missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      project_type: data.projectType,
      message: data.message,
    });

    if (error) {
      console.error("Contact submission error:", error);
      throw new Error("Failed to submit contact form. Please try again.");
    }

    return { success: true };
  });
