import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Flame,
  Gauge,
  Wrench,
  ShieldCheck,
  CircleDot,
  Cylinder,
  ArrowRight,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/SectionHeading";
import {
  listProducts,
  placeOrder,
  getOrderPaymentStatus,
  type PublicProduct,
} from "@/lib/marketplace.functions";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Gas Pipes, Fittings & Fireplaces | Getgas Energen" },
      {
        name: "description",
        content:
          "Buy pipes, fittings, regulators, valves, fireplaces, cylinders and safety accessories. Pay by M-Pesa and we deliver across Kenya.",
      },
      { property: "og:title", content: "Marketplace — Getgas Energen" },
      {
        property: "og:description",
        content: "Quality gas hardware with M-Pesa checkout and delivery across Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Marketplace — Getgas Energen" },
      { name: "twitter:description", content: "Gas hardware with M-Pesa checkout and Kenya-wide delivery." },
    ],
  }),
  component: MarketplacePage,
});

const categories = [
  { id: "all", label: "All", icon: Gauge },
  { id: "pipes", label: "Pipes & Fittings", icon: Wrench },
  { id: "regulators", label: "Regulators & Valves", icon: CircleDot },
  { id: "fireplaces", label: "Fireplaces", icon: Flame },
  { id: "cylinders", label: "Cylinders & Manifolds", icon: Cylinder },
  { id: "safety", label: "Safety Accessories", icon: ShieldCheck },
  { id: "other", label: "Other", icon: Gauge },
] as const;

type CatId = (typeof categories)[number]["id"];

const iconFor: Record<string, typeof Gauge> = {
  pipes: Wrench,
  regulators: CircleDot,
  fireplaces: Flame,
  cylinders: Cylinder,
  safety: ShieldCheck,
  other: Gauge,
};

const money = (v: number) => `KES ${v.toLocaleString("en-KE")}`;

function MarketplacePage() {
  const fetchProducts = useServerFn(listProducts);
  const submitOrder = useServerFn(placeOrder);
  const checkPayment = useServerFn(getOrderPaymentStatus);

  const { data, isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: () => fetchProducts({}),
  });

  const products = data?.products ?? [];
  const [active, setActive] = useState<CatId>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<{
    orderId: string;
    orderNo: string;
    totalKes: number;
    paymentMessage: string;
  } | null>(null);
  const [paymentState, setPaymentState] = useState<"pending" | "paid" | "failed">("pending");

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = products.find((p) => p.id === id);
          return product ? { product, qty } : null;
        })
        .filter((l): l is { product: PublicProduct; qty: number } => l !== null),
    [cart, products],
  );

  const cartTotal = cartLines.reduce((sum, l) => sum + Number(l.product.price_kes ?? 0) * l.qty, 0);
  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0);

  const setQty = (id: string, qty: number) =>
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 500);
      return next;
    });

  const pollPayment = async (orderId: string) => {
    for (let i = 0; i < 20; i += 1) {
      await new Promise((r) => setTimeout(r, 5000));
      try {
        const result = await checkPayment({ data: { orderId } });
        if (result.paymentStatus !== "pending") {
          setPaymentState(result.paymentStatus);
          return;
        }
      } catch {
        return;
      }
    }
  };

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      const result = await submitOrder({
        data: {
          customerName: String(form.get("customerName") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? "") || null,
          deliveryAddress: String(form.get("deliveryAddress") ?? ""),
          county: String(form.get("county") ?? "") || null,
          note: String(form.get("note") ?? "") || null,
          items: cartLines.map((l) => ({ productId: l.product.id, quantity: l.qty })),
        },
      });
      setPlaced({
        orderId: result.orderId,
        orderNo: result.orderNo,
        totalKes: result.totalKes,
        paymentMessage: result.paymentMessage,
      });
      setPaymentState("pending");
      setCart({});
      if (result.paymentPrompted) void pollPayment(result.orderId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place the order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading
            eyebrow="Marketplace"
            title="Gas hardware, sourced right."
            description="Pipes, fittings, regulators, fireplaces and safety gear — pay by M-Pesa and we deliver across Kenya."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={
                    isActive
                      ? "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  }
                >
                  <c.icon className="h-4 w-4" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading the catalogue…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => {
              const Icon = iconFor[p.category] ?? Gauge;
              const price = p.price_kes === null ? null : Number(p.price_kes);
              const buyable = price !== null && price > 0 && p.in_stock;
              const inCart = cart[p.id] ?? 0;
              return (
                <article
                  key={p.id}
                  className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="relative aspect-square blueprint-grid bg-surface flex items-center justify-center">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon className="h-16 w-16 text-primary" strokeWidth={1.4} />
                    )}
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider rounded bg-card/90 px-2 py-1 font-semibold text-muted-foreground border border-border">
                      {categories.find((c) => c.id === p.category)?.label ?? "Other"}
                    </span>
                    {!p.in_stock && (
                      <span className="absolute top-3 right-3 rounded bg-graphite px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                    {p.spec && <p className="mt-1 text-sm text-muted-foreground">{p.spec}</p>}
                    <p className="mt-3 flex-1 font-display text-lg font-bold text-primary">
                      {price !== null && price > 0 ? money(price) : "Price on request"}
                    </p>

                    {buyable ? (
                      inCart > 0 ? (
                        <div className="mt-4 flex items-center justify-between rounded-md border border-border p-1">
                          <Button variant="ghost" size="icon" onClick={() => setQty(p.id, inCart - 1)} aria-label="Reduce quantity">
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-semibold">{inCart}</span>
                          <Button variant="ghost" size="icon" onClick={() => setQty(p.id, inCart + 1)} aria-label="Increase quantity">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button className="mt-4" size="sm" onClick={() => setQty(p.id, 1)}>
                          <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
                        </Button>
                      )
                    ) : (
                      <Button asChild variant="outline" size="sm" className="mt-4">
                        <Link to="/contact">Request quote</Link>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-14 rounded-2xl border border-border bg-[var(--royal-deep)] text-white p-8 sm:p-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold">Need a bulk quote or custom spec?</h3>
            <p className="mt-2 text-white/70">
              Share your BOQ and we'll get back with pricing, lead times and delivery options.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">
                Get a quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {cartCount > 0 && (
        <div className="sticky bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{cartCount}</span> item
              {cartCount === 1 ? "" : "s"} · {money(cartTotal)}
            </p>
            <Button onClick={() => setCheckoutOpen(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
          if (!open) setPlaced(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {placed ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <DialogHeader>
                <DialogTitle className="mt-3 text-center">Order {placed.orderNo}</DialogTitle>
                <DialogDescription className="text-center">
                  {money(placed.totalKes)} · {placed.paymentMessage}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm">
                {paymentState === "paid" ? (
                  <p className="font-semibold text-primary">Payment received. Thank you!</p>
                ) : paymentState === "failed" ? (
                  <p className="text-destructive">
                    The M-Pesa payment did not go through. Our team will call you shortly.
                  </p>
                ) : (
                  <p className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Waiting for your M-Pesa confirmation…
                  </p>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                We've sent you an SMS with your order number. Keep it for follow-up.
              </p>
              <Button className="mt-6 w-full" onClick={() => setCheckoutOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Checkout</DialogTitle>
                <DialogDescription>
                  Pay by M-Pesa. We deliver across Kenya and confirm every step by SMS.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-lg border border-border bg-surface p-3">
                {cartLines.map((l) => (
                  <div key={l.product.id} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                    <span className="flex-1 truncate">
                      {l.product.name} × {l.qty}
                    </span>
                    <span className="font-medium">{money(Number(l.product.price_kes) * l.qty)}</span>
                    <button
                      type="button"
                      onClick={() => setQty(l.product.id, 0)}
                      aria-label={`Remove ${l.product.name}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold">
                  <span>Total</span>
                  <span>{money(cartTotal)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Delivery is quoted separately once we confirm your location.
                </p>
              </div>

              <form onSubmit={handleCheckout} className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="customerName">Full name</Label>
                  <Input id="customerName" name="customerName" required minLength={2} maxLength={120} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">M-Pesa phone</Label>
                    <Input id="phone" name="phone" required placeholder="0712 345 678" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" name="email" type="email" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="deliveryAddress">Delivery address</Label>
                    <Input id="deliveryAddress" name="deliveryAddress" required minLength={4} />
                  </div>
                  <div>
                    <Label htmlFor="county">County / town</Label>
                    <Input id="county" name="county" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="note">Notes (optional)</Label>
                  <Textarea id="note" name="note" rows={2} maxLength={1000} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || cartLines.length === 0}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing order…
                    </>
                  ) : (
                    <>Pay {money(cartTotal)} with M-Pesa</>
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
