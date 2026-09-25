# Commercial Quote Engine + Editable Proformas

Build an engineering quoting system in the staff console, following the Commercial Quote Engine guide. Staff can build, revise and approve quotes. Each time a quote changes, the customer gets a text and an email.

## What staff get (console → Quotes)

1. **Quote wizard** with three quote types: Residential/Villa, Commercial Kitchen and Estate/Apartment. It shows only the fields that apply to each type.
   - Steps: Project details → Gas supply → Appliances and total demand → Pipework → Safety → Metering (Estate only) → Services → Review.
   - Commercial Kitchen and Estate quotes use a demand/diversity factor that staff can see and change.
   - Pipe sizes are marked "ENGINEERING REVIEW REQUIRED".
2. **Automatic bill of quantities (BOQ)** built from Marketplace products. Staff can search products, add, remove or change any line, and override quantities.
3. **Pricing engine** with every cost shown and editable:
   - material, consumables, labour (hours or days × rate), plant, transport, engineering (% / fixed / hours), testing, compliance, overhead, contingency (Low/Med/High risk), margin and VAT.
   - Margin is calculated as a target gross margin (price = cost ÷ (1 − margin)), not cost × 1.2.
   - VAT is always shown on its own line.
4. **Warnings** for missing prices, zero costs, old prices, margin below the minimum, and design or compliance checks. A quote with a missing price cannot be approved.
5. **Revisions and approval**: numbers like GGE-Q-2026-0001, then -R1, -R2 for revisions. Status moves through Draft → In review → Approved → Issued → Accepted/Rejected/Expired. Only admins can approve, and only approved quotes can be sent to customers.
6. **Customer proforma PDF** with a Getgas logo. It shows items, quantities, selling prices, assumptions, exclusions, payment terms, validity, VAT and total. It never shows purchase cost or margin.
7. **Portal submissions become editable**: every quote request from the website form can be opened in the wizard. Staff can change it and save it as a new revision.
8. **Change notifications**: when a quote is issued or revised, the customer gets an SMS (GETGASKENYA) and an email from notifications@getgas.co.ke. These include the reference, revision, new total and a link to the proforma. The team gets a copy. Every notification is logged.
9. **Quote dashboard cards**: pipeline value, accepted, rejected and expiring quotes, average margin, and revenue by quote type.
10. **Estate service packages** (Basic / Standard / Premium) as optional monthly items on the quote.

## Pricing data

- Marketplace products get new fields: SKU, brand, unit, purchase cost, landed cost, minimum price, default margin, VAT treatment, supplier, lead time, price valid-until date, and "can be quoted".
- **No prices will be made up.** Products without a real cost are flagged. Staff enter the real costs and rates on a new "Rates" settings page (labour, transport, VAT 16%, minimum margin, contingency by risk).

## Technical details

- New tables: suppliers, quotes, quote_revisions, quote_items, quote_assumptions, quote_settings and quote_notifications. Each table gets access grants and security rules: staff can read, admins can write and approve. The products table gets extra columns.
- Links: quotes connect to quote_requests and projects, and to jobs through the existing "Create job" action.
- The pricing maths lives in a separate plain module (`src/lib/quote-engine/`), with unit tests for the six scenarios in the guide.
- Server functions go in `quote-engine.functions.ts` and use the existing mailer, SMS and PDF helpers.
- New routes: `/console/quotes/new`, `/console/quotes/$id` (wizard/editor) and `/console/settings/rates`. Customers view proformas through a signed-token link at `/api/public/proforma/$token`.
- AGENTS.md and the docs will be updated.

## Out of scope for now
Supplier portal, purchase orders, stock reservations, invoicing and customer online acceptance. The design leaves room to add these later.
