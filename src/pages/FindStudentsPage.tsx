import { useApp } from '@/context/AppContext';
import { PageShell } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { Search, MapPin, X, Users, Award } from 'lucide-react';
import { useState, useMemo } from 'react';
import { MAJORS, UNIVERSITY_NAMES, COUNTRIES, ACADEMIC_LEVEL_VALUES } from '@/data/postTypes';
import type { Student } from '@/data/types';
import { AcademicLevelIconByValue } from '@/components/AcademicLevelIcons';
import { UniversityLogo, UniversityDisplay } from '@/components/UniversityLogo';

interface FilterState {
  major: string;
  university: string;
  country: string;
  level: string;
  skill: string;
  interest: string;
  course: string;
  expertise: string;
}

const EMPTY_FILTERS: FilterState = {
  major: '', university: '', country: '', level: '', skill: '', interest: '', course: '', expertise: '',
};

export function FindStudentsPage() {
  const { students, currentUser, navigate, blockedUserIds, getUniversityActivityPoints } = useApp();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.skills.forEach((sk) => set.add(sk)));
    return Array.from(set).sort();
  }, [students]);

  const allInterests = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.interests.forEach((i) => set.add(i)));
    return Array.from(set).sort();
  }, [students]);

  const allCourses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.courses.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [students]);

  const allExpertise = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.expertise.forEach((e) => set.add(e)));
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (s.id === currentUser.id) return false;
      if (blockedUserIds.includes(s.id)) return false;
      if (filters.major && s.major !== filters.major) return false;
      if (filters.university && s.university !== filters.university) return false;
      if (filters.country && s.country !== filters.country) return false;
      if (filters.level && s.level !== filters.level) return false;
      if (filters.skill && !s.skills.some((sk) => sk.toLowerCase().includes(filters.skill.toLowerCase()))) return false;
      if (filters.interest && !s.interests.some((i) => i.toLowerCase().includes(filters.interest.toLowerCase()))) return false;
      if (filters.course && !s.courses.some((c) => c.toLowerCase().includes(filters.course.toLowerCase()))) return false;
      if (filters.expertise && !s.expertise.some((e) => e.toLowerCase().includes(filters.expertise.toLowerCase()))) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.major.toLowerCase().includes(q) ||
          s.university.toLowerCase().includes(q) ||
          s.skills.some((sk) => sk.toLowerCase().includes(q)) ||
          s.interests.some((i) => i.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [students, currentUser, blockedUserIds, filters, search]);

  const activeFilterEntries: { key: keyof FilterState; label: string; value: string }[] = useMemo(() => {
    const entries: { key: keyof FilterState; label: string; value: string }[] = [];
    if (filters.country) entries.push({ key: 'country', label: filters.country, value: filters.country });
    if (filters.university) entries.push({ key: 'university', label: filters.university, value: filters.university });
    if (filters.major) entries.push({ key: 'major', label: filters.major, value: filters.major });
    if (filters.level) entries.push({ key: 'level', label: filters.level, value: filters.level });
    if (filters.skill) entries.push({ key: 'skill', label: `Skill: ${filters.skill}`, value: filters.skill });
    if (filters.interest) entries.push({ key: 'interest', label: `Interest: ${filters.interest}`, value: filters.interest });
    if (filters.course) entries.push({ key: 'course', label: `Course: ${filters.course}`, value: filters.course });
    if (filters.expertise) entries.push({ key: 'expertise', label: `Expertise: ${filters.expertise}`, value: filters.expertise });
    return entries;
  }, [filters]);

  const hasFilters = activeFilterEntries.length > 0 || search.trim() !== '';

  const removeFilter = (key: keyof FilterState) => {
    setFilters({ ...filters, [key]: '' });
  };

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  return (
    <PageShell title="Find Students">
      {/* Search hero */}
      <div className="mb-6 rounded-card-lg bg-gradient-to-br from-sky-400 to-teal-500 p-6 shadow-card">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Find Students Worldwide</h1>
        <p className="mt-1 text-white/90">Discover peers with matching interests, skills, and goals</p>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, skill, interest, university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-btn border-0 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-navy-500 placeholder:text-navy-400/60 focus:outline-none focus:ring-4 focus:ring-white/30 transition"
          />
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterEntries.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeFilterEntries.map((entry) => (
            <span
              key={entry.key}
              className="flex items-center gap-1.5 rounded-btn bg-fuchsia-500 px-3 py-1.5 text-xs font-bold text-white shadow-pop animate-pop-in"
            >
              {entry.label}
              <button
                onClick={() => removeFilter(entry.key)}
                className="ml-0.5 rounded-full hover:bg-white/20 p-0.5 transition"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 rounded-btn bg-poppy-400 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-poppy-500"
          >
            <X size={14} /> Clear All
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterSelect value={filters.country} onChange={(v) => setFilters({ ...filters, country: v })} options={COUNTRIES} placeholder="Country" />
        <FilterSelect value={filters.university} onChange={(v) => setFilters({ ...filters, university: v })} options={UNIVERSITY_NAMES} placeholder="University" />
        <FilterSelect value={filters.major} onChange={(v) => setFilters({ ...filters, major: v })} options={MAJORS} placeholder="Major" />
        <FilterSelect value={filters.level} onChange={(v) => setFilters({ ...filters, level: v })} options={ACADEMIC_LEVEL_VALUES} placeholder="Academic Year" />
        <FilterSelect value={filters.skill} onChange={(v) => setFilters({ ...filters, skill: v })} options={allSkills} placeholder="Skill" />
        <FilterSelect value={filters.interest} onChange={(v) => setFilters({ ...filters, interest: v })} options={allInterests} placeholder="Interest" />
        <FilterSelect value={filters.course} onChange={(v) => setFilters({ ...filters, course: v })} options={allCourses} placeholder="Course" />
        <FilterSelect value={filters.expertise} onChange={(v) => setFilters({ ...filters, expertise: v })} options={allExpertise} placeholder="Expertise" />
      </div>

      {/* Results */}
      <p className="mb-4 text-sm font-semibold text-navy-400">{filtered.length} students found</p>
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} activityPoints={getUniversityActivityPoints(student.university)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-card-lg bg-white py-16 text-center shadow-soft">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
            <Users className="text-navy-400" size={28} />
          </div>
          <p className="font-display text-lg font-bold text-navy-500">No students match your filters</p>
          <p className="mt-1 text-sm text-navy-400">Try removing some filters or broadening your search</p>
          {hasFilters && (
            <PillButton variant="white" size="sm" className="mt-4" onClick={clearAll}>Clear All Filters</PillButton>
          )}
        </div>
      )}
    </PageShell>
  );
}

function StudentCard({ student, activityPoints }: { student: Student; activityPoints: number }) {
  const { navigate } = useApp();
  const matchingInterests = student.interests.slice(0, 3);
  return (
    <button
      onClick={() => navigate({ name: 'student-profile', studentId: student.id })}
      className="group flex flex-col gap-3 rounded-card-lg bg-white p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lavender-300 font-display text-lg font-bold text-navy-500">
          {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold text-navy-500 truncate">{student.name}</h3>
          <p className="text-xs font-semibold text-navy-400 truncate">{student.major}</p>
          {student.level && (
            <p className="flex items-center gap-1 text-xs font-bold text-fuchsia-600">
              <AcademicLevelIconByValue value={student.level} size={14} className="text-fuchsia-500" />
              {student.level}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {matchingInterests.map((interest) => (
          <span key={interest} className="rounded-btn bg-sky-300/50 px-2.5 py-0.5 text-xs font-bold text-sky-600">
            {interest}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-cream-200 pt-3">
        <UniversityLogo name={student.university} size={24} />
        <span className="text-xs font-semibold text-navy-400 truncate flex-1">{student.university}</span>
      </div>
      <div className="flex items-center justify-between text-xs font-semibold text-navy-400">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {student.country}
        </span>
        <span className="flex items-center gap-1 rounded-btn bg-daffodil-300/40 px-2 py-0.5 text-daffodil-600 font-bold">
          <Award size={12} /> {activityPoints.toLocaleString()} pts
        </span>
      </div>
    </button>
  );
}

function FilterSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-btn border-2 border-cream-300 bg-white px-4 py-2 text-xs font-bold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}
