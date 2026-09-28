import type { Post } from '@/data/types';
import { getPostTypeMeta } from '@/data/postTypes';
import { PostTypeTag } from './Tags';
import { Users, Calendar, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const CARD_ACCENTS = [
  { fill: '#F9B9A8', edge: '#FAD8CB' },
  { fill: '#B9D9F4', edge: '#D9ECFA' },
  { fill: '#C9E4B8', edge: '#E0F0D7' },
  { fill: '#F8D48A', edge: '#FBE8BB' },
  { fill: '#D8C5F2', edge: '#E9DFF8' },
  { fill: '#F2B9D2', edge: '#F8D9E7' },
] as const;

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { navigate } = useApp();
  const meta = getPostTypeMeta(post.type);
  const full = post.membersJoined >= post.membersNeeded;
  const accent = CARD_ACCENTS[hashPostId(post.id) % CARD_ACCENTS.length];

  return (
    <button
      onClick={() => navigate({ name: 'post-detail', postId: post.id })}
      className="group relative isolate flex flex-col gap-3 overflow-hidden rounded-card border-2 border-cream-300 bg-white p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop animate-pop-in"
    >
      <div className="pointer-events-none absolute -bottom-16 -right-14 z-0 h-36 w-44 rotate-[-12deg] rounded-[58%_42%_68%_32%/42%_55%_45%_58%] opacity-20 blur-[2px]" style={{ backgroundColor: accent.fill }} aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-12 -right-10 z-0 h-24 w-32 rotate-[16deg] rounded-[42%_58%_35%_65%/58%_38%_62%_42%] border-2 opacity-30" style={{ borderColor: accent.edge }} aria-hidden="true" />
      <div className={`relative z-10 inset-x-0 top-0 h-1.5 ${meta.color}`} />
      <div className="relative z-10 flex items-start justify-between gap-2 pt-1">
        <PostTypeTag type={post.type} />
        <span className={`flex items-center gap-1 rounded-btn px-2.5 py-1 text-xs font-bold ${full ? 'bg-poppy-400 text-white' : 'bg-sage-400 text-white'}`}>
          <Users size={12} />
          {post.membersJoined}/{post.membersNeeded}
        </span>
      </div>
      <h3 className="relative z-10 font-display text-lg font-bold leading-tight text-navy-500 line-clamp-2">
        {post.title}
      </h3>
      <p className="relative z-10 text-sm text-navy-400 line-clamp-2">{post.description}</p>
      <div className="relative z-10 flex flex-wrap gap-1.5">
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-btn bg-cream-200 px-2.5 py-0.5 text-xs font-semibold text-navy-400">
            {tag}
          </span>
        ))}
      </div>
      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-cream-300 pt-3 text-xs font-semibold text-navy-400">
        <span className="flex items-center gap-1">
          <Calendar size={13} />
          {formatDate(post.dueDate)}
        </span>
        <div className="flex items-center gap-2">
          {post.activityFormat && (
            <span className={`rounded-btn px-2 py-0.5 text-[10px] font-bold ${
              post.activityFormat === 'online' ? 'bg-sky-300/60 text-sky-700' :
              post.activityFormat === 'in-person' ? 'bg-peach-300/60 text-peach-600' :
              'bg-teal-300/60 text-teal-700'
            }`}>
              {post.activityFormat === 'in-person' ? 'In Person' : post.activityFormat === 'hybrid' ? 'Hybrid' : 'Online'}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {post.country}
          </span>
        </div>
      </div>
    </button>
  );
}

function hashPostId(id: string): number {
  return Array.from(id).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
