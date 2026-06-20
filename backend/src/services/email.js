import nodemailer from 'nodemailer';

// Detects which provider is configured and uses it automatically.
// Priority: Resend > SendGrid > Brevo > Gmail > Ethereal (dev fallback)

let transporter = null;
let providerName = 'Ethereal (dev)';

async function buildTransporter() {
  const e = process.env;

  // ── Resend ───────────────────────────────────────────────────────────────
  if (e.RESEND_API_KEY) {
    providerName = 'Resend';
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: { user: 'resend', pass: e.RESEND_API_KEY },
    });
  }

  // ── SendGrid ─────────────────────────────────────────────────────────────
  if (e.SENDGRID_API_KEY) {
    providerName = 'SendGrid';
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: { user: 'apikey', pass: e.SENDGRID_API_KEY },
    });
  }

  // ── Brevo (formerly Sendinblue) ──────────────────────────────────────────
  if (e.BREVO_API_KEY) {
    providerName = 'Brevo';
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: { user: e.BREVO_USER || e.SMTP_USER, pass: e.BREVO_API_KEY },
    });
  }

  // ── Gmail ────────────────────────────────────────────────────────────────
  if (e.GMAIL_USER && e.GMAIL_APP_PASSWORD) {
    providerName = 'Gmail';
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: e.GMAIL_USER, pass: e.GMAIL_APP_PASSWORD },
    });
  }

  // ── Generic SMTP (fallback for any custom host) ──────────────────────────
  if (e.SMTP_HOST && e.SMTP_USER && e.SMTP_PASS) {
    providerName = `SMTP (${e.SMTP_HOST})`;
    return nodemailer.createTransport({
      host: e.SMTP_HOST,
      port: Number(e.SMTP_PORT) || 587,
      secure: e.SMTP_SECURE === 'true',
      auth: { user: e.SMTP_USER, pass: e.SMTP_PASS },
    });
  }

  // ── Ethereal dev fallback ────────────────────────────────────────────────
  providerName = 'Ethereal (dev preview)';
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

async function getTransporter() {
  if (!transporter) {
    transporter = await buildTransporter();
    console.log(`📧 Email provider: ${providerName}`);
  }
  return transporter;
}

// Detect the configured FROM address
function getFromAddress() {
  const e = process.env;
  if (e.RESEND_FROM)      return e.RESEND_FROM;
  if (e.SENDGRID_FROM)    return e.SENDGRID_FROM;
  if (e.BREVO_FROM)       return e.BREVO_FROM;
  if (e.GMAIL_USER)       return `"StockBot Pro" <${e.GMAIL_USER}>`;
  if (e.SMTP_FROM)        return e.SMTP_FROM;
  return '"StockBot Pro" <noreply@stockbotpro.com>';
}

export async function sendVerificationEmail(to, code) {
  const t = await getTransporter();

  const info = await t.sendMail({
    from: getFromAddress(),
    to,
    subject: `${code} is your StockBot Pro verification code`,
    text: `Your StockBot Pro verification code is: ${code}\n\nExpires in 15 minutes.`,
    html: `
      <div style="font-family:Inter,-apple-system,sans-serif;background:#0a0e14;padding:48px 32px;max-width:520px;margin:0 auto;border-radius:20px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:36px;height:36px;background:linear-gradient(135deg,rgba(0,217,255,0.3),rgba(139,92,246,0.3));border:1px solid rgba(0,217,255,0.4);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px">⚡</div>
          <span style="font-size:20px;font-weight:900;color:#00D9FF">StockBot Pro</span>
        </div>
        <p style="font-size:13px;color:#6B7280;margin-bottom:32px">AI-Powered Stock Intelligence</p>

        <h2 style="font-size:22px;font-weight:800;color:#ffffff;margin-bottom:8px">Verify your email</h2>
        <p style="font-size:14px;color:#9CA3AF;margin-bottom:28px">Enter this code to complete your registration:</p>

        <div style="background:rgba(0,217,255,0.08);border:1px solid rgba(0,217,255,0.25);border-radius:14px;padding:24px;text-align:center;margin-bottom:28px">
          <div style="font-size:52px;font-weight:900;letter-spacing:18px;color:#00D9FF;font-variant-numeric:tabular-nums">${code}</div>
          <div style="font-size:12px;color:#6B7280;margin-top:8px">Expires in 15 minutes</div>
        </div>

        <p style="font-size:12px;color:#4B5563;border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;margin:0">
          If you didn't create a StockBot Pro account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log('\n' + '═'.repeat(58));
  console.log(`📧  Email sent via ${providerName}`);
  console.log(`    To:   ${to}`);
  console.log(`    Code: ${code}`);
  if (previewUrl) console.log(`    View: ${previewUrl}`);
  console.log('═'.repeat(58) + '\n');

  return { previewUrl: previewUrl || null, provider: providerName };
}

export function getEmailProvider() {
  return providerName;
}
