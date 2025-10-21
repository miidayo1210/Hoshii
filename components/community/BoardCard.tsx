import Link from "next/link";
import Image from "next/image";

interface Board {
  id: string;
  name: string;
  cover_url?: string | null;
  desc?: string | null;
}

interface BoardCardProps {
  b: Board;
}

export function BoardCard({ b }: BoardCardProps) {
  return (
    <Link href={`/community/board/${b.id}`} className="block rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition">
      {b.cover_url ? (
        <Image 
          src={b.cover_url} 
          alt={b.name} 
          width={400} 
          height={160} 
          className="w-full h-40 object-cover" 
        />
      ) : (
        <div className="h-40 bg-gray-100" />
      )}
      <div className="p-3">
        <div className="font-medium">{b.name}</div>
        {b.desc && <div className="text-sm text-gray-600 line-clamp-2 mt-1">{b.desc}</div>}
      </div>
    </Link>
  );
}


