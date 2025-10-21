"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TagInput from "@/components/member/TagInput";
import DreamButton from "@/components/leapday/DreamButton";

export default function Page(){
  const { token } = useParams<{ token:string }>();
  const router = useRouter();
  const [nickname,setNickname]=useState("");
  const [sns,setSNS]=useState(""); // comma separated
  const [challenge,setChallenge]=useState("");
  const [interest,setInterest]=useState<string[]>([]);
  const [activities,setActivities]=useState("");
  const [meet,setMeet]=useState("");
  const [selfTags,setSelfTags]=useState<string[]>([]);
  const [enthusiasm,setEnthusiasm]=useState("");
  const [avatar,setAvatar]=useState("");
  const [avatarFile,setAvatarFile]=useState<File | null>(null);

  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  async function submit(){
    setLoading(true); setErr("");
    
    // Convert avatar file to base64 if exists
    let avatarUrl = avatar;
    if (avatarFile) {
      avatarUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(avatarFile);
      });
    }
    
    const res = await fetch("/api/member/signup",{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        token, nickname,
        sns,
        challenge_domains: challenge,
        interest_tags: interest,
        activities,
        want_to_meet: meet,
        self_tags: selfTags,
        enthusiasm,
        avatar_url: avatarUrl
      })
    });
    const j = await res.json();
    setLoading(false);
    if(!res.ok){ setErr(j.error || "エラーが発生しました"); return; }
    router.push(`/member/${j.slug}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">メンバー登録（招待）</h1>
      <p className="text-gray-600 text-sm">このページからプロフィールを登録すると、あなた専用の「応援の窓口」が作成されます。</p>

      <div className="rounded-2xl bg-white shadow p-4 space-y-3">
        <input className="w-full px-3 py-2 rounded-xl border" placeholder="ニックネーム（必須）" value={nickname} onChange={e=>setNickname(e.target.value)} />
        <input className="w-full px-3 py-2 rounded-xl border" placeholder="SNS（カンマ区切りで複数可）" value={sns} onChange={e=>setSNS(e.target.value)} />
        <input className="w-full px-3 py-2 rounded-xl border" placeholder="挑戦している領域（例：教育×テック）" value={challenge} onChange={e=>setChallenge(e.target.value)} />
        <div>
          <div className="text-sm font-medium mb-1">興味のある領域（タグ）</div>
          <TagInput value={interest} onChange={setInterest} placeholder="例：地域, 子ども, アート" />
        </div>
        <textarea className="w-full px-3 py-2 rounded-xl border" placeholder="取り組んでいること" value={activities} onChange={e=>setActivities(e.target.value)} />
        <input className="w-full px-3 py-2 rounded-xl border" placeholder="こんな人と会いたい" value={meet} onChange={e=>setMeet(e.target.value)} />
        <div>
          <div className="text-sm font-medium mb-1">あなたらしさ（タグ）</div>
          <TagInput value={selfTags} onChange={setSelfTags} placeholder="例：やさしい, 行動力, おもしろがり" />
        </div>
        <textarea className="w-full px-3 py-2 rounded-xl border" placeholder="意気込みやコメント" value={enthusiasm} onChange={e=>setEnthusiasm(e.target.value)} />
        
        {/* Avatar Upload */}
        <div>
          <div className="text-sm font-medium mb-2">プロフィール画像（任意）</div>
          <div className="space-y-2">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatar(""); // Clear URL input
                }
              }}
              className="w-full px-3 py-2 rounded-xl border"
            />
            {avatarFile && (
              <div className="text-sm text-green-600">
                📸 {avatarFile.name} が選択されました
              </div>
            )}
            <div className="text-xs text-gray-500">または</div>
            <input 
              className="w-full px-3 py-2 rounded-xl border" 
              placeholder="画像URL（任意）" 
              value={avatar} 
              onChange={e=>{
                setAvatar(e.target.value);
                setAvatarFile(null); // Clear file input
              }} 
            />
          </div>
        </div>
        {err && <div className="text-rose-600 text-sm">{err}</div>}
        <DreamButton onClick={submit} full>{loading?"送信中…":"🌟 登録して窓口を作る"}</DreamButton>
      </div>
    </div>
  );
}
