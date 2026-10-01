import { createServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { z } from "zod";

import { EMAIL, STUDIO_NAME } from "@/data/site";
import { getSlotsForDate, isClosedDay } from "@/lib/booking-slots";

/**
 * Booking requests are emailed to the studio through the Gmail API (plain
 * fetch, so it runs on Cloudflare Workers). Required environment variables:
 *
 *   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
 *     OAuth client + refresh token for the sender account, scope gmail.send
 *   GMAIL_SENDER          optional, defaults to master.tech.claude@gmail.com
 *   BOOKING_NOTIFY_EMAIL  optional, defaults to the studio email in data/site
 */
const DEFAULT_SENDER = "master.tech.claude@gmail.com";

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .refine((v) => /^[+]?[0-9]{10,13}$/.test(v.replace(/[\s-]/g, "")), "Invalid phone"),
  age: z.number().int().min(18).max(100),
  style: z.string().trim().min(1).max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.string().trim().min(1).max(40),
  /** Honeypot — real users never see or fill this field. */
  company: z.string().max(0).optional(),
});

export type BookingRequest = z.input<typeof bookingSchema>;

export const sendBookingRequest = createServerFn({ method: "POST" })
  .validator(bookingSchema)
  .handler(async ({ data }) => {
    const [y, m, d] = data.date.split("-").map(Number) as [number, number, number];
    const date = new Date(y, m - 1, d);
    // Re-check the slot on the server: closed days and busy slots only. The
    // "already passed" rule depends on the visitor's clock, so it's skipped. The
    // server runs on UTC, which is never ahead of IST, so it treats at most the
    // same days as busy as the visitor saw — it never rejects a slot shown as open.
    const slot = getSlotsForDate(date, new Date(), { ignorePast: true }).find(
      (s) => s.label === data.slot,
    );
    if (isClosedDay(date) || !slot || slot.status !== "available") {
      throw new Error("That time slot is no longer available.");
    }

    await sendGmail({
      subject: `New booking: ${data.name} · ${data.style} · ${format(date, "EEE d MMM")} ${data.slot}`,
      ...bookingEmailBody({ ...data, dateLabel: format(date, "EEEE, d MMMM yyyy") }),
    });
    return { ok: true as const };
  });

const offerClaimSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: bookingSchema.shape.phone,
  offer: z.string().trim().min(1).max(80),
  idea: z.string().trim().max(600).optional(),
  /** Honeypot — real users never see or fill this field. */
  company: z.string().max(0).optional(),
});

export type OfferClaimRequest = z.input<typeof offerClaimSchema>;

/** Lead from the /offer page's "Claim your tattoo offer" popup. */
export const sendOfferClaim = createServerFn({ method: "POST" })
  .validator(offerClaimSchema)
  .handler(async ({ data }) => {
    const wa = whatsappNumber(data.phone);
    const rows: [string, string][] = [
      ["Name", data.name],
      ["Phone / WhatsApp", data.phone],
      ["Offer", data.offer],
      ["Idea", data.idea || "—"],
    ];
    const text = [
      "New tattoo offer claim from the website",
      "",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      `Call: tel:+${wa}`,
      `WhatsApp: https://wa.me/${wa}`,
    ].join("\n");
    const html = `<!doctype html><html><body style="margin:0;background:#f6f5f2;font-family:Arial,Helvetica,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border:1px solid #e5e2dc">
<tr><td style="padding:24px 24px 8px">
<p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b45309">New Offer Claim</p>
<h1 style="margin:8px 0 0;font-size:22px">${escapeHtml(data.name)}</h1>
<p style="margin:6px 0 0;font-size:14px;color:#555">${escapeHtml(data.offer)}</p>
</td></tr>
<tr><td style="padding:16px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#777;width:40%">${k}</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table></td></tr>
<tr><td style="padding:8px 24px 24px">
<a href="https://wa.me/${wa}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 18px;font-size:13px;font-weight:bold;margin:0 8px 8px 0">WhatsApp client</a>
<a href="tel:+${wa}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 18px;font-size:13px;font-weight:bold;margin:0 0 8px">Call client</a>
</td></tr>
</table>
<p style="font-size:11px;color:#999">Sent from the ${STUDIO_NAME} website offer page.</p>
</td></tr></table></body></html>`;

    await sendGmail({ subject: `Offer claim: ${data.name} · ${data.offer}`, text, html });
    return { ok: true as const };
  });

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function bookingEmailBody(b: z.output<typeof bookingSchema> & { dateLabel: string }) {
  const wa = whatsappNumber(b.phone);
  const rows: [string, string][] = [
    ["Name", b.name],
    ["Phone / WhatsApp", b.phone],
    ["Age", String(b.age)],
    ["Tattoo style", b.style],
    ["Date", b.dateLabel],
    ["Time", b.slot],
  ];

  const text = [
    "New consultation booking from the website",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Call: tel:+${wa}`,
    `WhatsApp: https://wa.me/${wa}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f6f5f2;font-family:Arial,Helvetica,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border:1px solid #e5e2dc">
<tr><td style="padding:24px 24px 8px">
<p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b45309">New Booking Request</p>
<h1 style="margin:8px 0 0;font-size:22px">${escapeHtml(b.name)} · ${escapeHtml(b.style)}</h1>
<p style="margin:6px 0 0;font-size:14px;color:#555">${escapeHtml(b.dateLabel)} · ${escapeHtml(b.slot)}</p>
</td></tr>
<tr><td style="padding:16px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#777;width:40%">${k}</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table></td></tr>
<tr><td style="padding:8px 24px 24px">
<a href="https://wa.me/${wa}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 18px;font-size:13px;font-weight:bold;margin:0 8px 8px 0">WhatsApp client</a>
<a href="tel:+${wa}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 18px;font-size:13px;font-weight:bold;margin:0 0 8px">Call client</a>
</td></tr>
</table>
<p style="font-size:11px;color:#999">Sent from the ${STUDIO_NAME} website booking form.</p>
</td></tr></table></body></html>`;

  return { text, html };
}

function base64Utf8(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64Url(s: string) {
  return base64Utf8(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** RFC 2047 encoded-word so non-ASCII subjects (·, —, names) survive; newlines stripped. */
function encodeHeader(s: string) {
  return `=?UTF-8?B?${base64Utf8(s.replace(/[\r\n]+/g, " "))}?=`;
}

let cachedToken: { value: string; expiresAt: number } | undefined;

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const clientId = process.env["GMAIL_CLIENT_ID"];
  const clientSecret = process.env["GMAIL_CLIENT_SECRET"];
  const refreshToken = process.env["GMAIL_REFRESH_TOKEN"];
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Booking email is not configured (missing GMAIL_* environment variables).");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    console.error("Gmail token refresh failed", res.status, await res.text());
    throw new Error("Could not authorise the booking email sender.");
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function sendGmail({ subject, text, html }: { subject: string; text: string; html: string }) {
  const sender = process.env["GMAIL_SENDER"] || DEFAULT_SENDER;
  const to = process.env["BOOKING_NOTIFY_EMAIL"] || EMAIL;
  const boundary = `xing-${Date.now().toString(36)}`;

  const mime = [
    `From: ${encodeHeader(`${STUDIO_NAME} Website`)} <${sender}>`,
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrap76(base64Utf8(text)),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrap76(base64Utf8(html)),
    `--${boundary}--`,
  ].join("\r\n");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      authorization: `Bearer ${await getAccessToken()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ raw: base64Url(mime) }),
  });
  if (!res.ok) {
    console.error("Gmail send failed", res.status, await res.text());
    throw new Error("The booking email could not be sent.");
  }
}

/** MIME base64 bodies must be split into lines of at most 76 characters. */
function wrap76(s: string) {
  return s.replace(/.{76}/g, "$&\r\n");
}
