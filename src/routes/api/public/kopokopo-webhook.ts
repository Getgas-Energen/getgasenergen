import { createFileRoute } from "@tanstack/react-router";

/**
 * Kopokopo payment result callback. Signature-verified; never returns customer data.
 */
export const Route = createFileRoute("/api/public/kopokopo-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const { verifyWebhookSignature } = await import("@/lib/kopokopo.server");

        const signature =
          request.headers.get("x-kopokopo-signature") ??
          request.headers.get("X-KopoKopo-Signature");

        if (!verifyWebhookSignature(raw, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const attributes = payload?.data?.attributes ?? {};
        const metadata = attributes?.metadata ?? {};
        const status = String(attributes?.status ?? "").toLowerCase();
        const reference =
          attributes?.event?.resource?.reference ?? attributes?.reference ?? null;
        const orderId: string | undefined = metadata?.orderId;

        if (!orderId) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id, order_no, customer_name, phone, total_kes, payment_status")
          .eq("id", orderId)
          .maybeSingle();

        if (!order) return new Response("ok");

        const succeeded = status === "received" || status === "success" || status === "succeeded";
        const nextPaymentStatus = succeeded ? "paid" : status === "failed" ? "failed" : "pending";

        if (order.payment_status === nextPaymentStatus) return new Response("ok");

        await supabaseAdmin
          .from("orders")
          .update({
            payment_status: nextPaymentStatus,
            payment_reference: reference,
            ...(succeeded ? { status: "confirmed" as const } : {}),
          })
          .eq("id", order.id);

        if (succeeded) {
          const { sendOrderSms } = await import("@/lib/sms.server");
          await sendOrderSms({
            orderId: order.id,
            phone: order.phone,
            template: "payment_received",
            ctx: {
              orderNo: order.order_no,
              customerName: order.customer_name,
              totalKes: Number(order.total_kes),
            },
          });
        }

        return new Response("ok");
      },
    },
  },
});
