import Link from "next/link";
import Image from "next/image";

interface Action {
  id: string;
  title: string;
  image_url?: string | null;
  stars_count: number;
  creator?: { name?: string };
  tags?: string[];
}

interface ActionCardProps {
  a: Action;
}

export function ActionCard({ a }: ActionCardProps) {
  return (
    <Link href={`/community/action/${a.id}`} className="block rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition">
      {a.image_url ? (
        <Image 
          src={a.image_url} 
          alt={a.title} 
          width={400} 
          height={192} 
          className="w-full h-48 object-cover" 
        />
      ) : (
        <div className="h-48 bg-gray-100" />
      )}
      <div className="p-3">
        <div className="text-sm text-gray-500 line-clamp-1">{a.creator?.name ?? "anonymous"}</div>
        <div className="font-medium mt-1 line-clamp-2">{a.title}</div>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
          <span>⭐ {a.stars_count}</span>
          {a.tags?.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
