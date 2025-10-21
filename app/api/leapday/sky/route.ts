import { createCanvas } from "canvas";
import { createServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = createServerClient();
    
    // 環境変数が設定されていない場合はモックデータを使用
    let count = 42; // Mock count
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
      const { count: realCount, error } = await sb
        .from("leapday_participations")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error getting count for sky:", error);
        return new Response("Error generating sky", { status: 500 });
      }
      
      count = realCount ?? 0;
    }

    const total = Math.min(300, Math.max(20, Math.floor(count * 0.5) + 30));
    const w = 800, h = 450;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    
    // Set dark background
    ctx.fillStyle = "#0b1020";
    ctx.fillRect(0, 0, w, h);
    
    // Draw stars
    for (let i = 0; i < total; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.8 + 0.4;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new Response(canvas.toBuffer("image/png"), {
      headers: { "Content-Type": "image/png" }
    });
  } catch (error) {
    console.error("Error in /api/leapday/sky:", error);
    return new Response("Error generating sky", { status: 500 });
  }
}
