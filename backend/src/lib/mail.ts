import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/config/env";

/**
 * Email delivery for verification codes.
 *
 * When SMTP_USER/SMTP_PASS are absent the transporter is never created and
 * sendVerificationCode() logs the code to the server console instead of
 * throwing. That keeps local development working without real credentials —
 * but it is a development affordance, not a silent production fallback:
 * startup warns explicitly, and the log line makes it obvious no mail left
 * the building.
 */

const isConfigured = Boolean(env.SMTP_USER && env.SMTP_PASS);

let transporter: Transporter | null = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    // 587 is STARTTLS (secure:false + upgrade), 465 is implicit TLS.
    // Getting this backwards is the single most common cause of a silent
    // SMTP hang, so derive it from the port rather than hardcoding.
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
} else {
  console.warn(
    "⚠️  SMTP_USER/SMTP_PASS not set — verification codes will be printed to " +
    "this console instead of emailed. Set them before deploying."
  );
}

function codeEmailHtml(code: string): string {
  // Deliberately plain, table-free, inline-styled markup: email clients
  // strip <style> blocks and mangle modern CSS, so anything cleverer than
  // this renders unpredictably across Gmail/Outlook/Apple Mail.
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <h1 style="font-size:20px;font-weight:700;margin:0 0 8px">trova</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 24px;color:#475569">
      Here is your verification code. It expires in 10 minutes.
    </p>
    <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;padding:20px;background:#f1f5f9;border-radius:12px;color:#059669">
      ${code}
    </div>
    <p style="font-size:13px;line-height:1.6;margin:24px 0 0;color:#64748b">
      If you didn't try to create a trova account, you can ignore this email.
    </p>
  </div>`;
}

export async function sendVerificationCode(to: string, code: string): Promise<void> {
  if (!transporter) {
    console.info(`📧 [dev] verification code for ${to}: ${code}`);
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM ?? `trova <${env.SMTP_USER}>`,
    to,
    subject: `${code} — your trova verification code`,
    // Always ship a text/plain alternative: some clients (and most spam
    // filters) treat HTML-only mail as a negative signal.
    text: `Your trova verification code is ${code}. It expires in 10 minutes.`,
    html: codeEmailHtml(code),
  });
}
