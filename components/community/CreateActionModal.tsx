"use client";
import { useState } from "react";

interface CreateActionPayload {
  title: string;
  desc?: string;
  tags: string[];
  imageFile?: File | null;
  communityId?: string;
  communityNameNew?: string;
}

interface CreateActionModalProps {
  onCreate: (p: CreateActionPayload) => Promise<void>;
}

export function CreateActionModal({ onCreate }: CreateActionModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [mode, setMode] = useState<"select" | "create">("select");
  const [communityId, setCommunityId] = useState<string>("");
  const [communityName, setCommunityName] = useState("");

  const handleSubmit = async () => {
    await onCreate({
      title,
      desc,
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      imageFile: image,
      communityId: communityId || undefined,
      communityNameNew: mode === "create" ? communityName : undefined,
    });
    setOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="fixed bottom-6 right-6 rounded-full px-5 py-3 bg-emerald-600 text-white shadow-lg"
      >
        ＋ 投稿
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-4 space-y-3">
            <div className="text-lg font-semibold">アクションカードを作成</div>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="タイトル" 
              className="w-full px-3 py-2 border rounded-lg" 
            />
            <textarea 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              placeholder="説明" 
              className="w-full px-3 py-2 border rounded-lg" 
            />
            <input 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="タグ（カンマ区切り）" 
              className="w-full px-3 py-2 border rounded-lg" 
            />
            <input 
              type="file" 
              onChange={(e) => setImage(e.target.files?.[0] ?? null)} 
            />
            <div className="flex gap-2 items-center">
              <label className="text-sm">コミュニティ：</label>
              <select 
                disabled={mode === "create"} 
                value={communityId} 
                onChange={(e) => setCommunityId(e.target.value)} 
                className="px-2 py-1 border rounded"
              >
                <option value="">選択してください</option>
                {/* TODO: inject options via props or global state */}
              </select>
              <button 
                onClick={() => setMode(mode === "select" ? "create" : "select")} 
                className="text-emerald-700 text-sm underline"
              >
                {mode === "select" ? "新規作成" : "既存から選択"}
              </button>
            </div>
            {mode === "create" && (
              <input 
                value={communityName} 
                onChange={(e) => setCommunityName(e.target.value)} 
                placeholder="新規コミュニティ名" 
                className="w-full px-3 py-2 border rounded-lg" 
              />
            )}
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setOpen(false)} 
                className="px-3 py-2"
              >
                キャンセル
              </button>
              <button 
                onClick={handleSubmit} 
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                作成
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}







