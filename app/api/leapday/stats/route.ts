import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  try {
    const sb = createServerClient();
    
    // 環境変数が設定されていない場合はモックデータを返す
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
      console.log("Development: Returning mock stats");
      const url = new URL(req.url);
      if (url.searchParams.get("type") === "badge") {
        const total = 42; // Mock count
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="160">
          <rect width="100%" height="100%" fill="#ffffff"/>
          <text x="30" y="60" font-size="16" fill="#64748b">いまの星（合計）</text>
          <text x="30" y="120" font-size="56" fill="#10b981" font-weight="700">${total}</text>
        </svg>`;
        return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
      }
      return NextResponse.json({ total: 42 });
    }

    const { count, error } = await sb
      .from("leapday_participations")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error getting stats:", error);
      return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
    }

    const url = new URL(req.url);
    // If ?type=badge return a quick SVG badge, else JSON
    if (url.searchParams.get("type") === "badge") {
      const total = count ?? 0;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="160">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <text x="30" y="60" font-size="16" fill="#64748b">いまの星（合計）</text>
        <text x="30" y="120" font-size="56" fill="#10b981" font-weight="700">${total}</text>
      </svg>`;
      return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
    }
    
    return NextResponse.json({ total: count ?? 0 });
  } catch (error) {
    console.error("Error in /api/leapday/stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
