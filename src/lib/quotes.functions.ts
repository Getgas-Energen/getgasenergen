import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Client portal: a building owner describes their gas system and immediately
 * receives a budget range. The team then confirms with a formal quote.
 */

export const BUILDING_TYPES = [
  "Apartment block",
  "Gated estate / townhouses",
  "Single home",
  "Hotel or lodge",
  "Restaurant / commercial kitchen",
  "School or institution",
  "Hospital",
  "Factory / industrial process",
  "Other",
] as const;

export const SUPPLY_TYPES = [
  { value: "bulk", label: "Bulk storage tank" },
  { value: "manifold", label: "Cylinder manifold (GOT/LOT)" },
  { value: "unsure", label: "Not sure — advise me" },
] as const;

const quoteInput = z.object({
  contactName: z.string().min(2).max(120),
  company: z.string().max(160).optional().nullable(),
  email: z.string().email().max(255),
  phone: z.string().min(9).max(20),
  buildingType: z.string().min(2).max(80),
  units: z.number().int().min(1).max(5000),
  appliances: z.string().max(400).optional().nullable(),
  supplyType: z.enum(["bulk", "manifold", "unsure"]),
  location: z.string().min(2).max(200),
  timeline: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

const round = (value: number) => Math.round(value / 5000) * 5000;

/** Transparent budget model — storage/manifold base plus per-unit reticulation. */
export function estimateRange(input: { units: number; supplyType: string; buildingType: string }) {
  const storageLow = input.supplyType === "manifold" ? 185000 : 780000;
  const storageHigh = input.supplyType === "manifold" ? 340000 : 1350000;

  const perUnitLow = input.units > 60 ? 42000 : 52000;
  const perUnitHigh = input.units > 60 ? 64000 : 82000;

  const commercial = /hotel|restaurant|kitchen|hospital|factory|industrial/i.test(input.buildingType);
  const commercialUplift = commercial ? 1.25 : 1;

  return {
    low: round((storageLow + input.units * perUnitLow) * commercialUplift),
    high: round((storageHigh + input.units * perUnitHigh) * commercialUplift),
  };
}

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data) => quoteInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { normalisePhone, sendPlainSms, TEAM_ALERT_PHONE } = await import("./sms.server");
    const { sendMail } = await import("./mailer.server");

    const estimate = estimateRange(data);
    const phone = normalisePhone(data.phone);

    const { data: row, error } = await supabaseAdmin
      .from("quote_requests")
      .insert({
        contact_name: data.contactName,
        company: data.company || null,
        email: data.email,
        phone,
        building_type: data.buildingType,
        units: data.units,
        appliances: data.appliances || null,
        supply_type: data.supplyType,
        location: data.location,
        timeline: data.timeline || null,
        notes: data.notes || null,
        estimate_low_kes: estimate.low,
        estimate_high_kes: estimate.high,
      })
      .select("id, reference")
      .single();

    if (error || !row) {
      console.error("[quotes] insert failed", error?.message);
      throw new Error("We could not save your request. Please try again or call 0702947573.");
    }

    const money = (v: number) => `KES ${v.toLocaleString("en-KE")}`;

    await sendMail({
      subject: `New quote request ${row.reference} — ${data.buildingType}, ${data.location}`,
      replyTo: data.email,
      text: [
        `Reference: ${row.reference}`,
        `Name: ${data.contactName}${data.company ? ` (${data.company})` : ""}`,
        `Email: ${data.email}`,
        `Phone: ${phone}`,
        "",
        `Building type: ${data.buildingType}`,
        `Units / points: ${data.units}`,
        `Supply preference: ${data.supplyType}`,
        `Appliances: ${data.appliances || "-"}`,
        `Location: ${data.location}`,
        `Timeline: ${data.timeline || "-"}`,
        "",
        `Indicative budget shown to client: ${money(estimate.low)} – ${money(estimate.high)}`,
        "",
        `Notes: ${data.notes || "-"}`,
      ].join("\n"),
    });

    await sendMail({
      to: data.email,
      subject: `Your Getgas Energen budget estimate (${row.reference})`,
      text: [
        `Hello ${data.contactName},`,
        "",
        `Thank you for your gas system requirements. Based on what you shared (${data.buildingType}, ${data.units} unit(s), ${data.location}), the indicative budget range is:`,
        "",
        `    ${money(estimate.low)} – ${money(estimate.high)}`,
        "",
        "This is a planning figure only. Our engineers will review your site details and confirm a formal quotation, including drawings and a compliance checklist.",
        "",
        `Your reference: ${row.reference}`,
        "",
        "Getgas Energen Ltd · Tatu City, Nairobi",
        "Calls 0702 947 573 · WhatsApp 0747 752 600",
      ].join("\n"),
    });

    await sendPlainSms(
      phone,
      `Hi ${data.contactName.split(/\s+/)[0]}, Getgas Energen received your gas system request ${row.reference}. Indicative budget ${money(estimate.low)}-${money(estimate.high)}. Our engineer will call you. 0702947573`,
      "quote_received",
    );

    // Team alert — reference only, no customer details over SMS.
    try {
      await sendPlainSms(
        TEAM_ALERT_PHONE(),
        `New quote request ${row.reference} received. Details in email/console.`,
        "quote_alert",
      );
    } catch (error) {
      console.error("[quotes] team alert failed", error);
    }

    return { reference: row.reference, estimate };
  });
