import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BUILDING_TYPES,
  SUPPLY_TYPES,
  estimateRange,
  submitQuoteRequest,
} from "@/lib/quotes.functions";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Client Portal — Gas System Requirements & Instant Estimate | Getgas Energen" },
      {
        name: "description",
        content:
          "Building owners: describe your LPG reticulation or bulk storage requirements and receive an indicative budget range instantly, followed by a formal engineered quotation.",
      },
      { property: "og:title", content: "Get a gas system budget estimate | Getgas Energen" },
      {
        property: "og:description",
        content:
          "Submit your building's gas requirements and get an instant indicative budget from Getgas Energen engineers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotePortal,
});

const money = (v: number) => `KES ${v.toLocaleString("en-KE")}`;

function QuotePortal() {
  const submit = useServerFn(submitQuoteRequest);

  const [form, setForm] = useState({
    contactName: "",
    company: "",
    email: "",
    phone: "",
    buildingType: "Apartment block",
    units: "24",
    appliances: "",
    supplyType: "unsure" as "bulk" | "manifold" | "unsure",
    location: "",
    timeline: "",
    notes: "",
  });
  const [result, setResult] = useState<{
    reference: string;
    estimate: { low: number; high: number };
  } | null>(null);

  const units = Math.max(1, Math.min(5000, Number(form.units) || 1));
  const live = estimateRange({
    units,
    supplyType: form.supplyType,
    buildingType: form.buildingType,
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: () =>
      submit({
        data: {
          contactName: form.contactName,
          company: form.company || null,
          email: form.email,
          phone: form.phone,
          buildingType: form.buildingType,
          units,
          appliances: form.appliances || null,
          supplyType: form.supplyType,
          location: form.location,
          timeline: form.timeline || null,
          notes: form.notes || null,
        },
      }),
    onSuccess: (data) => setResult(data),
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not send your request"),
  });

  if (result) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-6 font-display text-3xl font-bold">Your indicative budget</h1>
        <p className="mt-4 font-display text-2xl font-semibold text-primary">
          {money(result.estimate.low)} – {money(result.estimate.high)}
        </p>
        <p className="mt-4 text-muted-foreground">
          Reference <strong>{result.reference}</strong>. This is a planning figure. One of our
          engineers will review your site details and send a formal quotation with drawings, a bill
          of quantities and a compliance checklist. We have also emailed and texted you this
          summary.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/projects">See comparable projects</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://wa.me/254747752600" target="_blank" rel="noopener">
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Client portal"
            title="Tell us about your building, get a budget now"
            description="Answer eight short questions. You will see an indicative budget range immediately, and our engineering team follows up with a formal quotation."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="contactName">Your name *</Label>
                <Input
                  id="contactName"
                  required
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company">Company / development</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="0712 345 678"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Building type *</Label>
                <Select value={form.buildingType} onValueChange={(v) => set("buildingType", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUILDING_TYPES.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="units">Units or gas points *</Label>
                <Input
                  id="units"
                  type="number"
                  min={1}
                  max={5000}
                  required
                  value={form.units}
                  onChange={(e) => set("units", e.target.value)}
                />
              </div>
              <div>
                <Label>Preferred supply *</Label>
                <Select
                  value={form.supplyType}
                  onValueChange={(v) => set("supplyType", v as typeof form.supplyType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLY_TYPES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Site location *</Label>
                <Input
                  id="location"
                  required
                  placeholder="e.g. Kilimani, Nairobi"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="appliances">Appliances to be served</Label>
              <Input
                id="appliances"
                placeholder="4-burner hobs, water heaters, 2 commercial ranges…"
                value={form.appliances}
                onChange={(e) => set("appliances", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="timeline">Target timeline</Label>
              <Input
                id="timeline"
                placeholder="e.g. installation in Q3, building at finishing stage"
                value={form.timeline}
                onChange={(e) => set("timeline", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="notes">Anything else we should know</Label>
              <Textarea
                id="notes"
                rows={4}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Show my estimate
            </Button>
          </form>

          <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Live indicative budget
            </p>
            <p className="mt-3 font-display text-2xl font-semibold">
              {money(live.low)} – {money(live.high)}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Based on {units} unit(s) and your selected supply arrangement. Includes storage or
              manifold, distribution pipework, isolation and metering provisions. Excludes civil
              works, imported appliances and statutory fees.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>• Engineered drawings and BoQ with the formal quote</li>
              <li>• EPRA-compliant materials and testing</li>
              <li>• Optional prepaid smart metering</li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
