/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cal Sans"', '"Plus Jakarta Sans"', '"Cairo"', 'sans-serif'],
        body: ['"Belanosima"', '"Plus Jakarta Sans"', '"Cairo"', 'sans-serif'],
        arabic: ['"Cairo"', '"Tajawal"', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F1',
          200: '#F5EFE3',
          300: '#EDE4CF',
        },
        navy: {
          300: '#5A6B8F',
          400: '#3A4A6B',
          500: '#1E2A4A',
          600: '#16203B',
          700: '#101730',
          800: '#0A1124',
        },
        lavender: {
          100: '#F3E8FF',
          200: '#E8E4F8',
          300: '#D4CDF0',
          400: '#B3A8E8',
          500: '#998DD9',
          600: '#7B6EC8',
          700: '#5F4FA8',
        },
        sky: {
          300: '#A5D5F5',
          400: '#7BC1F0',
          500: '#52ACEB',
          600: '#3493D1',
          700: '#2475A8',
        },
        daffodil: {
          300: '#FCE5A0',
          400: '#F9D773',
          500: '#F5C944',
          600: '#E0B028',
        },
        peach: {
          300: '#FBD0B0',
          400: '#F9B585',
          500: '#F59A5A',
          600: '#E07E3E',
        },
        poppy: {
          400: '#F56A4A',
          500: '#E84E2C',
          600: '#C53D1F',
          700: '#A02E15',
        },
        sage: {
          300: '#B8D9B0',
          400: '#94C88A',
          500: '#6FA85F',
          600: '#58894A',
          700: '#426A38',
        },
        fuchsia: {
          400: '#E85BAE',
          500: '#D63A93',
          600: '#B42A78',
          700: '#8E1F5E',
        },
        teal: {
          300: '#9FD9D5',
          400: '#73C1BC',
          500: '#4AA9A4',
          600: '#348A85',
          700: '#246B67',
        },
        candy: {
          300: '#FBC0DA',
          400: '#F8A1C6',
          500: '#F37FB0',
          600: '#DB5E96',
        },
        plum: {
          300: '#A88BB0',
          400: '#8E6B96',
          500: '#74527E',
          600: '#5C4064',
          700: '#44304A',
        },
        olive: {
          400: '#9BA23A',
          500: '#83892E',
          600: '#6B701F',
        },
        burgundy: {
          500: '#8B2635',
          600: '#6E1E2A',
          700: '#541620',
        },
      },
      borderRadius: {
        pill: '9999px',
        btn: '0.75rem',
        card: '1rem',
        'card-lg': '1.25rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(30,42,74,0.08)',
        card: '0 6px 24px rgba(30,42,74,0.10)',
        pop: '0 4px 0 rgba(30,42,74,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pop-in': 'popIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-up': 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'spark-rotate': 'sparkRotate 8s linear infinite',
        'typing-dot': 'typingDot 1.2s ease-in-out infinite',
        'message-pop': 'messagePop 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(155, 141, 217, 0.4), 0 0 32px rgba(155, 141, 217, 0.15)' },
          '50%': { boxShadow: '0 0 28px rgba(155, 141, 217,0.65), 0 0 52px rgba(155, 141, 217, 0.25)' },
        },
        sparkRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        typingDot: {
          '0%, 60%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '30%': { opacity: '1', transform: 'translateY(-4px)' },
        },
        messagePop: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
