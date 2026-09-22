import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicServerClient } from "./supabase-public.server";

export const NDA_VERSION = "v1-2026";

const schema = z.object({
  fullName: z.string().min(2).max(120),
  organisation: z.string().max(160).optional().default(""),
  roleTitle: z.string().max(120).optional().default(""),
  email: z.string().email().max(255),
  phone: z.string().max(40).optional().default(""),
  investorType: z.string().min(1).max(60),
  ticketBand: z.string().max(60).optional().default(""),
  interestArea: z.string().max(120).optional().default(""),
  message: z.string().max(3000).optional().default(""),
  ndaAccepted: z.literal(true),
});

export const requestDataRoomAccess = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicServerClient();

    // The anon role may insert but not read back, so the reference is minted here.
    const reference = `GIR-${new Date().toISOString().slice(2, 4)}${new Date()
      .toISOString()
      .slice(5, 7)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const { error } = await supabase
      .from("investor_leads")
      .insert({
        reference,
        full_name: data.fullName,
        organisation: data.organisation || null,
        role_title: data.roleTitle || null,
        email: data.email,
        phone: data.phone || null,
        investor_type: data.investorType,
        ticket_band: data.ticketBand || null,
        interest_area: data.interestArea || null,
        message: data.message || null,
        nda_version: NDA_VERSION,
      });

    if (error) {
      console.error("[investors] insert failed", error);
      throw new Error("We could not record your request. Please try again.");
    }

    const first = data.fullName.trim().split(/\s+/)[0] || "there";

    const { sendMail } = await import("./mailer.server");
    const { normalisePhone, sendPlainSms, TEAM_ALERT_PHONE } = await import("./sms.server");

    const safe = async (label: string, run: () => Promise<unknown>) => {
      try {
        await run();
      } catch (err) {
        console.error(`[investors] ${label} notification failed`, err);
      }
    };

    await safe("team email", () =>
      sendMail({
        subject: `Investor data room request ${reference} — ${data.organisation || data.fullName}`,
        replyTo: data.email,
        text: [
          `Reference: ${reference}`,
          `Name: ${data.fullName}${data.roleTitle ? `, ${data.roleTitle}` : ""}`,
          `Organisation: ${data.organisation || "—"}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone || "—"}`,
          `Investor type: ${data.investorType}`,
          `Ticket band: ${data.ticketBand || "—"}`,
          `Interest: ${data.interestArea || "—"}`,
          `NDA accepted: yes (${NDA_VERSION}) at ${new Date().toISOString()}`,
          "",
          data.message || "(no message)",
        ].join("\n"),
      }),
    );

    await safe("investor email", () =>
      sendMail({
        to: data.email,
        subject: `Data room request received (${reference}) — Getgas Energen`,
        text: [
          `Hello ${first},`,
          "",
          `Thank you for your interest in Getgas Energen Ltd. Your confidentiality undertaking has been recorded under reference ${reference}.`,
          "",
          "Our investor relations team will review your request and send the Executive Investment Summary and data room credentials to this email address.",
          "",
          "Getgas Energen Ltd · Tatu City, Nairobi, Kenya",
          "investors@getgas.co.ke",
        ].join("\n"),
      }),
    );

    if (data.phone) {
      await safe("investor sms", () =>
        sendPlainSms(
          normalisePhone(data.phone),
          `Hi ${first}, Getgas Energen has received your investor data room request (${reference}). Our IR team will be in touch by email.`,
          "investor_received",
        ),
      );
    }

    await safe("team sms", () =>
      sendPlainSms(
        TEAM_ALERT_PHONE(),
        `New investor data room request ${reference} received. Details in email/console.`,
        "investor_alert",
      ),
    );

    return { success: true, reference };
  });
