"use client";
import { useState } from "react";
import DreamButton from "@/components/leapday/DreamButton";

interface MemberSupportProps {
  memberId: string;
  memberName: string;
  supportCount: number;
  onSupportSubmitted?: () => void;
}

export default function MemberSupport({ 
  memberId, 
  memberName, 
  supportCount, 
  onSupportSubmitted 
}: MemberSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      setMessage("名前とコメントは必須です");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/member/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          supporterName: form.name,
          supporterEmail: form.email,
          comment: form.comment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "応援の送信に失敗しました");
      }

      setMessage(data.message);
      setForm({ name: "", email: "", comment: "" });
      setIsOpen(false);
      
      if (onSupportSubmitted) {
        onSupportSubmitted();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Support Button */}
      <div className="text-center">
        <DreamButton onClick={() => setIsOpen(true)} className="px-6 py-3">
          💖 {memberName}さんを応援する
        </DreamButton>
        <p className="text-sm text-gray-600 mt-2">
          現在 {supportCount} 件の応援
        </p>
      </div>

      {/* Support Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {memberName}さんを応援する
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                  placeholder="お名前を入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  メールアドレス（任意）
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                  placeholder="メールアドレス（一度だけの登録でOK）"
                />
                <p className="text-xs text-gray-500 mt-1">
                  メールアドレスは一度だけの登録でOKです
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  応援コメント <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                  rows={3}
                  placeholder="応援のメッセージを入力してください"
                />
              </div>

              {message && (
                <div className={`text-sm p-2 rounded ${
                  message.includes("ありがとう") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-2">
                <DreamButton
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-500"
                >
                  キャンセル
                </DreamButton>
                <DreamButton
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "送信中..." : "応援を送る"}
                </DreamButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}