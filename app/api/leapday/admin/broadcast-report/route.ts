import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { sendMail } from "@/lib/leapday/mailer";

export const dynamic = "force-dynamic";

async function fetchPDF() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/leapday/report`, { cache:"no-store" });
  return new Uint8Array(await res.arrayBuffer());
}

export async function POST(req:Request){
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if(!process.env.SECRET_BROADCAST_KEY || key !== process.env.SECRET_BROADCAST_KEY){
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sb = createServerClient();
  const { data } = await sb.from("leapday_participations").select("email").not("email","is",null).neq("email","");
  const emails = Array.from(new Set((data ?? []).map(r=> String(r.email).trim().toLowerCase()))).slice(0, 2000);

  if (emails.length === 0) return NextResponse.json({ ok:true, sent:0 });

  const pdfBytes = await fetchPDF();
  let sent = 0, failed = 0;

  // 連続送信（Resend側でレート制限に留意。必要に応じてchunk sleepを追加）
  for (const to of emails) {
    try {
      await sendMail({
        to,
        subject: "LEAP DAY — 報告書PDFをお届けします",
        html: `<div style="font-family:ui-sans-serif,system-ui">
          <h2>LEAP DAY ご参加ありがとうございました</h2>
          <p>当日の様子とデータをまとめたPDFをお送りします。</p>
          <p>また、<a href="${process.env.NEXT_PUBLIC_BASE_URL}/leapday">星空ページ</a>からPNG/SVGカードもダウンロードできます。</p>
        </div>`,
        attachments: [{ filename: "leapday_report.pdf", content: Buffer.from(pdfBytes), type: "application/pdf" }]
      });
      sent++;
    } catch (e) {
      console.error("send fail to", to, e);
      failed++;
    }
  }

  return NextResponse.json({ ok:true, sent, failed });
}
