import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendAuditConfirmationEmail(email: string, auditUrl: string, savings: number) {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return;
  }

  const { data, error } = await resend.emails.send({
    from: "SpendWise AI <audits@credex.rocks>",
    to: [email],
    subject: "Your AI Spend Audit Results",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h1 style="color: #10b981;">Your Audit is Ready!</h1>
        <p>Thanks for using SpendWise AI. We've identified <strong>$${savings.toFixed(2)}/month</strong> in potential savings for your team.</p>
        <div style="margin: 32px 0;">
          <a href="${auditUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold;">View Full Audit Results</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #64748b; font-size: 14px;">${auditUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">SpendWise AI by Credex · Helping startups optimize their AI stack.</p>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
}
