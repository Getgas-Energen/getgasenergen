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

    const { sendMail } = await import("./mailer.server");
    const { normalisePhone, sendPlainSms, TEAM_ALERT_PHONE } = await import("./sms.server");
    const first = data.name.trim().split(/\s+/)[0] || "there";

    // Notifications only — never echo the submitted details back over SMS.
    const safe = async (label: string, run: () => Promise<unknown>) => {
      try {
        await run();
      } catch (error) {
        console.error(`[contact] ${label} notification failed`, error);
      }
    };

    await safe("team email", () => sendMail({
      subject: `Website enquiry — ${data.projectType} (${data.name})`,
      replyTo: data.email,
      text: [
        `Name: ${data.name}${data.company ? ` (${data.company})` : ""}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Enquiry type: ${data.projectType}`,
        data.attachmentPath ? `Attachment: ${data.attachmentPath} (download from the console)` : "",
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    }));

    await safe("customer email", () =>
      sendMail({
        to: data.email,
        subject: "We have received your enquiry — Getgas Energen",
        text: [
          `Hello ${first},`,
          "",
          "Getgas Energen has received your enquiry. Our team will contact you shortly.",
          "",
          "Getgas Energen Ltd · Tatu City, Nairobi",
          "Calls 0702 947 573 · WhatsApp 0747 752 600",
        ].join("\n"),
      }),
    );

    await safe("customer sms", () =>
      sendPlainSms(
        normalisePhone(data.phone),
        `Hi ${first}, Getgas Energen has received your enquiry. Our team will contact you shortly. Calls 0702947573`,
        "enquiry_received",
      ),
    );

    await safe("team sms", () =>
      sendPlainSms(
        TEAM_ALERT_PHONE(),
        "New website enquiry received. Check notifications@getgas.co.ke or the Getgas console.",
        "enquiry_alert",
      ),
    );

    return { success: true };
  });
