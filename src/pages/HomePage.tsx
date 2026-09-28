import { useApp } from '@/context/AppContext';
import { PostCard } from '@/components/PostCard';
import { PillButton } from '@/components/PillButton';
import { POST_TYPES } from '@/data/postTypes';
import { TrendingUp, Users, Search, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { PostType } from '@/data/types';
import { AboutUsSection } from '@/components/AboutUsSection';

export function HomePage() {
  const { posts, currentUser, navigate, searchQuery } = useApp();
  const [activeFilter, setActiveFilter] = useState<PostType | 'all' | 'recommended'>('recommended');

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.major.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeFilter === 'recommended') {
      const userInterests = new Set(currentUser.interests.map((i) => i.toLowerCase()));
      const userSkills = new Set(currentUser.skills.map((s) => s.toLowerCase()));
      const userMajor = currentUser.major.toLowerCase();

      result = [...result]
        .map((p) => {
          let score = 0;
          if (p.major.toLowerCase() === userMajor) score += 10;
          p.tags.forEach((t) => {
            if (userInterests.has(t.toLowerCase())) score += 5;
            if (userSkills.has(t.toLowerCase())) score += 3;
          });
          return { post: p, score };
        })
        .sort((a, b) => b.score - a.score)
        .map((x) => x.post);
    } else if (activeFilter !== 'all') {
      result = result.filter((p) => p.type === activeFilter);
    }

    return result;
  }, [posts, activeFilter, searchQuery, currentUser]);

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <HomeNav />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 animate-fade-in">
        {/* PEERORA Hero Banner */}
        <section className="relative mb-8 overflow-hidden rounded-card-lg border-2 border-cream-300 shadow-card p-8 sm:p-12">
          {/* Globe artwork as integrated background */}
          <img
            src="/assets/5890976795761250894_121.jpg"
            alt="Global student community connected around the world"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Soft overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/70" />

          {/* محتوى البانر */}
          <div className="relative">
            {/* الصف العلوي: النص العريض على اليسار، والأزرار الملونة على اليمين */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <p className="text-sm sm:text-base font-bold text-navy-800 max-w-xl leading-relaxed">
                Here is where ideas begin... where teams are formed... and where projects come to life.
              </p>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                <PillButton variant="yellow" size="sm" onClick={() => navigate({ name: 'create-post' })}>
                  <Plus size={15} /> Activity
                </PillButton>
                <PillButton variant="teal" size="sm" onClick={() => navigate({ name: 'study-groups' })}>
                  <Users size={15} /> Groups
                </PillButton>
              </div>
            </div>

            {/* العنوان الرئيسي في المنتصف */}
            <div className="my-8 text-center md:text-left">
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
                Available activities
              </h1>
            </div>

            {/* النص السفلي الصغير في نهاية الهيدر */}
            <div className="mt-6">
              <p className="text-xs sm:text-sm text-navy-500 font-medium">
                Browse academic posts and start your journey inside PEERORA.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <FilterChip active={activeFilter === 'recommended'} onClick={() => setActiveFilter('recommended')} icon={<TrendingUp size={14} />} label="Recommended" color="bg-fuchsia-500" />
          <FilterChip active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="All Posts" color="bg-navy-500" />
          {POST_TYPES.map((pt) => (
            <FilterChip
              key={pt.type}
              active={activeFilter === pt.type}
              onClick={() => setActiveFilter(pt.type)}
              label={`${pt.icon} ${pt.label}`}
              color={pt.color}
            />
          ))}
        </div>

        {/* Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-card bg-white py-20 text-center shadow-soft">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
              <Search className="text-navy-400" size={28} />
            </div>
            <h3 className="font-display text-xl font-bold text-navy-500">No posts found</h3>
            <p className="mt-1 text-sm text-navy-400">Try a different filter or search term</p>
          </div>
        )}

        {/* Bottom CTA: Find Students */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-card-lg bg-navy-500 p-6 text-center shadow-card">
          <Users className="text-lavender-300" size={28} />
          <p className="font-display text-lg font-bold text-white">
            Looking for study buddies or project partners?
          </p>
          <PillButton variant="primary" onClick={() => navigate({ name: 'find-students' })}>
            Find Students
          </PillButton>
        </div>

        {/* About Us Section */}
        <div className="mt-8">
          <AboutUsSection />
        </div>

        {/* 🌟 حقوق الموقع والتفاعل (توسيط في منتصف الصفحة) */}
        <div className="mt-8 mb-4 text-center px-2 space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-navy-400">
            © 2026 — Created by PEERORA Team
          </p>
          <p className="text-xs sm:text-sm font-medium text-navy-400">
            Contact:{' '}
            <a href="mailto:Peerora.support@gmail.com" className="hover:underline text-fuchsia-600 font-semibold">
              Peerora.support@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

function FilterChip({ active, onClick, label, color, icon }: { active: boolean; onClick: () => void; label: string; color: string; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-btn px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
        active
          ? `${color} text-white shadow-pop`
          : 'bg-white text-navy-400 border-2 border-cream-300 hover:border-navy-400'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function HomeNav() {
  const { navigate, currentUser, searchQuery, setSearchQuery, isSignedUp } = useApp();
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/70 shadow-soft backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2 shrink-0 bg-transparent">
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
        <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
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
    </header>
  );
}