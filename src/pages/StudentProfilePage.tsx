import { useApp } from '@/context/AppContext';
import { PageShell } from '@/components/Nav';
import { Save, X, Search, Shield, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';

export function EditProfilePage() {
  const { currentUser, navigate } = useApp();
  
  // حالات تخزين البيانات
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username || 'new_student');
  const [major, setMajor] = useState(currentUser.major);
  const [university, setUniversity] = useState(currentUser.university);
  const [academicLevel, setAcademicLevel] = useState(currentUser.level || 'First Year');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');

  // مهارات واهتمامات
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.name = name;
    currentUser.username = username;
    currentUser.major = major;
    currentUser.university = university;
    currentUser.level = academicLevel;
    currentUser.phone = phone;
    currentUser.email = email;
    currentUser.skills = skills;
    currentUser.interests = interests;

    navigate({ name: 'profile', studentId: currentUser.id });
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl py-6">
        <div className="relative rounded-3xl bg-white p-8 shadow-card">
          
          {/* Top Actions: Save & Close */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-full bg-navy-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-navy-600 transition"
            >
              <Save size={16} /> Save
            </button>
            <button
              type="button"
              onClick={() => navigate({ name: 'profile', studentId: currentUser.id })}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-navy-500 hover:bg-cream-200 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Avatar & Username Preview */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-lavender-300/40 font-display text-3xl font-bold text-navy-500 shadow-sm mb-3">
              {name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'ت'}
            </div>
            <div className="w-48 rounded-full border border-cream-300 bg-cream-50 py-2 text-center text-sm font-semibold text-navy-500 mb-1">
              {name || 'ت'}
            </div>
            <span className="text-xs text-navy-400">@{username}</span>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Major */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">MAJOR</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-navy-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Search major..."
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 pl-11 pr-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* University */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">UNIVERSITY</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-navy-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Search university..."
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 pl-11 pr-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Academic Level */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">ACADEMIC LEVEL</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 px-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none appearance-none"
              >
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">PHONE NUMBER</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 px-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 px-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="new_student"
                className="w-full rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 px-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none"
                required
              />
            </div>

            {/* Student Skills */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">STUDENT SKILLS</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g. Python, React)"
                  className="flex-1 rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 px-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center gap-1 rounded-2xl bg-fuchsia-500 px-5 py-3.5 text-xs font-bold text-white hover:bg-fuchsia-600 transition"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <span key={s} className="rounded-pill bg-sky-300/40 px-3 py-1 text-xs font-bold text-sky-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Student Interests */}
            <div>
              <label className="block text-xs font-bold uppercase text-navy-500 mb-2">STUDENT INTERESTS</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest (e.g. AI, Cloud)"
                  className="flex-1 rounded-2xl border border-cream-300 bg-cream-50/50 py-3.5 px-4 text-sm font-semibold text-navy-500 focus:border-navy-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="flex items-center gap-1 rounded-2xl bg-fuchsia-500 px-5 py-3.5 text-xs font-bold text-white hover:bg-fuchsia-600 transition"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((i) => (
                  <span key={i} className="rounded-pill bg-fuchsia-300/40 px-3 py-1 text-xs font-bold text-fuchsia-700">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {/* Account Management */}
            <div className="pt-6 border-t border-cream-300">
              <label className="block text-xs font-bold uppercase text-navy-500 mb-3">Account Management</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate({ name: 'privacy' })}
                  className="flex items-center justify-center gap-2 rounded-full bg-navy-500 py-3.5 text-xs font-bold uppercase text-white hover:bg-navy-600 transition shadow-sm"
                >
                  <Shield size={16} /> PRIVACY SETTINGS
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'welcome' })}
                  className="flex items-center justify-center gap-2 rounded-full bg-poppy-500 py-3.5 text-xs font-bold uppercase text-white hover:bg-poppy-600 transition shadow-sm"
                >
                  <LogOut size={16} /> LOG OUT
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </PageShell>
  );
}