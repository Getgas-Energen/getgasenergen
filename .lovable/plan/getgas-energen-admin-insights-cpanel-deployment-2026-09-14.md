# Getgas Energen — Admin, Insights & cPanel Deployment

## Goals

1. Patch the flagged security advisory in the site's building blocks.
2. Private sign-in for admins and staff, with the first admin as `admin@getgas.co.ke`.
3. A single **Insights** section (news + blog in one list, each post tagged) managed from an admin dashboard.
4. File storage so enquiry attachments and post cover images can be uploaded and reviewed.
5. Admin pages hidden from Google and other search engines.
6. A deployable package for HostPinnacle cPanel Node.js (Passenger) on `https://getgas.co.ke`.

## What you'll get

**Public side**
- `/insights` — list of published posts with News / Blog filter, cover image, date, author.
- `/insights/<post-title>` — full article with its own share/preview info.
- Insights link added to the header and footer, Getgas logo used as the fallback cover image.
- Contact form gains an optional file attachment (drawings, site photos, BOQs).

**Admin side (hidden)**
- `/staff-login` — email + password sign-in. No public sign-up; accounts are created by an admin.
- `/console` — dashboard: enquiry list with attachment downloads, and post management.
- Post editor: title, tag (News or Blog), summary, body, cover image upload, draft/publish toggle.
- User management (admins only): invite staff, change role, deactivate.
- Staff are read-only: they can view enquiries and posts but cannot publish or manage users.
- Every admin page is excluded from search engines and from the sitemap, and carries no-index instructions.

**cPanel deployment**
- A `deploy/` folder with the Passenger entry file, an `.htaccess`, a production `.env.example`, and a step-by-step README covering: setting up the Node.js app in cPanel, choosing the application root and startup file, installing packages, and restarting.
- A one-command script that produces the exact upload bundle.
- Domain and email settings pointed at `https://getgas.co.ke`.

## Technical notes

- **Advisory fix:** bump `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin` so the patched `seroval` is pulled in; verify the build and re-run the dependency scan.
- **Auth:** enable email/password sign-in on the backend (no anonymous sign-ups, no auto-confirm). Roles live in a separate `user_roles` table with an `app_role` enum (`admin`, `staff`) plus a `has_role()` security-definer function — never on the profile row. `profiles` table holds display name and avatar. `/console` sits under the `_authenticated` gate; the role check runs server-side in every admin server function, not only in the UI.
- **Tables (all with GRANTs, RLS and `updated_at` triggers):**
  - `profiles` — user_id, full_name, avatar_url
  - `user_roles` — user_id, role
  - `posts` — slug, title, category (`news` | `blog`), excerpt, body, cover_path, status (`draft` | `published`), published_at, author_id
  - `contact_submissions` — add `attachment_path`, `status`, `assigned_to`, plus staff/admin read policies
  - Public reads: only published posts, `TO anon`, selected columns.
- **Storage:** private `submissions` bucket (attachment uploads via a server function, signed URLs for staff download) and public `post-media` bucket for cover images. Policies written as migrations on `storage.objects`.
- **Crawler hygiene:** `public/robots.txt` disallowing `/console` and `/staff-login`, `noindex, nofollow` meta on those routes, and a `sitemap.xml` covering public pages only.
- **cPanel/Passenger:** production build output plus a CommonJS `app.js` shim that boots the server bundle and listens on the Passenger-provided port; server-side keys supplied through cPanel environment variables, never committed.

## Notes

- The backend (database, auth, storage) stays hosted by Lovable Cloud; the cPanel app is the website layer talking to it over HTTPS. That is what keeps the credit cost and setup minimal.
- After deployment you'll set the first admin password through a one-time reset email to `admin@getgas.co.ke`.
- Sending enquiries to `getgasenergenkenya@gmail.com` by email still needs a sender domain — once `getgas.co.ke` is live we can verify it and finish that piece.
