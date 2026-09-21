# Switch on email sending via notifications@getgas.co.ke

## What this does
Connects the existing email plumbing (contact enquiries, order notifications, quote emails) to the notifications@getgas.co.ke mailbox so messages actually send, instead of being silently skipped.

## Steps

1. **Save the known connection details** (no user action needed):
   - Mail server: `mail.getgas.co.ke` (standard for HostPinnacle cPanel hosting — will confirm with a test send)
   - Port: `465` (secure connection)
   - Username: `notifications@getgas.co.ke`
   - Sender name: "Getgas Energen"

2. **Request the mailbox password** through the secure secrets form — this is the only thing needed from you. It's the password for the notifications@getgas.co.ke mailbox (created in cPanel → Email Accounts). If the mailbox doesn't exist yet, create it there first.

3. **Send a test email** to getgasenergenkenya@gmail.com to confirm the connection works. If `mail.getgas.co.ke:465` fails, try port 587, then report back before changing anything else.

4. **Update the cPanel deployment notes** (`deploy/.env.example` / README) so the same SMTP values are added to the HostPinnacle Node.js app environment when the site goes live on getgas.co.ke.

## Technical notes
- No code changes to the mailer itself — it already reads `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_FROM_NAME` and defaults the sender to notifications@getgas.co.ke.
- Secrets are stored encrypted and only read server-side; the password never appears in code or the browser.
- Until the password is saved, the site keeps working exactly as it does now (messages logged, nothing breaks).

## Still pending after this (unchanged)
- Kopokopo (M-Pesa) and Emalify (SMS) credentials — orders save manually until provided.
- Marketplace prices — set anytime in the Console → Marketplace tab.
