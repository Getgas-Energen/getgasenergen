import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { listOrders, updateOrderStatus, markOrderPaid } from "@/lib/admin.functions";
import { useAccess } from "./console";

export const Route = createFileRoute("/_authenticated/console/orders")({
  head: () => ({
    meta: [
      { title: "Orders | Getgas Energen Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConsoleOrders,
});

const statuses = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const money = (v: number) => `KES ${Number(v).toLocaleString("en-KE")}`;

function ConsoleOrders() {
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);
  const queryClient = useQueryClient();

  const fetchOrders = useServerFn(listOrders);
  const setStatus = useServerFn(updateOrderStatus);
  const setPaid = useServerFn(markOrderPaid);

  const { data, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: () => fetchOrders({}) });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: (typeof statuses)[number]["value"] }) =>
      setStatus({ data: { id: vars.id, status: vars.status, notify: true } }),
    onSuccess: (result) => {
      toast.success(
        result.sms && !result.sms.delivered
          ? "Order updated — the customer SMS could not be sent."
          : "Order updated and the customer was texted.",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update"),
  });

  const paidMutation = useMutation({
    mutationFn: (id: string) => setPaid({ data: { id, reference: "manual" } }),
    onSuccess: () => {
      toast.success("Marked as paid and the customer was texted.");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update"),
  });

  const orders = data?.orders ?? [];

  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-foreground">Marketplace orders</h1>
      <p className="text-sm text-muted-foreground">
        Every stage change sends the customer an SMS automatically.
      </p>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <article key={o.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {o.order_no} · {money(o.total_kes)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {o.customer_name} · {o.phone}
                    {o.email ? ` · ${o.email}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {o.delivery_address}
                    {o.county ? `, ${o.county}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("en-KE")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={
                      o.payment_status === "paid"
                        ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        : o.payment_status === "failed"
                          ? "rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
                          : "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                    }
                  >
                    Payment: {o.payment_status}
                    {o.payment_reference ? ` · ${o.payment_reference}` : ""}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={o.status}
                        onValueChange={(v) =>
                          statusMutation.mutate({
                            id: o.id,
                            status: v as (typeof statuses)[number]["value"],
                          })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {o.payment_status !== "paid" && (
                        <Button variant="outline" size="sm" onClick={() => paidMutation.mutate(o.id)}>
                          Mark paid
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <ul className="mt-4 border-t border-border pt-3 text-sm">
                {(o.order_items ?? []).map((item, index) => (
                  <li key={`${o.id}-${index}`} className="flex justify-between py-0.5">
                    <span className="text-muted-foreground">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>{money(item.line_total_kes)}</span>
                  </li>
                ))}
              </ul>
              {o.customer_note && (
                <p className="mt-3 rounded-md bg-surface p-3 text-sm text-muted-foreground">
                  “{o.customer_note}”
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
