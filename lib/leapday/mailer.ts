import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY!;
const from = process.env.MAIL_FROM || "LEAP DAY <noreply@example.com>";

export const resend = new Resend(apiKey);

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  attachments?: Array<{ filename: string; content: Buffer | string; type?: string }>;
}) {
  if (!apiKey) throw new Error("RESEND_API_KEY is missing");
  return await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    react: opts.react as any,
    html: opts.html,
    attachments: opts.attachments as any,
  });
}

