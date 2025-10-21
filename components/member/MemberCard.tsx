"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface MemberCardProps {
  member: {
    id: string;
    slug: string;
    nickname: string;
    sns: string[];
    challenge_domains: string;
    interest_tags: string[];
    activities: string;
    want_to_meet: string;
    self_tags: string[];
    enthusiasm: string;
    avatar_url: string;
    created_at: string;
  };
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="yk-card rounded-2xl p-6 hover:shadow-[0_20px_40px_rgba(179,136,255,0.15)] transition-all duration-300"
    >
      <Link href={`/member/${member.slug}`} className="block">
        {/* Avatar and nickname */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--yk-accent)] to-[var(--yk-accent-2)] flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-lg">
            {member.avatar_url ? (
              <img 
                src={member.avatar_url} 
                alt={member.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              member.nickname.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-[var(--yk-ink)]">{member.nickname}</h3>
            <p className="text-sm text-gray-500">
              {new Date(member.created_at).toLocaleDateString('ja-JP')} 参加
            </p>
          </div>
        </div>

        {/* Challenge domains */}
        {member.challenge_domains && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">挑戦領域</p>
            <p className="text-sm text-[var(--yk-ink)]">{member.challenge_domains}</p>
          </div>
        )}

        {/* Interest tags */}
        {member.interest_tags && member.interest_tags.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">興味のある領域</p>
            <div className="flex flex-wrap gap-1">
              {member.interest_tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[var(--yk-accent-3)]/30 text-[var(--yk-accent)] text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {member.interest_tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{member.interest_tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Self tags */}
        {member.self_tags && member.self_tags.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">あなたらしさ</p>
            <div className="flex flex-wrap gap-1">
              {member.self_tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[var(--yk-emerald)]/20 text-[var(--yk-emerald)] text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {member.self_tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{member.self_tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Activities preview */}
        {member.activities && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">取り組んでいること</p>
            <p className="text-sm text-[var(--yk-ink)] line-clamp-2">
              {member.activities}
            </p>
          </div>
        )}

        {/* View profile link */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[var(--yk-accent)] text-sm font-medium hover:text-[var(--yk-accent-2)] transition-colors">
            プロフィールを見る →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
