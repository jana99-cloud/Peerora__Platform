import { useApp } from '@/context/AppContext';
import { Search, Plus, Users, ChevronLeft, Home, MessagesSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher'; // 🌟 استيراد مكون زر اللغات

export function TopNav({ title }: { title?: string }) {
  const { navigate, currentUser, searchQuery, setSearchQuery, isSignedUp } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/70 shadow-soft backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="flex items-center gap-2 shrink-0 bg-transparent"
        >
          <img
            src="/assets/5882017549816369826_121.jpg"
            alt="PEERORA"
            className="h-10 w-28 bg-transparent object-cover object-center sm:w-36"
          />
        </button>

        <div className="relative flex-1 max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
          <input
            type="text"
            placeholder="Search posts, students, groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-btn border-2 border-cream-300 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-navy-500 placeholder:text-navy-400/60 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/50 transition"
          />
        </div>

        <nav className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <NavTab icon={<Home size={18} />} label="Feed" onClick={() => navigate({ name: 'home' })} />
          <NavTab icon={<Plus size={18} />} label="Post" color="text-fuchsia-500" onClick={() => navigate({ name: 'create-post' })} />
          <NavTab icon={<Users size={18} />} label="Groups" onClick={() => navigate({ name: 'study-groups' })} />
          <NavTab icon={<MessagesSquare size={18} />} label="Conversations" color="text-lavender-600" onClick={() => navigate({ name: 'conversations' })} />

          {/* 🌟 زر اللغات ظاهر الآن بوضوح في شريط التنقل */}
          <LanguageSwitcher />

          {isSignedUp ? (
            <button
              onClick={() => navigate({ name: 'my-profile' })}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-300 font-display text-sm font-bold text-navy-500 transition hover:scale-105 hover:shadow-pop"
              title={currentUser.name}
            >
              {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </button>
          ) : (
            <button
              onClick={() => navigate({ name: 'signup' })}
              className="rounded-btn bg-fuchsia-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-fuchsia-600"
            >
              Sign Up
            </button>
          )}
        </nav>
      </div>
      {title && (
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6">
          <h2 className="font-display text-xl font-bold text-navy-500">{title}</h2>
        </div>
      )}
    </header>
  );
}

function NavTab({ icon, label, onClick, color = 'text-navy-500' }: { icon: ReactNode; label: string; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-btn px-3 py-2 text-sm font-bold ${color} transition hover:bg-cream-200 hover:shadow-soft`}
    >
      {icon}
      <span className="hidden md:block">{label}</span>
    </button>
  );
}

export function BackButton({ label = 'Back' }: { label?: string }) {
  const { goBack } = useApp();
  return (
    <button
      onClick={goBack}
      className="flex items-center gap-1.5 rounded-btn px-4 py-2 text-sm font-bold text-navy-500 transition hover:bg-cream-200"
    >
      <ChevronLeft size={18} />
      {label}
    </button>
  );
}

export function PageShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-screen">
      <TopNav title={title} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
