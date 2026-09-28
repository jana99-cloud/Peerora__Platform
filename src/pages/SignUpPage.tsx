import { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PillButton } from '@/components/PillButton';
import { Camera, Plus, X, GraduationCap, Globe, Check, ChevronDown } from 'lucide-react';
import { MAJORS, ACADEMIC_LEVELS, UNIVERSITIES, searchUniversities, getUniversityCountry } from '@/data/postTypes';
import type { AcademicLevelOption, UniversityEntry } from '@/data/postTypes';
import type { FieldKey, PrivacySettings } from '@/data/types';
import { AcademicLevelIcon } from '@/components/AcademicLevelIcons';
import { UniversityLogo } from '@/components/UniversityLogo';

const FIELD_LABELS: Record<FieldKey, string> = {
  email: 'Email',
  phone: 'Phone Number',
  university: 'University',
  major: 'Major',
  skills: 'Skills',
  interests: 'Interests',
  expertise: 'Expertise',
};

const FIELD_KEYS: FieldKey[] = ['email', 'phone', 'university', 'major', 'skills', 'interests', 'expertise'];

export function SignUpPage() {
  const { navigate, setSignedUp, setCurrentUser } = useApp();
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [university, setUniversity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [level, setLevel] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [skills, setSkills] = useState<string[]>(['']);
  const [interests, setInterests] = useState<string[]>(['']);
  const [expertise, setExpertise] = useState<string[]>(['']);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState<Record<FieldKey, boolean>>({
    email: false,
    phone: false,
    university: true,
    major: true,
    skills: true,
    interests: true,
    expertise: true,
  });

  const handleSave = () => {
    if (!agreedToPrivacy) return;
    const newStudent = {
      id: 'currentUser',
      name: name || 'New Student',
      major: major || '',
      university: university || '',
      country: getUniversityCountry(university) || '',
      email: email || 'student@example.com',
      phone: phone || '',
      username: username || 'new_student',
      photo,
      skills: skills.filter(Boolean),
      interests: interests.filter(Boolean),
      expertise: expertise.filter(Boolean),
      courses: [],
      level: level || 'First Year',
      privacy: {
        profileVisibility: 'public' as const,
        emailVisibility: fieldVisibility.email ? 'everyone' as const : 'no-one' as const,
        phoneVisible: fieldVisibility.phone,
        messagingPermission: 'everyone' as const,
        postVisibility: 'public' as const,
        fieldVisibility,
      },
      agreedToPrivacy: true,
      joinedPostIds: [],
      joinedGroupIds: [],
    };
    setCurrentUser(newStudent);
    setSignedUp(true);
    navigate({ name: 'home' });
  };

  return (
    <div className="min-h-screen grid-bg">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-btn bg-fuchsia-500 shadow-pop">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-navy-500 sm:text-4xl">Join PEERORA</h1>
          <p className="mt-2 text-navy-400">Connect with university students worldwide. Share, collaborate, and grow together.</p>
        </div>

        <div className="rounded-card-lg bg-white p-6 shadow-card sm:p-8 animate-slide-up">
          {/* Photo Upload */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cream-200 border-4 border-cream-300 overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="text-navy-400" size={36} />
                )}
              </div>
              <button
                onClick={() => {
                  const colors = ['#B3A8E8','#7BC1F0','#F9B585','#94C88A','#E85BAE','#73C1BC'];
                  setPhoto(`data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='112' height='112'><rect width='112' height='112' fill='${colors[Math.floor(Math.random()*6)]}'/><text x='56' y='68' font-size='48' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>${(name[0] || 'S').toUpperCase()}</text></svg>`)}`);
                }}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-navy-500 text-white shadow-pop transition hover:bg-navy-600"
                title="Edit photo"
              >
                <Camera size={16} />
              </button>
            </div>
            <button
              onClick={() => setPhoto(undefined)}
              className="mt-2 text-xs font-bold text-navy-400 underline hover:text-fuchsia-500"
            >
              Edit
            </button>
          </div>

          {/* Basic Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student Name" value={name} onChange={setName} placeholder="Enter your full name" />
            <SearchableMajorSelect label="Major" value={major} onChange={setMajor} placeholder="Search major..." />
            <SearchableUniversitySelect label="University" value={university} onChange={setUniversity} placeholder="Search university..." />
            <AcademicLevelSelect label="Academic Level" value={level} onChange={setLevel} placeholder="Select level..." />
            <Field label="Phone Number" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="name@example.com" type="email" />
            <Field label="Username" value={username} onChange={setUsername} placeholder="student_name" />
          </div>

          {/* Selected University Display */}
          {university && (
            <div className="mt-4 flex items-center gap-3 rounded-card border-2 border-lavender-300 bg-lavender-200/30 p-3">
              <UniversityLogo name={university} size={40} />
              <div>
                <p className="text-sm font-bold text-navy-500">{university}</p>
                <p className="text-xs font-semibold text-navy-400">{getUniversityCountry(university)}</p>
              </div>
            </div>
          )}

          {/* Expandable Lists */}
          <div className="mt-6 space-y-4">
            <ExpandableList label="Student Skills" items={skills} setItems={setSkills} placeholder="e.g. Python, React, Machine Learning" />
            <ExpandableList label="Student Interests" items={interests} setItems={setInterests} placeholder="e.g. AI, Cybersecurity, Web Development" />
            <ExpandableList label="Student Expertise" items={expertise} setItems={setExpertise} placeholder="e.g. Full-Stack Development, Data Analysis" />
          </div>

          {/* Field Visibility Controls */}
          <div className="mt-6 rounded-card border-2 border-cream-300 bg-cream-50 p-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-navy-400">Information Visibility</h3>
            <p className="mb-3 text-xs text-navy-400/80">Choose which information other students can see on your profile.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {FIELD_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2 rounded-btn bg-white px-3 py-2 cursor-pointer transition hover:bg-cream-100">
                  <input
                    type="checkbox"
                    checked={fieldVisibility[key]}
                    onChange={(e) => setFieldVisibility({ ...fieldVisibility, [key]: e.target.checked })}
                    className="accent-fuchsia-500 h-4 w-4"
                  />
                  <span className="text-sm font-semibold text-navy-500">{FIELD_LABELS[key]}</span>
                  <span className={`ml-auto text-xs font-bold ${fieldVisibility[key] ? 'text-sage-600' : 'text-navy-400/60'}`}>
                    {fieldVisibility[key] ? 'Visible' : 'Private'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy Agreement */}
          <div className="mt-6 rounded-card border-2 border-lavender-300 bg-lavender-200/40 p-4">
            <p className="mb-3 text-xs font-semibold text-navy-500">
              By creating an account, I agree to the platform's Privacy Policy and understand that the information I choose to share may be visible to other students according to my privacy settings.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="mt-0.5 accent-fuchsia-500 h-4 w-4 shrink-0"
              />
              <span className="text-sm font-bold text-navy-500">I agree to the Privacy Policy and data protection terms.</span>
            </label>
          </div>

          {/* Save */}
          <div className="mt-8 flex justify-center">
            <PillButton
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={!agreedToPrivacy}
              className={agreedToPrivacy ? '' : 'opacity-50 cursor-not-allowed'}
            >
              Save & Start Connecting
            </PillButton>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-navy-400">
          <Globe size={14} />
          Join 10,000+ students from 50+ countries
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
      />
    </label>
  );
}

function SearchableMajorSelect({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (query.trim()) onChange(query.trim());
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, query, onChange]);

  const filtered = useMemo(() => {
    if (!query.trim()) return MAJORS.slice(0, 50);
    const q = query.toLowerCase();
    return MAJORS.filter((o) => o.toLowerCase().includes(q)).slice(0, 50);
  }, [query]);

  const exactMatch = MAJORS.some((m) => m.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="block relative" ref={containerRef}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 pr-9 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400"
        >
          <ChevronDown size={16} />
        </button>
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-btn border-2 border-cream-300 bg-white shadow-card max-h-60 overflow-y-auto scrollbar-hide">
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setQuery(opt); setOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm font-semibold text-navy-500 hover:bg-cream-100 transition flex items-center justify-between"
            >
              {opt}
              {value === opt && <Check size={14} className="text-fuchsia-500" />}
            </button>
          ))}
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={() => { onChange(query.trim()); setOpen(false); }}
              className="w-full px-3 py-2.5 text-left text-sm font-bold text-fuchsia-500 hover:bg-fuchsia-50 transition flex items-center gap-2 border-t border-cream-200"
            >
              <Plus size={14} />
              Use "{query.trim()}"
            </button>
          )}
          {filtered.length === 0 && !query.trim() && (
            <p className="px-3 py-3 text-sm text-navy-400/60">Start typing to search or add a custom major</p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchableUniversitySelect({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (query.trim()) onChange(query.trim());
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, query, onChange]);

  const filtered = useMemo(() => {
    return searchUniversities(query).slice(0, 50);
  }, [query]);

  const exactMatch = UNIVERSITIES.some((u) => u.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="block relative" ref={containerRef}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 pr-9 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400"
        >
          <ChevronDown size={16} />
        </button>
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-btn border-2 border-cream-300 bg-white shadow-card max-h-72 overflow-y-auto scrollbar-hide">
          {filtered.map((uni) => (
            <button
              key={uni.name}
              type="button"
              onClick={() => { onChange(uni.name); setQuery(uni.name); setOpen(false); }}
              className="w-full px-3 py-2 text-left hover:bg-cream-100 transition flex items-center gap-2.5"
            >
              <UniversityLogo name={uni.name} size={28} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-500 truncate">{uni.name}</p>
                <p className="text-xs text-navy-400">{uni.country}</p>
              </div>
              {value === uni.name && <Check size={14} className="text-fuchsia-500 shrink-0" />}
            </button>
          ))}
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={() => { onChange(query.trim()); setOpen(false); }}
              className="w-full px-3 py-2.5 text-left text-sm font-bold text-fuchsia-500 hover:bg-fuchsia-50 transition flex items-center gap-2 border-t border-cream-200"
            >
              <Plus size={14} />
              Use "{query.trim()}"
            </button>
          )}
          {filtered.length === 0 && !query.trim() && (
            <p className="px-3 py-3 text-sm text-navy-400/60">Start typing to search or add a custom university</p>
          )}
        </div>
      )}
    </div>
  );
}

function AcademicLevelSelect({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <label className="block relative">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 text-left focus:border-lavender-400 focus:outline-none transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          {value && (() => {
            const meta = ACADEMIC_LEVELS.find((l) => l.value === value);
            return meta ? <AcademicLevelIcon iconKey={meta.iconKey} size={18} className="text-fuchsia-500" /> : null;
          })()}
          <span className={value ? '' : 'text-navy-400/50'}>{value || placeholder}</span>
        </span>
        <span className="text-navy-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-btn border-2 border-cream-300 bg-white shadow-card max-h-60 overflow-y-auto scrollbar-hide">
          {ACADEMIC_LEVELS.map((opt: AcademicLevelOption) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full px-3 py-2.5 text-left hover:bg-cream-100 transition flex items-center gap-2.5"
            >
              <AcademicLevelIcon iconKey={opt.iconKey} size={20} className="text-fuchsia-500 shrink-0" />
              <span className="text-sm font-semibold text-navy-500">{opt.label}</span>
              {value === opt.value && <Check size={14} className="text-fuchsia-500 ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </label>
  );
}

function ExpandableList({ label, items, setItems, placeholder }: { label: string; items: string[]; setItems: (items: string[]) => void; placeholder: string }) {
  return (
    <div className="rounded-card border-2 border-cream-300 bg-cream-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
        <button
          onClick={() => setItems([...items, ''])}
          className="flex items-center gap-1 rounded-btn bg-lavender-400 px-3 py-1 text-xs font-bold text-white transition hover:bg-lavender-500"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                setItems(next);
              }}
              placeholder={placeholder}
              className="flex-1 rounded-btn border-2 border-cream-300 bg-white px-3 py-2 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none transition"
            />
            {items.length > 1 && (
              <button
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                className="rounded-full p-1.5 text-poppy-500 hover:bg-poppy-400/10 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
