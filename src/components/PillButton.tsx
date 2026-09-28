import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'teal' | 'yellow' | 'red' | 'navy' | 'sage' | 'white';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-fuchsia-500 text-white hover:bg-fuchsia-600 shadow-pop',
  secondary: 'bg-navy-500 text-white hover:bg-navy-600 shadow-pop',
  teal: 'bg-teal-500 text-white hover:bg-teal-600 shadow-pop',
  yellow: 'bg-daffodil-500 text-navy-500 hover:bg-daffodil-600 shadow-pop',
  red: 'bg-poppy-500 text-white hover:bg-poppy-600 shadow-pop',
  navy: 'bg-navy-500 text-white hover:bg-navy-600 shadow-pop',
  sage: 'bg-sage-500 text-white hover:bg-sage-600 shadow-pop',
  white: 'bg-white text-navy-500 border-2 border-navy-500 hover:bg-cream-100 shadow-pop',
};

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function PillButton({ variant = 'primary', children, size = 'md', className = '', ...props }: PillButtonProps) {
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base';
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-display font-bold uppercase tracking-wide transition-all duration-150 active:translate-y-1 active:shadow-none ${variantClasses[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
