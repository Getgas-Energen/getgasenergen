## Plan — Logo + Brand System Update (and Phase 1 IA expansion)

The two docs supersede the earlier "industrial steel/orange" direction. Getgas Energen must look like an **engineering-grade energy infrastructure** company — purple/cyan/white, institutional, dashboard-feel. Orange/red is explicitly forbidden in the brand guide. This pass rebrands the existing site and starts the Phase 1 IA expansion from the Master Framework.

### 1. Logo

- Upload `getgas-logo_2.png` as a Lovable asset (CDN pointer in `src/assets/getgas-logo.png.asset.json`).
- Replace the `Flame` lucide icon + wordmark in `Header.tsx` and `Footer.tsx` with the real logo image (proper `alt`, responsive height, transparent PNG sits cleanly on white header / dark footer).
- Use the same logo as `og:image` fallback in `__root.tsx` head.

### 2. Brand color system (replace current tokens)

Rewrite `src/styles.css` `:root` / `.dark` tokens to the spec:

```text
Royal Purple   #2E006B → #3A0A73   (primary, steel replacement)
Energen Cyan   #25B7E6              (accent, replaces flame orange)
White          #FFFFFF
Graphite       #1F2937              (foreground / dark surfaces)
Silver Grey    #E5E7EB              (borders, muted surfaces)
```

- Convert to `oklch` and wire to `--primary`, `--accent`, `--ring`, `--steel`, `--blueprint`, `--surface`, etc. Keep semantic token names so component code doesn't churn.
- Remove the `--flame` orange entirely; rename usages (`text-accent`, `bg-accent`) keep working because `--accent` becomes cyan.
- Add a `--gradient-royal: linear-gradient(135deg, #2E006B, #3A0A73 60%, #25B7E6)` token for hero/CTA bands.
- Keep blueprint-grid utility but recolor lines with the new purple at low alpha.

### 3. Typography

- Keep Space Grotesk (display) + Inter (body) — both fit the "engineering-grade / institutional" brief. No change unless you'd prefer something else.

### 4. Imagery refresh

The current hero/project images were generated against the orange/steel palette and will clash. Regenerate the 5 in `src/assets/` with cool purple-cyan lighting (LPG tanks, manifolds, residential reticulation) so they read as one brand.

### 5. Copy + IA alignment to the Master Framework (Phase 1 only)

The docs are huge (CRM, GrowthOS, Safety Cloud, Finance, HR, IoT…). Phase 1 in the Master Framework is **Corporate Website & Lead Engine** — that's all we ship now. Concrete changes to existing routes + a few new ones:

**Home (`/`)** — rewrite to spec:
- Hero headline: "East Africa's LPG Infrastructure & Energy Engineering Company"
- Sub: "Designing, Building, Metering and Operating LPG Infrastructure for Residential, Commercial, Industrial and Institutional Clients."
- 3 CTAs: Request Feasibility Study · Talk to an Engineer · Calculate Project Cost (all → `/contact` for v1)
- Metrics strip (Projects Delivered, KM of Pipe Installed, Meters Connected, Storage Capacity, Counties Served, Years Experience) — placeholder numbers
- Service overview (8 tiles linking to /services anchors or /industries)
- Industries served (8 chips → /industries)
- Why Getgas (6 pillars)
- Featured projects (3 cards → /projects)
- AGREGAS cross-link band ("On-demand cooking gas → AGREGAS Marketplace")
- CTA band → /contact

**Services (`/services`)** — expand sections: Engineering Consulting, Design Engineering, EPC, Smart Metering, Operations & Maintenance. Each gets bullet list per the doc.

**New route `/industries`** — overview grid of 8 sectors (Residential, Education, Healthcare, Hospitality, Agriculture, Industrial, Commercial, Government/Defence). Each is a card with image + bullets; no per-industry subpages yet (deferred to later phase).

**New route `/smart-metering`** — hero "The Future of LPG Utility Management", feature grid (Prepaid, Tenant Billing, Mobile Money, Consumption Analytics, Leak Detection, Remote Shutoff, Owner Dashboard, Portfolio Mgmt), 3 dashboard mockup placeholders (Apartment / Landlord / Tenant).

**New route `/safety-systems`** — hero "Detect. Isolate. Protect. Respond.", sub-sections: Gas Leak Detection, Automatic Shut-off, Gas Control Panels, Fire Alarm Integration, ESD, Remote Monitoring, Compliance & Certifications.

**Projects (`/projects`)** — keep current grid; recategorize to Residential / Commercial / Industrial / Institutional / Agricultural / Hospitality. Add filter chips.

**Marketplace (`/marketplace`)** — keep, retitle "Equipment & Components"; add an AGREGAS callout linking to the cooking-gas marketplace (cross-project linkage from project knowledge).

**About (`/about`)** — rewrite with Vision ("Powering Africa Through Safe and Intelligent Energy Infrastructure"), Mission, Corporate Structure (Getgas Holdings PLC → Energen / Kenya / AGREGAS), Leadership placeholder, Compliance badges (EPRA, KEBS, NEMA, Petroleum Act, OPSO, UPSO, ISO roadmap).

**Contact (`/contact`)** — extend the form Project Type select with: Feasibility Study, Engineering Design, EPC, Smart Metering, Safety Systems, O&M, Other.

**Header nav** — expand to: Home · Services · Industries · Projects · Smart Metering · Safety · About · Contact. Move Marketplace into footer-only (nav is getting crowded) — or keep but collapse less-critical items into a "More" dropdown. **Decision: keep flat with 8 items; mobile drawer already handles it.**

**Footer** — add second column for Solutions (Smart Metering, Safety Systems, EPC, O&M) and an "Also from Getgas" line pointing to AGREGAS.

### 6. Cross-project linkage (per project knowledge)

- AGREGAS callout on Home + Marketplace + Footer ("On-demand cooking gas → AGREGAS").
- Note in `.lovable/plan.md`: on AGREGAS side, LPG engineering requests should route to Getgas Energen (no code change here, just documented as an internal referral channel for later).

### Explicitly out of scope (later phases)

CRM, GrowthOS, Project Management ERP, Finance, HR/Payroll, Client Portal, MediaOS, IoT/SCADA, AI calculators, auth/roles, real backend. These are Phases 2–6 in the Master Framework. The "Calculate Project Cost" CTA links to the contact form for now.

### Files touched

- `src/assets/getgas-logo.png.asset.json` (new), regenerated hero/project images
- `src/styles.css` (token rewrite)
- `src/components/Header.tsx`, `Footer.tsx` (logo + nav)
- `src/routes/__root.tsx` (og image, meta)
- `src/routes/index.tsx`, `services.tsx`, `projects.tsx`, `marketplace.tsx`, `about.tsx`, `contact.tsx` (copy/structure)
- `src/routes/industries.tsx`, `smart-metering.tsx`, `safety-systems.tsx` (new)
- `.lovable/plan.md` (updated)

Approve and I'll build it.
