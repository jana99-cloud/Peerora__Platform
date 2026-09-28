import type { PostType } from '@/data/types';
import { getPostTypeMeta } from '@/data/postTypes';

interface TagProps {
  type: PostType;
  size?: 'sm' | 'md';
}

export function PostTypeTag({ type, size = 'sm' }: TagProps) {
  const meta = getPostTypeMeta(type);
  const sizeClass = size === 'sm' ? 'text-xs px-3 py-1' : 'text-sm px-4 py-1.5';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-btn font-bold ${meta.bgColor} ${meta.textColor} ${sizeClass}`}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  );
}

interface CategoryTagProps {
  label: string;
  color?: string;
}

export function CategoryTag({ label, color = 'bg-cream-300 text-navy-500' }: CategoryTagProps) {
  return (
    <span className={`inline-flex items-center rounded-btn px-3 py-1 text-xs font-bold ${color}`}>
      {label}
    </span>
  );
}
