import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Request a Quote | Getgas Energen Ltd" },
      { name: "description", content: "Talk to Getgas Energen about gas reticulation design, bulk storage, installation or marketplace products. Based in Nairobi, Kenya." },
      { property: "og:title", content: "Contact Getgas Energen Ltd" },
      { property: "og:description", content: "Request a quote for LPG design, installation or hardware." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    (e.target as HTMLFormElement).reset();
    toast.success("Thanks — we'll get back to you within one business day.");
  };

  return (
    <>
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading
            eyebrow="Contact"
            title="Tell us about your project."
            description="Share a few details and we'll come back with next steps — design proposal, site visit, or product quote."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Jane Mwangi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company / project</Label>
              <Input id="company" name="company" placeholder="Optional" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="+254 …" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Project type</Label>
            <Select name="type" defaultValue="feasibility">
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="feasibility">Feasibility Study</SelectItem>
                <SelectItem value="design">Engineering Design</SelectItem>
                <SelectItem value="reticulation">Gas Reticulation</SelectItem>
                <SelectItem value="storage">Bulk LPG Storage</SelectItem>
                <SelectItem value="epc">EPC (Engineering, Procurement, Construction)</SelectItem>
                <SelectItem value="metering">Smart Metering & Vending</SelectItem>
                <SelectItem value="safety">Safety Systems</SelectItem>
                <SelectItem value="om">Operations & Maintenance</SelectItem>
                <SelectItem value="marketplace">Equipment / Marketplace</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Project details</Label>
            <Textarea id="message" name="message" required rows={5} placeholder="Site location, scope, units, timeline…" />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {submitting ? "Sending…" : <>Send enquiry <Send className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-steel text-steel-foreground p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">Reach us directly</h3>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-white/10 shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/55">Office</p>
                  <p className="mt-1 text-white/90">Nairobi, Kenya</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-white/10 shrink-0">
                  <Phone className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/55">Phone</p>
                  <a href="tel:+254700000000" className="mt-1 block text-white/90 hover:text-accent">+254 700 000 000</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-white/10 shrink-0">
                  <Mail className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/55">Email</p>
                  <a href="mailto:info@getgaske.com" className="mt-1 block text-white/90 hover:text-accent">info@getgaske.com</a>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="font-display text-base font-semibold">Response time</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We reply to enquiries within one business day. Urgent? Call us
              directly — we'll route you to an on-call engineer.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
