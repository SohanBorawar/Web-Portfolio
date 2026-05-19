import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  datetime?: string;
  message?: string;
};

const adminEmail = process.env.ADMIN_EMAIL || "sohankumawat2829@gmail.com";

function renderEmail(payload: ContactPayload) {
  return [
    `Type: ${payload.type || "Portfolio Contact"}`,
    `Name: ${payload.name || ""}`,
    `Email: ${payload.email || ""}`,
    `Phone: ${payload.phone || ""}`,
    payload.datetime ? `Preferred Date & Time: ${payload.datetime}` : "",
    payload.message ? `Message: ${payload.message}` : ""
  ].filter(Boolean).join("\n");
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  if (!payload.name || !payload.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "Email provider is not configured. Falling back to mail client." },
      { status: 501 }
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [adminEmail],
      reply_to: payload.email,
      subject: `${payload.type || "Portfolio Contact"} from ${payload.name}`,
      text: renderEmail(payload)
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Unable to send email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
