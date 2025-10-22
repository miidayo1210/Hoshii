"use client";
import { useState } from "react";

interface FilterChange {
  q: string;
  tag?: string;
  type?: string;
}

interface FiltersProps {
  onChange: (v: FilterChange) => void;
}

export function Filters({ onChange }: FiltersProps) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [type, setType] = useState("");

  const handleQChange = (value: string) => {
    setQ(value);
    onChange({ q: value, tag, type });
  };

  const handleTagChange = (value: string) => {
    setTag(value);
    onChange({ q, tag: value, type });
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    onChange({ q, tag, type: value });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input 
        value={q} 
        onChange={(e) => handleQChange(e.target.value)} 
        placeholder="キーワード検索" 
        className="px-3 py-2 rounded-lg border w-60" 
      />
      <select 
        value={tag} 
        onChange={(e) => handleTagChange(e.target.value)} 
        className="px-3 py-2 rounded-lg border"
      >
        <option value="">タグ</option>
        <option value="自然">自然</option>
        <option value="まち">まち</option>
        <option value="人">人</option>
        <option value="文化">文化</option>
      </select>
      <select 
        value={type} 
        onChange={(e) => handleTypeChange(e.target.value)} 
        className="px-3 py-2 rounded-lg border"
      >
        <option value="">種類</option>
        <option value="action">アクション</option>
        <option value="board">コミュニティ</option>
      </select>
    </div>
  );
}




