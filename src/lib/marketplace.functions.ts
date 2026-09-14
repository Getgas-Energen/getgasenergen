import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicServerClient } from "./supabase-public.server";

export type ProductCategory =
  | "pipes"
  | "regulators"
  | "fireplaces"
  | "cylinders"
  | "safety"
  | "other";

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  spec: string | null;
  description: string | null;
  price_kes: number | null;
  image_url: string | null;
  in_stock: boolean;
}

/* --------------------------------------------------------------- catalogue */

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, category, spec, description, price_kes, image_url, in_stock")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(300);

  if (error) {
    console.error("[marketplace] listProducts failed", error.message);
    return { products: [] as PublicProduct[] };
  }
  return { products: (data ?? []) as unknown as PublicProduct[] };
});

/* ---------------------------------------------------------------- checkout */

const checkoutInput = z.object({
  customerName: z.string().min(2).max(120),
  phone: z.string().min(9).max(20),
  email: z.string().email().max(255).optional().nullable(),
  deliveryAddress: z.string().min(4).max(400),
  county: z.string().max(80).optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(500) }))
    .min(1)
    .max(40),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => checkoutInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { normalisePhone, sendOrderSms } = await import("./sms.server");
    const { kopokopoConfigured, requestStkPush } = await import("./kopokopo.server");

    // Prices always come from the database, never from the browser.
    const ids = [...new Set(data.items.map((i) => i.productId))];
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id, name, price_kes, is_active, in_stock")
      .in("id", ids);
    if (error) throw new Error("Could not load the selected products.");

    const priced = (rows ?? []).filter(
      (r) => r.is_active && r.in_stock && r.price_kes !== null && Number(r.price_kes) > 0,
    );
    if (priced.length === 0) throw new Error("None of the selected items are available to order.");

    const byId = new Map(priced.map((r) => [r.id, r]));
    const lines = data.items
      .filter((i) => byId.has(i.productId))
      .map((i) => {
        const product = byId.get(i.productId)!;
        const unit = Number(product.price_kes);
        return {
          product_id: product.id,
          product_name: product.name,
          unit_price_kes: unit,
          quantity: i.quantity,
          line_total_kes: unit * i.quantity,
        };
      });

    const itemsTotal = lines.reduce((sum, l) => sum + l.line_total_kes, 0);
    const phone = normalisePhone(data.phone);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customerName,
        phone,
        email: data.email || null,
        delivery_address: data.deliveryAddress,
        county: data.county || null,
        customer_note: data.note || null,
        items_total_kes: itemsTotal,
        delivery_fee_kes: 0,
        total_kes: itemsTotal,
      })
      .select("id, order_no, total_kes")
      .single();

    if (orderError || !order) throw new Error("Could not create the order. Please try again.");

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: order.id })));
    if (itemsError) console.error("[marketplace] order items insert failed", itemsError.message);

    // Trigger the M-Pesa prompt through Kopokopo when it is configured.
    let paymentPrompted = false;
    let paymentMessage = "M-Pesa payment is not switched on yet — our team will call you to arrange payment.";
    if (kopokopoConfigured()) {
      try {
        const parts = data.customerName.trim().split(/\s+/);
        const push = await requestStkPush({
          orderNo: order.order_no,
          orderId: order.id,
          phone,
          amountKes: Number(order.total_kes),
          firstName: parts[0] ?? data.customerName,
          lastName: parts.slice(1).join(" ") || parts[0] || "Customer",
          email: data.email || null,
        });
        paymentPrompted = true;
        paymentMessage = "Check your phone and enter your M-Pesa PIN to complete payment.";
        await supabaseAdmin
          .from("orders")
          .update({ provider_request_id: push.location || null })
          .eq("id", order.id);
      } catch (pushError) {
        console.error("[marketplace] STK push failed", pushError);
        paymentMessage =
          "We could not start the M-Pesa prompt. Your order is saved and our team will call you.";
      }
    }

    await sendOrderSms({
      orderId: order.id,
      phone,
      template: "order_received",
      ctx: {
        orderNo: order.order_no,
        customerName: data.customerName,
        totalKes: Number(order.total_kes),
      },
    });

    return {
      orderId: order.id,
      orderNo: order.order_no,
      totalKes: Number(order.total_kes),
      paymentPrompted,
      paymentMessage,
    };
  });

/** Lets the checkout screen poll whether the M-Pesa payment landed. */
export const getOrderPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("order_no, payment_status, total_kes")
      .eq("id", data.orderId)
      .maybeSingle();

    if (!order) throw new Error("Order not found.");
    return {
      orderNo: order.order_no,
      paymentStatus: order.payment_status as "pending" | "paid" | "failed",
      totalKes: Number(order.total_kes),
    };
  });
