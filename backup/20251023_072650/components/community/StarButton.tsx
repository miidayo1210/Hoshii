"use client";
import { useState } from "react";

interface StarButtonProps {
  actionId: string;
}

export function StarButton({ actionId }: StarButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await fetch("/api/community/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      setDone(true);
    } catch (error) {
      console.error("Failed to star action:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading || done}
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg text-white ${
        done ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"
      } transition disabled:opacity-50`}
    >
      {done ? "星が灯りました ✨" : "星を灯す"}
    </button>
  );
}





