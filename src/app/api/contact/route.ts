import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, project_type, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.RESEND_TO_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com";

    if (!apiKey || !toEmail) {
      console.warn("Resend API not configured — logging form submission");
      console.log("Contact form:", { name, email, project_type, budget, message });
      return NextResponse.json({ success: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New commission inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFF8F6;">
          <h2 style="color: #2D1B1B; font-size: 24px; margin-bottom: 8px;">New Commission Inquiry</h2>
          <p style="color: #7A5C5C; margin-bottom: 24px; border-bottom: 1px solid #F2D4D4; padding-bottom: 24px;">
            Someone filled out your contact form.
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #B89090; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Name</td></tr>
            <tr><td style="padding-bottom: 16px; color: #2D1B1B; font-size: 16px;">${name}</td></tr>

            <tr><td style="padding: 8px 0; color: #B89090; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Email</td></tr>
            <tr><td style="padding-bottom: 16px;"><a href="mailto:${email}" style="color: #E8789A;">${email}</a></td></tr>

            ${project_type ? `
            <tr><td style="padding: 8px 0; color: #B89090; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Project Type</td></tr>
            <tr><td style="padding-bottom: 16px; color: #2D1B1B;">${project_type}</td></tr>
            ` : ""}

            ${budget ? `
            <tr><td style="padding: 8px 0; color: #B89090; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Budget</td></tr>
            <tr><td style="padding-bottom: 16px; color: #2D1B1B;">${budget}</td></tr>
            ` : ""}

            <tr><td style="padding: 8px 0; color: #B89090; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</td></tr>
            <tr><td style="padding-bottom: 16px; color: #2D1B1B; white-space: pre-wrap; background: #FFF0EC; padding: 16px; border-radius: 8px;">${message}</td></tr>
          </table>

          <p style="color: #B89090; font-size: 12px; margin-top: 24px; text-align: center;">
            Sent via your portfolio contact form
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
