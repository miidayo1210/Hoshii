import Link from "next/link";
import StarSky from "@/components/leapday/StarSky";
import DreamButton from "@/components/leapday/DreamButton";
import MemberComments from "@/components/leapday/MemberComments";
import StatsDisplay from "@/components/leapday/StatsDisplay";
import { memberNames } from "@/lib/member-names";

interface PageProps {
  params: {
    name: string;
  };
}

export async function generateStaticParams() {
  return memberNames.map((name) => ({
    name: encodeURIComponent(name),
  }));
}

export default function MemberPage({ params }: PageProps) {
  const { name } = params;
  
  // URLデコードして日本語名に変換
  const decodedName = decodeURIComponent(name);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header className="text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-white/70 text-sm text-[var(--yk-ink)] shadow">LEAP DAY の星空</div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: '筑紫A丸ゴシック, Hiragino Maru Gothic ProN, ヒラギノ丸ゴ ProN W4, Comic Sans MS, cursive' }}>
          {decodedName}のLeapdayを満天の星にしよう
        </h1>
        <p className="text-[15px] text-gray-600">応援を、アクションにして星を届けよう</p>
        <div className="mt-4">
          <Link 
            href="/leapday/member" 
            className="inline-block px-4 py-2 bg-white/70 text-[var(--yk-ink)] rounded-full text-sm hover:bg-white/90 transition-colors duration-200"
          >
            👥 メンバー一覧に戻る
          </Link>
        </div>
      </header>

      <StarSky />

      {/* Member-specific comments timeline */}
      <section>
        <h2 className="text-lg font-semibold mb-2">{decodedName}さんへの応援メッセージ</h2>
        <MemberComments memberName={decodedName} />
      </section>

      <section className="yk-card rounded-2xl p-6 space-y-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-[var(--yk-accent)]">現在の応援数</div>
          <div className="flex justify-center">
            <StatsDisplay type="badge" />
          </div>
        </div>
        <p className="text-[15px] text-gray-600 text-center">会場やオンラインからアクションが実行されると、星が増えていきます。</p>
        <div className="text-center">
          <DreamButton as="a" href="/leapday/support" className="inline-block">💖 参加する</DreamButton>
        </div>
      </section>
    </div>
  );
}
