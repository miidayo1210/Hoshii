"use client";
import { useState } from "react";
import { CommunitySidebar, CommunityMobileNav } from "@/components/community/sidebar";

export default function Page(){
  const [res,setRes] = useState<any>(null);
  const [loading,setLoading]=useState(false);

  async function run(){
    setLoading(true);
    try{
      const r = await fetch("/api/community/dev/import/run", { method:"POST" });
      const j = await r.json();
      setRes(j);
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-2xl font-semibold">アクションカード：プリセット登録</h1>
            <p className="text-gray-600">「Hoshii スターター」コミュニティに、プリセットのアクションカードを一括登録します。</p>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">登録されるアクションカード</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>🌱 マイボトルを持ち歩こう</div>
                <div>🛍 コンビニで袋を断る</div>
                <div>🚯 ごみを一つ拾う</div>
                <div>💚 寄付をしてみる</div>
                <div>✉ 誰かに「ありがとう」を伝える</div>
                <div>🌸 SNSで応援メッセージを投稿する</div>
                <div>☕ いつものお店に「ごちそうさま」を言う</div>
                <div>🚴 自転車で出かけよう</div>
                <div>🌼 花を一輪、育ててみよう</div>
                <div>🕊 落ちているペットボトルをリサイクルへ</div>
                <div>💬 「がんばってるね」を伝える</div>
                <div>📚 本を一冊、友だちにすすめる</div>
                <div>🍀 自分をほめる</div>
                <div>🏠 家の前を掃く</div>
                <div>👂 誰かの話を最後まで聞く</div>
                <div>🌏 地元の野菜を買う</div>
              </div>
            </div>
            
            <button 
              onClick={run} 
              disabled={loading} 
              className="px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "登録中..." : "一括登録を実行する"}
            </button>
            
            {res && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-3">実行結果</h3>
                <pre className="bg-gray-50 p-4 rounded-xl border text-sm overflow-auto">
{JSON.stringify(res, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}
