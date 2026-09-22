import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ShieldCheck, TrendingUp, Factory, Leaf, Lock, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestDataRoomAccess } from "@/lib/investors.functions";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investor Relations | Getgas Energen Ltd" },
      {
        name: "description",
        content:
          "Institutional investor information for Getgas Energen Ltd — Kenya's integrated clean energy and LPG infrastructure company. Series A of USD 5.5M, 2027–2032 growth plan, NDA-gated data room.",
      },
      { property: "og:title", content: "Investor Relations | Getgas Energen Ltd" },
      {
        property: "og:description",
        content:
          "Series A of USD 5.5M to scale LPG reticulation, storage and smart metering infrastructure across East Africa. Request NDA-gated data room access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestorsPage,
});

const PILLARS = [
  {
    icon: Factory,
    title: "Infrastructure that compounds",
    body: "Reticulation networks, bulk storage and smart meters are installed once and billed monthly. 68% of revenue is contracted and recurring, secured by multi-year supply agreements with developers, institutions and industry.",
  },
  {
    icon: TrendingUp,
    title: "Eight integrated verticals",
    body: "Engineering design, installation, bulk supply, cylinder distribution, smart metering, safety systems, maintenance contracts and appliance retail — one customer acquisition, eight revenue lines.",
  },
  {
    icon: Leaf,
    title: "Policy tailwind, measurable impact",
    body: "Kenya targets universal clean cooking by 2030. Every connection displaces charcoal and kerosene, producing verifiable emissions and health outcomes suited to blended and climate-linked capital.",
  },
];

const BLUEPRINT = [
  { year: "2027", revenue: "640", usd: "4.9", ebitda: "275", margin: "43%", milestone: "Series A deployed; Nairobi metro densification" },
  { year: "2028", revenue: "1,020", usd: "7.8", ebitda: "450", margin: "44%", milestone: "Coastal depot; institutional supply contracts" },
  { year: "2029", revenue: "1,580", usd: "12.1", ebitda: "710", margin: "45%", milestone: "IoT telematics at fleet scale" },
  { year: "2030", revenue: "2,310", usd: "17.8", ebitda: "1,060", margin: "46%", milestone: "Second bulk terminal commissioned" },
  { year: "2031", revenue: "3,180", usd: "24.5", ebitda: "1,490", margin: "47%", milestone: "EAC cross-border expansion" },
  { year: "2032", revenue: "4,240", usd: "32.6", ebitda: "2,040", margin: "48%", milestone: "Regional platform; exit-ready scale" },
];

const METRICS = [
  { label: "Series A raise", value: "USD 5.5M" },
  { label: "Revenue CAGR 2027–2032", value: "46%" },
  { label: "Recurring revenue", value: "68%" },
  { label: "Customer retention", value: "93%" },
  { label: "Target EBITDA margin", value: "48%" },
  { label: "Payback per connection", value: "18 months" },
];

const USE_OF_FUNDS = [
  { label: "Bulk storage & terminal capacity", share: "38%" },
  { label: "Reticulation & metering hardware", share: "27%" },
  { label: "Fleet, logistics & telematics", share: "15%" },
  { label: "Engineering talent & certification", share: "12%" },
  { label: "Working capital & compliance", share: "8%" },
];

const INVESTOR_TYPES = [
  "Development finance institution",
  "Climate / impact fund",
  "Private equity or venture fund",
  "Family office",
  "Strategic / industry investor",
  "Angel or individual",
  "Other",
] as const;

const TICKET_BANDS = [
  "Under USD 250k",
  "USD 250k – 1M",
  "USD 1M – 3M",
  "USD 3M – 5.5M",
  "Full round / lead",
] as const;

const NDA_TEXT = `By submitting this request I confirm that I am requesting access to confidential information of Getgas Energen Ltd ("the Company") for the sole purpose of evaluating a potential investment.

1. All materials received — including the Executive Investment Summary, financial models, contracts, engineering documentation and data room contents — are confidential and proprietary to the Company.
2. I will not disclose, reproduce, publish or distribute any such materials to any third party without the Company's prior written consent, except to my professional advisers bound by equivalent confidentiality obligations.
3. I will not use the materials to compete with the Company, to solicit its customers, staff or suppliers, or for any purpose other than evaluating the proposed investment.
4. This undertaking survives for three (3) years from the date of acceptance and is governed by the laws of Kenya.
5. The materials contain forward-looking statements and projections which are estimates only and are not warranties of future performance. No offer of securities is made by these materials.`;

function InvestorsPage() {
  const submit = useServerFn(requestDataRoomAccess);
  const [nda, setNda] = useState(false);
  const [showNda, setShowNda] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (form: FormData) =>
      submit({
        data: {
          fullName: String(form.get("fullName") || ""),
          organisation: String(form.get("organisation") || ""),
          roleTitle: String(form.get("roleTitle") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
          investorType: String(form.get("investorType") || "Other"),
          ticketBand: String(form.get("ticketBand") || ""),
          interestArea: String(form.get("interestArea") || ""),
          message: String(form.get("message") || ""),
          ndaAccepted: true as const,
        },
      }),
    onSuccess: (result) => {
      setReference(result.reference);
      toast.success("Request received — check your email for confirmation.");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not send your request."),
  });

  const [investorType, setInvestorType] = useState<string>(INVESTOR_TYPES[0]);
  const [ticketBand, setTicketBand] = useState<string>(TICKET_BANDS[1]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nda) {
      toast.error("Please accept the confidentiality undertaking first.");
      return;
    }
    const form = new FormData(event.currentTarget);
    form.set("investorType", investorType);
    form.set("ticketBand", ticketBand);
    mutation.mutate(form);
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-[var(--royal-deep)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--energen-cyan)]">
              Investor Relations
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              Building the clean energy infrastructure East Africa will run on
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80">
              Getgas Energen Ltd is raising a <strong>USD 5.5M Series A</strong> to scale LPG
              reticulation, bulk storage and smart metering infrastructure across Kenya and the wider
              East African Community — an asset-backed platform with contracted, recurring revenue and
              a measurable clean-cooking impact thesis.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {METRICS.slice(0, 3).map((m) => (
                <div key={m.label} className="rounded-lg border border-white/15 bg-white/5 p-4">
                  <p className="font-display text-2xl font-bold text-[var(--energen-cyan)]">
                    {m.value}
                  </p>
                  <p className="mt-1 text-xs text-white/70">{m.label}</p>
                </div>
              ))}
            </div>
            <a
              href="#data-room"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--energen-cyan)] px-5 py-3 text-sm font-semibold text-[var(--royal-deep)]"
            >
              <Lock className="h-4 w-4" /> Request data room access
            </a>
          </div>
        </section>

        {/* Investment pillars */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The thesis"
              title="Three reasons institutional capital is backing gas infrastructure in East Africa"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                  <p.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key metrics */}
        <section className="border-y border-border bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="At a glance" title="Headline investment metrics" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4"
                >
                  <span className="text-sm text-muted-foreground">{m.label}</span>
                  <span className="font-display text-lg font-bold text-primary">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blueprint */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="2027 – 2032"
              title="Five-year financial blueprint"
              description="Projections aligned to Kenya's 2030 clean cooking target and the Company's terminal and network build-out. USD converted at KES 130 = USD 1."
            />
            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Revenue (KES M)</th>
                    <th className="px-4 py-3">≈ USD M</th>
                    <th className="px-4 py-3">EBITDA (KES M)</th>
                    <th className="px-4 py-3">Margin</th>
                    <th className="px-4 py-3">Milestone</th>
                  </tr>
                </thead>
                <tbody>
                  {BLUEPRINT.map((row) => (
                    <tr key={row.year} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-foreground">{row.year}</td>
                      <td className="px-4 py-3 text-foreground">{row.revenue}</td>
                      <td className="px-4 py-3 text-muted-foreground">${row.usd}</td>
                      <td className="px-4 py-3 text-foreground">{row.ebitda}</td>
                      <td className="px-4 py-3 text-accent">{row.margin}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.milestone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Use of Series A proceeds
                </h3>
                <ul className="mt-4 space-y-3">
                  {USE_OF_FUNDS.map((u) => (
                    <li key={u.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{u.label}</span>
                        <span className="font-semibold text-foreground">{u.share}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-accent"
                          style={{ width: u.share }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <ShieldCheck className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  Governance, compliance and risk
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <li>EPRA-licensed operations with documented safety management systems.</li>
                  <li>Independent board seat and quarterly reporting offered to the lead investor.</li>
                  <li>Audited annual financials; monthly management accounts in the data room.</li>
                  <li>
                    Key risks disclosed in full: commodity price exposure, foreign exchange, regulatory
                    change, construction delivery and credit risk on institutional receivables.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* NDA-gated data room */}
        <section id="data-room" className="border-t border-border bg-surface py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Virtual data room"
              title="Request access under NDA"
              description="The Executive Investment Summary, financial model, contract register and engineering documentation are released only after a confidentiality undertaking is accepted."
            />

            {reference ? (
              <div className="mt-8 rounded-xl border border-accent/40 bg-card p-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-accent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Request recorded — reference {reference}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Your confidentiality undertaking has been logged. Our investor relations team will
                  send the Executive Investment Summary and data room credentials to the email address
                  you provided, usually within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full name *</label>
                    <Input name="fullName" required maxLength={120} className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Organisation</label>
                    <Input name="organisation" maxLength={160} className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Role / title</label>
                    <Input name="roleTitle" maxLength={120} className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Work email *</label>
                    <Input name="email" type="email" required maxLength={255} className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <Input name="phone" maxLength={40} className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Investor type *</label>
                    <Select value={investorType} onValueChange={setInvestorType}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INVESTOR_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Indicative ticket</label>
                    <Select value={ticketBand} onValueChange={setTicketBand}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_BANDS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Area of interest</label>
                    <Input
                      name="interestArea"
                      maxLength={120}
                      placeholder="e.g. storage infrastructure, carbon"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Anything you would like us to prepare?
                  </label>
                  <Textarea name="message" rows={4} maxLength={3000} className="mt-1.5" />
                </div>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <button
                    type="button"
                    onClick={() => setShowNda((v) => !v)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {showNda ? "Hide" : "Read"} the confidentiality undertaking
                  </button>
                  {showNda && (
                    <p className="mt-3 max-h-56 overflow-y-auto whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                      {NDA_TEXT}
                    </p>
                  )}
                  <div className="mt-4 flex items-start gap-3">
                    <Checkbox
                      id="nda"
                      checked={nda}
                      onCheckedChange={(v) => setNda(v === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="nda" className="text-sm leading-relaxed text-foreground">
                      I accept the confidentiality undertaking above on my own behalf and on behalf of
                      the organisation I represent. *
                    </label>
                  </div>
                </div>

                <Button type="submit" disabled={!nda || mutation.isPending} className="w-full">
                  {mutation.isPending ? "Sending…" : "Accept NDA & request access"}
                </Button>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Direct enquiries: investors@getgas.co.ke · Getgas Energen Ltd, Tatu City, Nairobi,
                  Kenya. This page contains forward-looking statements; actual results may vary and
                  nothing here constitutes an offer of securities.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
