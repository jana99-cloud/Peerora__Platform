import { getUniversityEntry } from '@/data/postTypes';

interface UniversityLogoProps {
  name: string;
  size?: number;
  className?: string;
}

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#1E2A4A','#7B6EC8','#3493D1','#4AA9A4','#6FA85F','#D63A93','#E84E2C','#F59A5A','#74527E','#2475A8'];
  return colors[Math.abs(hash) % colors.length];
}

function initialsFromName(name: string): string {
  const clean = name.replace(/\(.*\)/, '').trim();
  const words = clean.split(/[\s,-]+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0]?.slice(0, 2).toUpperCase() ?? 'U';
}

export function UniversityLogo({ name, size = 32, className = '' }: UniversityLogoProps) {
  const entry = getUniversityEntry(name);
  const bg = colorFromName(name);
  const initials = entry?.acronym ? entry.acronym.slice(0, 2).toUpperCase() : initialsFromName(name);

  if (entry?.logo) {
    return (
      <img
        src={entry.logo}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={`rounded-btn object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-btn font-display font-bold text-white shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function UniversityDisplay({ name, showCountry = true, logoSize = 32, className = '' }: { name: string; showCountry?: boolean; logoSize?: number; className?: string }) {
  const entry = getUniversityEntry(name);
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <UniversityLogo name={name} size={logoSize} />
      <div className="min-w-0">
        <p className="text-sm font-bold text-navy-500 truncate">{name}</p>
        {showCountry && entry && (
          <p className="text-xs font-semibold text-navy-400 truncate">{entry.country}</p>
        )}
      </div>
    </div>
  );
}
