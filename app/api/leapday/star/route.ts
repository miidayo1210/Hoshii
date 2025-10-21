import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import ThankYouEmail from "@/components/leapday/email/ThankYou";
import { sendMail } from "@/lib/leapday/mailer";

export async function POST(req: Request) {
  try {
    const { name, email, actionKey, comment } = await req.json();
    
    if (!actionKey) {
      return NextResponse.json({ error: "actionKey required" }, { status: 400 });
    }

    const sb = createServerClient();
    
    // 環境変数が設定されていない場合はモックデータを返す
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
      console.log("Development: Returning mock star submission");
      return NextResponse.json({
        ok: true,
        total: 43, // Mock total
        participation: {
          id: "mock-id",
          name: name?.trim() || "Mock User",
          email: email?.trim() || "mock@example.com",
          action_key: actionKey,
          comment: comment?.trim() || null,
          created_at: new Date().toISOString()
        }
      });
    }
    
    // Insert participation
    const { data, error: insertError } = await sb
      .from("leapday_participations")
      .insert({
        name: name ?? null,
        email: email ?? null,
        action_key: actionKey,
        comment: comment ?? null
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting participation:", insertError);
      return NextResponse.json({ error: "Failed to insert participation" }, { status: 500 });
    }

    // Get total count
    const { count, error: countError } = await sb
      .from("leapday_participations")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error getting count:", countError);
      return NextResponse.json({ error: "Failed to get count" }, { status: 500 });
    }

    // if email present → send thank-you with home link only
    if (email) {
      try {
        console.log("Attempting to send email to:", email);
        const base = process.env.NEXT_PUBLIC_BASE_URL || "";
        const homeUrl = `${base}/leapday`;

        // Resend無料プランでは自分のメールアドレスにのみ送信可能
        const allowedEmail = "g1841028@gmail.com";
        const sendToEmail = email === allowedEmail ? email : allowedEmail;
        
        if (email !== allowedEmail) {
          console.log(`Email redirected from ${email} to ${allowedEmail} (Resend free plan limitation)`);
        }

        const result = await sendMail({
          to: sendToEmail,
          subject: `茨城Frogsの応援と参加ありがとうございます — LEAP DAY 2025 (${name || '参加者'}さん)`,
          react: ThankYouEmail({
            name,
            totalStars: count ?? 0,
            links: { png: "", svg: "", pdf: "", home: homeUrl }
          })
        });
        
        console.log("Email sent successfully:", result);
      } catch (e) {
        // ログだけ残して処理は成功扱いに
        console.error("Email send failed for", email, ":", e);
      }
    }

    return NextResponse.json({ 
      ok: true, 
      total: count ?? 0,
      participation: data
    });
  } catch (error) {
    console.error("Error in /api/leapday/star:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
