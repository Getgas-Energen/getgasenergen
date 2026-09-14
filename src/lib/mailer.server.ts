/**
 * Outbound email over SMTP — server only.
 *
 * Custom integration, no third-party SDK. Fill these in to switch sending on:
 *   SMTP_HOST      e.g. mail.getgas.co.ke
 *   SMTP_PORT      465 (implicit TLS) or 587 (STARTTLS)
 *   SMTP_USER      notifications@getgas.co.ke
 *   SMTP_PASSWORD  mailbox password
 * Optional:
 *   SMTP_FROM      defaults to notifications@getgas.co.ke
 *   SMTP_FROM_NAME defaults to "Getgas Energen"
 *   NOTIFY_EMAIL   internal inbox for enquiries/orders/quotes
 *                  (defaults to getgasenergenkenya@gmail.com)
 *
 * Until the credentials exist every call is a no-op that logs instead of
 * throwing, so no visitor-facing flow can break.
 */

const DEFAULT_FROM = "notifications@getgas.co.ke";
const DEFAULT_NOTIFY = "getgasenergenkenya@gmail.com";

export function smtpConfigured(): boolean {
  return Boolean(
    process.env["SMTP_HOST"] && process.env["SMTP_USER"] && process.env["SMTP_PASSWORD"],
  );
}

export function notifyAddress(): string {
  return process.env["NOTIFY_EMAIL"] || DEFAULT_NOTIFY;
}

function fromAddress(): string {
  return process.env["SMTP_FROM"] || process.env["SMTP_USER"] || DEFAULT_FROM;
}

interface Reader {
  read(): Promise<string>;
}

/** Reads complete SMTP replies (handles multi-line 250- continuations). */
function makeReader(socket: any): Reader {
  let buffer = "";
  let resolveNext: ((value: string) => void) | null = null;
  let rejectNext: ((error: Error) => void) | null = null;

  const flush = () => {
    if (!resolveNext) return;
    const match = buffer.match(/(?:^\d{3}-[^\n]*\n)*^\d{3} [^\n]*\n/m);
    if (!match) return;
    const reply = buffer.slice(0, (match.index ?? 0) + match[0].length);
    buffer = buffer.slice(reply.length);
    const resolve = resolveNext;
    resolveNext = null;
    rejectNext = null;
    resolve(reply);
  };

  socket.setEncoding("utf8");
  socket.on("data", (chunk: string) => {
    buffer += chunk;
    flush();
  });
  socket.on("error", (error: Error) => {
    if (rejectNext) rejectNext(error);
  });

  return {
    read: () =>
      new Promise<string>((resolve, reject) => {
        resolveNext = resolve;
        rejectNext = reject;
        const timer = setTimeout(() => reject(new Error("SMTP timed out")), 20000);
        const wrapped = (value: string) => {
          clearTimeout(timer);
          resolve(value);
        };
        resolveNext = wrapped;
        flush();
      }),
  };
}

function expect(reply: string, code: string) {
  if (!reply.trimStart().startsWith(code)) {
    throw new Error(`SMTP unexpected reply: ${reply.trim().slice(0, 200)}`);
  }
}

const b64 = (value: string) => Buffer.from(value, "utf8").toString("base64");

function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 300);
}

export interface MailMessage {
  to?: string;
  subject: string;
  text: string;
  replyTo?: string | null;
}

/** Sends one plain-text email. Never throws — returns the outcome instead. */
export async function sendMail(message: MailMessage): Promise<{ sent: boolean; error: string | null }> {
  const host = process.env["SMTP_HOST"];
  const user = process.env["SMTP_USER"];
  const password = process.env["SMTP_PASSWORD"];
  const to = message.to || notifyAddress();

  if (!host || !user || !password) {
    console.warn(`[mail] SMTP not configured — skipped "${message.subject}" to ${to}`);
    return { sent: false, error: "SMTP not configured" };
  }

  const port = Number(process.env["SMTP_PORT"] || 465);
  const fromName = process.env["SMTP_FROM_NAME"] || "Getgas Energen";
  const from = fromAddress();

  let socket: any;
  try {
    const tls = await import("node:tls");
    if (port === 465) {
      socket = tls.connect({ host, port, servername: host });
      await new Promise<void>((resolve, reject) => {
        socket.once("secureConnect", () => resolve());
        socket.once("error", reject);
      });
    } else {
      const net = await import("node:net");
      socket = net.connect({ host, port });
      await new Promise<void>((resolve, reject) => {
        socket.once("connect", () => resolve());
        socket.once("error", reject);
      });
    }

    let reader = makeReader(socket);
    const send = (line: string) => socket.write(`${line}\r\n`);

    expect(await reader.read(), "220");
    send(`EHLO getgas.co.ke`);
    let greeting = await reader.read();
    expect(greeting, "250");

    if (port !== 465) {
      send("STARTTLS");
      expect(await reader.read(), "220");
      const tls = await import("node:tls");
      socket = tls.connect({ socket, host, servername: host });
      await new Promise<void>((resolve, reject) => {
        socket.once("secureConnect", () => resolve());
        socket.once("error", reject);
      });
      reader = makeReader(socket);
      send(`EHLO getgas.co.ke`);
      greeting = await reader.read();
      expect(greeting, "250");
    }

    send("AUTH LOGIN");
    expect(await reader.read(), "334");
    send(b64(user));
    expect(await reader.read(), "334");
    send(b64(password));
    expect(await reader.read(), "235");

    send(`MAIL FROM:<${from}>`);
    expect(await reader.read(), "250");
    send(`RCPT TO:<${to}>`);
    expect(await reader.read(), "250");
    send("DATA");
    expect(await reader.read(), "354");

    const headers = [
      `From: "${fromName}" <${from}>`,
      `To: <${to}>`,
      `Subject: ${headerSafe(message.subject)}`,
      ...(message.replyTo ? [`Reply-To: <${headerSafe(message.replyTo)}>`] : []),
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="utf-8"',
      "Content-Transfer-Encoding: 8bit",
    ].join("\r\n");

    const body = message.text.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
    socket.write(`${headers}\r\n\r\n${body}\r\n.\r\n`);
    expect(await reader.read(), "250");

    send("QUIT");
    socket.end();
    return { sent: true, error: null };
  } catch (error) {
    try {
      socket?.destroy?.();
    } catch {
      /* ignore */
    }
    const detail = error instanceof Error ? error.message : "send failed";
    console.error("[mail] send failed", detail);
    return { sent: false, error: detail };
  }
}
