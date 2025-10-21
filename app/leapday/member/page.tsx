import Link from "next/link";
import { memberMapping } from "@/lib/member-names";

export default function MemberListPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="text-center space-y-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: '筑紫A丸ゴシック, Hiragino Maru Gothic ProN, ヒラギノ丸ゴ ProN W4, Comic Sans MS, cursive' }}>
          メンバー一覧
        </h1>
        <p className="text-[15px] text-gray-600">各メンバーのLeapdayページにアクセスできます</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberMapping.map((member) => (
          <Link
            key={member.name}
            href={member.url}
            className="yk-card rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="text-center space-y-3">
              <div className="text-4xl mb-2">🌟</div>
              <h2 className="text-xl font-semibold text-[var(--yk-accent)]">
                {member.name}
              </h2>
              <p className="text-sm text-gray-600">
                {member.name}のLeapdayを満天の星にしよう
              </p>
              <div className="mt-4">
                <span className="inline-block px-4 py-2 bg-[var(--yk-accent)] text-white rounded-full text-sm font-medium">
                  応援ページへ
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/leapday"
          className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          ← メインページに戻る
        </Link>
      </div>
    </div>
  );
}
