# Notifications for contact and quote requests

Goal: whenever someone submits the contact form or the quote form, both the
customer and the Getgas team get a short notification — by email to
notifications@getgas.co.ke and by text from GETGASKENYA. The texts and the
customer email are alerts only: no form answers, no message content, no phone
or email addresses repeated in them.

## What happens today

- Contact form: saves the enquiry and emails the full details to the team inbox. No text to anyone, no acknowledgement to the customer.
- Quote form: saves the request, emails the team the details, emails the customer their estimate, and texts the customer a confirmation. The team gets no text.

## What changes

Contact form submission:
1. Customer gets a text: "Hi <first name>, Getgas Energen has received your enquiry. Our team will contact you shortly. Calls 0702 947 573".
2. Customer gets a short acknowledgement email — same wording, no copy of what they wrote.
3. Team gets the existing detailed email (unchanged, so staff can still act on it).
4. Team gets a new text alert: "New website enquiry received. Check notifications@getgas.co.ke or the console." — no customer details in the text.

Quote form submission:
1. Customer text and estimate email stay as they are today.
2. Team gets a new text alert naming only the reference: "New quote request <REF> received. Details in email/console."

Both flows stay resilient: if a text or email fails, the submission is still
saved and the visitor still sees a success message. Every text attempt is
recorded in the message log as it is now.

## Technical notes

- Team alert number: +254702947573, overridable with an optional `TEAM_ALERT_PHONE` variable; documented in `deploy/.env.example` and `deploy/README.md`.
- `src/lib/contact.functions.ts`: after insert, send the team email (existing), a customer acknowledgement email via `sendMail`, and two texts via `sendPlainSms` (customer + team) using new templates `enquiry_received` / `enquiry_alert`, all wrapped so failures only log.
- `src/lib/quotes.functions.ts`: add one `sendPlainSms` team alert (`quote_alert`) after the existing sends, also failure-tolerant.
- No database or UI changes; no new tables. Existing `sms_log` captures the new templates.
