# Getgas Energen — Hosting on HostPinnacle cPanel (getgas.co.ke)

The website runs as a Node.js application behind Passenger. The database,
sign-in and file storage stay on the Getgas Cloud backend, so nothing extra
needs installing on the server.

## 1. Build the upload package

On your own computer (Node 20 or newer installed):

```bash
bash scripts/build-cpanel.sh
```

This produces `getgas-energen-cpanel.zip` containing:

```
app.js          startup file
package.json
server/         website server
client/         images, styles, scripts
.htaccess       HTTPS + security rules
.env.example    list of settings to fill in
```

## 2. Create the Node.js application in cPanel

1. Log in to cPanel → **Setup Node.js App** → **Create Application**.
2. Node.js version: **20** (or newer).
3. Application mode: **Production**.
4. Application root: `getgas-energen`.
5. Application URL: `getgas.co.ke`.
6. Application startup file: `app.js`.
7. Click **Create**.

## 3. Upload the files

1. cPanel → **File Manager** → open `getgas-energen`.
2. Upload `getgas-energen-cpanel.zip` and extract it there.
3. `app.js`, `package.json`, `server/` and `client/` must sit directly in
   `getgas-energen` (not inside an extra sub-folder).
4. Copy `.htaccess` into the document root that serves `getgas.co.ke`
   (usually `public_html`), keeping any Passenger lines cPanel already wrote.

## 4. Add the settings

In **Setup Node.js App**, open your application and add each variable listed
in `.env.example` under **Environment variables**. The values for your backend
are in the Lovable editor under Project Settings → Cloud; ask me and I will
list the exact values to paste.

Required:

- `NODE_ENV=production`
- `SITE_URL=https://getgas.co.ke`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

Email (enquiries, orders and quotes are emailed from the site):

- Create the mailbox **notifications@getgas.co.ke** in cPanel → **Email Accounts**.
- Add `SMTP_HOST=mail.getgas.co.ke`, `SMTP_PORT=465`,
  `SMTP_USER=notifications@getgas.co.ke`, `SMTP_PASSWORD=<mailbox password>`,
  `SMTP_FROM_NAME=Getgas Energen`.
- Without these the site still works; emails are simply skipped.

Optional, when ready:

- Kopokopo (M-Pesa): `KOPOKOPO_CLIENT_ID`, `KOPOKOPO_CLIENT_SECRET`,
  `KOPOKOPO_TILL_NUMBER`, `KOPOKOPO_API_KEY` — callback URL to set in the
  Kopokopo dashboard: `https://getgas.co.ke/api/public/kopokopo-webhook`.
- Emalify SMS (v2 app "getgasmsgr"): `EMALIFY_API_KEY`, `EMALIFY_PARTNER_ID`,
  `EMALIFY_SENDER_ID=GETGASKENYA` — the REST API key and Partner ID from the
  Emalify dashboard. The same values are already set in the Lovable backend.

## 5. Start it

Click **Restart** in Setup Node.js App, then open https://getgas.co.ke.

Check:

- Home, Services, Industries, Projects, Smart Metering, Safety, Insights,
  About and Contact all load.
- Sending the contact form shows a success message.
- `https://getgas.co.ke/robots.txt` loads and lists the sitemap.
- `https://getgas.co.ke/staff-login` loads but is marked "noindex".

## 6. Staff sign-in

- Staff sign-in: `https://getgas.co.ke/staff-login`
- Admin dashboard: `https://getgas.co.ke/console`

These pages are hidden from Google (robots rules, page-level noindex and an
Apache `X-Robots-Tag` header) and are not linked in the main menu.

## Updating the site later

Re-run `bash scripts/build-cpanel.sh`, upload the new `server/` and `client/`
folders (replacing the old ones), then click **Restart** in cPanel.

## Notes

- Do not run `npm run build:cpanel` inside the Lovable editor — the editor
  always builds for its own hosting. Run it on your machine or in CI.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only; never put it in a
  `VITE_` variable.
