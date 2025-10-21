import Link from "next/link";
import StarSky from "@/components/leapday/StarSky";
import DreamButton from "@/components/leapday/DreamButton";
import FloatingComments from "@/components/leapday/FloatingComments";

export default function Page(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header className="text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-white/70 text-sm text-[var(--yk-ink)] shadow">LEAP DAY の星空</div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: '筑紫A丸ゴシック, Hiragino Maru Gothic ProN, ヒラギノ丸ゴ ProN W4, Comic Sans MS, cursive' }}>茨城Frogs　Leapdayを満天の星にしよう</h1>
        <p className="text-[15px] text-gray-600">応援を、アクションにして星を届けよう</p>
      </header>

      <StarSky />

      {/* Floating comments timeline */}
      <section>
        <h2 className="text-lg font-semibold mb-2">みんなのことば（タイムライン）</h2>
        <FloatingComments />
      </section>

      <section className="yk-card rounded-2xl p-6 space-y-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-[var(--yk-accent)]">現在の応援数</div>
          <div className="flex justify-center">
            <img src="/api/leapday/stats?type=badge" alt="counter" className="max-w-md rounded-xl" />
          </div>
        </div>
        <p className="text-[15px] text-gray-600 text-center">会場やオンラインからアクションが実行されると、星が増えていきます。</p>
        <div className="text-center space-y-3">
          <DreamButton as="a" href="/leapday/support" className="inline-block">💖 応援する</DreamButton>
          <div>
            <Link 
              href="/leapday/member" 
              className="inline-block px-4 py-2 bg-white/70 text-[var(--yk-ink)] rounded-full text-sm hover:bg-white/90 transition-colors duration-200"
            >
              👥 メンバー一覧を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
