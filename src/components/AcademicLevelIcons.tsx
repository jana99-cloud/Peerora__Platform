import type { AcademicIconKey } from '@/data/postTypes';
import { getAcademicLevelMeta } from '@/data/postTypes';

interface IconProps {
  size?: number;
  className?: string;
}

const STROKE = 1.8;

function Base({ children, size = 20, className = '' }: { children: React.ReactNode; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Level 1 badge — a single circle with "1" feel (dot in center)
export function FirstYearIcon({ size = 20, className = '' }: IconProps) {
  return (
    <Base size={size} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </Base>
  );
}

// Level 2 — two ascending dots/steps
export function SecondYearIcon({ size = 20, className = '' }: IconProps) {
  return (
    <Base size={size} className={className}>
      <path d="M4 18l4-5 4 3 4-6 4 4" />
      <circle cx="8" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

// Level 3 — three-bar ascending steps
export function ThirdYearIcon({ size = 20, className = '' }: IconProps) {
  return (
    <Base size={size} className={className}>
      <rect x="4" y="14" width="4" height="6" rx="1" />
      <rect x="10" y="10" width="4" height="10" rx="1" />
      <rect x="16" y="6" width="4" height="14" rx="1" />
    </Base>
  );
}

// Level 4 — four-node connected path
export function FourthYearIcon({ size = 20, className = '' }: IconProps) {
  return (
    <Base size={size} className={className}>
      <path d="M4 16l4-4 4 2 4-5 4 3" />
      <circle cx="4" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="20" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </Base>
  );
}

// Level 5 — star badge (advanced level)
export function FifthYearIcon({ size = 20, className = '' }: IconProps) {
  return (
    <Base size={size} className={className}>
      <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" />
    </Base>
  );
}

// Graduate — graduation cap (unchanged)
export function GraduateIcon({ size = 20, className = '' }: IconProps) {
  return (
    <Base size={size} className={className}>
      <path d="M2 8l10-4 10 4-10 4L2 8z" />
      <path d="M6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 8v5" />
    </Base>
  );
}

const ICON_MAP: Record<AcademicIconKey, (props: IconProps) => React.ReactNode> = {
  first: FirstYearIcon,
  second: SecondYearIcon,
  third: ThirdYearIcon,
  fourth: FourthYearIcon,
  fifth: FifthYearIcon,
  graduate: GraduateIcon,
};

export function AcademicLevelIcon({ iconKey, size = 20, className = '' }: { iconKey: AcademicIconKey; size?: number; className?: string }) {
  const Icon = ICON_MAP[iconKey];
  return <Icon size={size} className={className} />;
}

export function AcademicLevelIconByValue({ value, size = 20, className = '' }: { value: string; size?: number; className?: string }) {
  const meta = getAcademicLevelMeta(value);
  if (!meta) return null;
  const Icon = ICON_MAP[meta.iconKey];
  return <Icon size={size} className={className} />;
}
