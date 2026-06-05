## Getgas Energen Ltd — Website Plan

A corporate engineering site focused on **Gas Reticulation & Storage Design**, with a marketplace for gas hardware (pipes, fittings, fireplaces) and a brief link out to the cooking-gas marketplace side of the business.

### Brand & Design Direction

**Modern industrial / engineering** aesthetic:
- Palette: deep steel navy `#0F1B2D`, blueprint blue `#1E5AA8`, safety-orange accent `#F26B1F`, off-white `#F5F6F8`, graphite `#2A2F36`
- Typography: a technical display face (Space Grotesk) + clean sans body (Inter)
- Visual motifs: subtle blueprint grid backgrounds, isometric pipe/valve illustrations, technical line diagrams, measured spacing, badge-style certifications
- Tokens defined in `src/styles.css` as oklch (semantic: primary, accent, surface, muted, etc.)
- Restrained motion: section reveal on scroll, hover states on cards — no flashy animations

### Sitemap

```text
/                  Home
/services          Engineering services (reticulation, storage, design, install, maintain)
/projects          Case studies / past installations
/marketplace       Gas pipes, fittings, fireplaces, regulators (catalog)
/about             Company story, team, certifications, safety
/contact           Quote request form, location, phone
```

Each route is a separate file under `src/routes/` with its own `head()` metadata (title, description, og tags) — no hash anchors for primary nav.

### Page Contents

**Home (`/`)**
- Hero: "Engineered Gas Solutions for Homes, Estates & Industry" + dual CTA (Request a Design / View Projects)
- Services snapshot (4 cards: Reticulation Design, Bulk Storage, Installation, Maintenance)
- Why Getgas: safety, compliance (Petroleum Act 2019, EPRA), 2016-founded, Kenya + Canada
- Featured projects strip (3 thumbnails → /projects)
- Marketplace teaser (pipes, fittings, fireplaces) → /marketplace
- Brief mention + link to LPG cooking gas marketplace (external)
- CTA band → /contact

**Services (`/services`)**
- Gas Reticulation System Design (centralized piped gas to apartments/kitchens)
- LPG Bulk Storage Design (bulk tanks, cylinder manifolds GOT/LOT)
- Engineering Design & Drawings (P&ID, isometrics, compliance docs)
- Installation & Commissioning
- Inspection, Testing & Maintenance
- Each item: short description, who it's for, key safety features (auto changeover, pressure shut-off valves, leak detection)

**Projects (`/projects`)**
- Grid of case studies (residential estates, restaurants, hotels, industrial). Each card: image, scope, capacity, location. Detail can be inline modal or simple cards (no per-project route in v1).

**Marketplace (`/marketplace`)**
- Product catalog grid with categories: Pipes & Fittings, Regulators & Valves, Fireplaces, Cylinders & Manifolds, Safety Accessories
- Each product card: image, name, short spec, "Request quote" button (no checkout in v1 — leads to contact form prefilled)
- Filter by category (client-side)

**About (`/about`)**
- Story (founded 2016, Nairobi HQ, Canada presence)
- Mission: expand access to safe, affordable LPG infrastructure
- Team snapshot
- Certifications & compliance (EPRA, KEBS, Petroleum Act 2019)
- Safety commitment

**Contact (`/contact`)**
- Quote request form (name, email, phone, project type dropdown, message)
- Office address, phone, email
- Map embed (static image placeholder for v1)
- Form submits to a frontend handler (toast confirmation); no backend wired in v1

### Shared Layout

- Sticky header: logo + nav (Home, Services, Projects, Marketplace, About, Contact) + "Get a Quote" CTA
- Mobile: hamburger drawer (Sheet)
- Footer: company blurb, quick links, contact, socials, compliance line, copyright

### Technical Details

- TanStack Start routes in `src/routes/` (one file per page) — no hash navigation
- Design tokens in `src/styles.css` (oklch); shadcn components themed via tokens
- All hero/project/product imagery generated via `imagegen` and stored in `src/assets/`
- Reusable components under `src/components/` (Header, Footer, ServiceCard, ProjectCard, ProductCard, QuoteForm, SectionHeading)
- Per-route SEO via `head()`; semantic HTML, single H1 per page, alt text on all images
- No backend / Lovable Cloud in v1 — quote form is presentational. We can wire email submission later if you want.

### Out of Scope (v1)

- Real e-commerce checkout for the marketplace (lead-gen only)
- CMS for projects/products (hardcoded content; easy to swap later)
- Auth, user accounts, payments
- Live map integration

After approval I'll generate brand-appropriate imagery, build the 6 routes, and wire navigation + the quote form.
