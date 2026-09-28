import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { Mail, Phone, MapPin, GraduationCap, Shield, Award, Star, MessagesSquare, Edit3, Save, X, LogOut, Camera, Plus, BookOpen, Heart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { ConversationPurposeModal } from '@/components/ConversationPurposeModal';
import { UniversityLogo } from '@/components/UniversityLogo';
import { AcademicLevelIconByValue } from '@/components/AcademicLevelIcons';
import type { Post, ConversationDuration } from '@/data/types';

// يمكنك لصق التخصصات والجامعات الخاصة بكِ هنا أو إرسالها لي لأقوم بإضافتها فوراً
const UNIVERSITIES = [
  'Jazan University',
  'King Saud University',
  'King Abdulaziz University',
  'Imam Mohammad Ibn Saud Islamic University',
  'King Fahd University of Petroleum and Minerals',
  'Princess Nourah bint Abdulrahman University'
];

const MAJORS = [
  'Computer Science',
  'Software Engineering',
  'Information Systems',
  'Cybersecurity',
  'Artificial Intelligence',
  'Data Analytics',
  'Computer Engineering & Networks'
];

// المستويات الدراسية المطابقة للصورة تماماً مع أيقوناتها
const ACADEMIC_LEVELS = [
  { label: 'First Year', icon: <Sparkles size={16} className="text-daffodil-500" /> },
  { label: 'Second Year', icon: <BookOpen size={16} className="text-fuchsia-500" /> },
  { label: 'Third Year', icon: <Award size={16} className="text-sky-500" /> },
  { label: 'Fourth Year', icon: <Star size={16} className="text-sage-500" /> },
  { label: 'Fifth Year', icon: <Heart size={16} className="text-poppy-500" /> },
  { label: 'Graduate', icon: <GraduationCap size={16} className="text-navy-500" /> }
];

export function StudentProfilePage({ studentId }: { studentId: string }) {
  const { students, currentUser, navigate, blockUser, unblockUser, blockedUserIds, getUniversityActivityPoints, posts, startConversation, updateProfile } = useApp() as any;
  const student = students.find((s: any) => s.id === studentId) ?? currentUser;
  
  const [showConversationModal, setShowConversationModal] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editMajor, setEditMajor] = useState(student.major || 'Computer Science');
  const [editUniversity, setEditUniversity] = useState(student.university || 'Jazan University');
  const [editLevel, setEditLevel] = useState(student.level || 'Second Year');
  const [editPhone, setEditPhone] = useState(student.phone || '');
  const [editEmail, setEditEmail] = useState(student.email || '');
  const [editUsername, setEditUsername] = useState(student.username || '');
  
  const [skillsList, setSkillsList] = useState<string[]>(student.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [interestsList, setInterestsList] = useState<string[]>(student.interests || []);
  const [newInterestInput, setNewInterestInput] = useState('');

  const isMe = student.id === currentUser.id;
  const isBlocked = blockedUserIds.includes(student.id);

  const canSeeEmail = isMe || student.privacy.emailVisibility === 'everyone' || (student.privacy.emailVisibility === 'same-university' && student.university === currentUser.university);
  const canSeePhone = isMe || student.privacy.phoneVisible;

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skillsList.includes(newSkillInput.trim())) {
      setSkillsList([...skillsList, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !interestsList.includes(newInterestInput.trim())) {
      setInterestsList([...interestsList, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterestsList(interestsList.filter(i => i !== interestToRemove));
  };

  const handleSaveProfile = () => {
    if (updateProfile) {
      updateProfile({
        name: editName,
        major: editMajor,
        university: editUniversity,
        level: editLevel,
        phone: editPhone,
        email: editEmail,
        username: editUsername,
        skills: skillsList,
        interests: interestsList,
      });
    }
    setIsEditing(false);
  };

  const peerConversationPost: Post = {
    id: `peer-${student.id}`,
    type: 'project',
    title: `Collaboration with ${student.name}`,
    major: student.major,
    university: student.university,
    country: student.country,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    membersNeeded: 2,
    membersJoined: 2,
    description: `Peer collaboration discussion with ${student.name}. Explore shared academic interests, skills, and potential project opportunities.`,
    authorId: student.id,
    authorName: student.name,
    tags: student.interests.slice(0, 3),
    skillsNeeded: student.skills.slice(0, 5),
    contributors: [
      { studentId: student.id, name: student.name, major: student.major, university: student.university },
      { studentId: currentUser.id, name: currentUser.name, major: currentUser.major, university: currentUser.university },
    ],
    activityFormat: 'online',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const handleStartPeerConversation = (purpose: string, durationMinutes: ConversationDuration) => {
    setShowConversationModal(false);
    navigate({ name: 'activity-chat', postId: peerConversationPost.id });
    startConversation(peerConversationPost.id, purpose, durationMinutes);
  };

  return (
    <PageShell>
      {!isMe && <BackButton label="Back" />}
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-3xl bg-white p-6 shadow-card space-y-6">
          
          <div className="flex flex-col items-center border-b border-cream-200 pb-6 relative">
            {isMe && (
              <div className="absolute right-0 top-0 flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1.5 rounded-pill bg-navy-500 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-navy-600"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 rounded-pill bg-gray-200 px-3 py-2 text-xs font-bold text-navy-500 transition hover:bg-gray-300"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 rounded-pill bg-lavender-100 px-4 py-2 text-xs font-bold text-navy-600 shadow-sm transition hover:bg-lavender-200"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                )}
              </div>
            )}

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-lavender-200 font-display text-3xl font-bold text-navy-600 shadow-sm">
              {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-3 text-center rounded-xl border border-cream-300 bg-cream-50 px-3 py-1 font-display text-lg font-bold text-navy-500 outline-none"
              />
            ) : (
              <h1 className="mt-3 font-display text-xl font-bold text-navy-500">{student.name}</h1>
            )}
            <p className="text-xs font-semibold text-navy-400">@{student.username}</p>
          </div>

          <div className="space-y-4">
            {/* Major */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Major</label>
              {isEditing ? (
                <select
                  value={editMajor}
                  onChange={(e) => setEditMajor(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                >
                  {MAJORS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <GraduationCap size={16} className="text-navy-400" />
                  <span>{student.major}</span>
                </div>
              )}
            </div>

            {/* University */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">University</label>
              {isEditing ? (
                <select
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <UniversityLogo name={student.university} size={20} />
                  <span>{student.university}</span>
                </div>
              )}
            </div>

            {/* Academic Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Academic Level</label>
              {isEditing ? (
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl.label} value={lvl.label}>{lvl.label}</option>
                  ))}
                </select>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <AcademicLevelIconByValue value={student.level} size={16} />
                  <span>{student.level}</span>
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <Phone size={16} className="text-navy-400" />
                  <span>{canSeePhone ? student.phone : 'Hidden by privacy settings'}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="name@example.com"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <Mail size={16} className="text-navy-400" />
                  <span>{canSeeEmail ? student.email : 'Hidden by privacy settings'}</span>
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="student_name"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500">
                  @{student.username}
                </div>
              )}
            </div>

            {/* Student Skills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Student Skills</label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }}}
                      className="flex-1 rounded-2xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                      placeholder="Add a skill (e.g. Python, React)"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="flex items-center gap-1 rounded-2xl bg-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-fuchsia-600 transition"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-cream-50 rounded-2xl border border-cream-200">
                    {skillsList.map((skill) => (
                      <span key={skill} className="flex items-center gap-1 rounded-pill bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-sky-500 hover:text-sky-800 ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-cream-200 bg-cream-50 p-3">
                  {student.skills.map((skill: string) => (
                    <span key={skill} className="rounded-pill bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">{skill}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Student Interests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Student Interests</label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterestInput}
                      onChange={(e) => setNewInterestInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); }}}
                      className="flex-1 rounded-2xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                      placeholder="Add an interest (e.g. AI, Cloud)"
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="flex items-center gap-1 rounded-2xl bg-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-fuchsia-600 transition"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-cream-50 rounded-2xl border border-cream-200">
                    {interestsList.map((interest) => (
                      <span key={interest} className="flex items-center gap-1 rounded-pill bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">
                        {interest}
                        <button type="button" onClick={() => handleRemoveInterest(interest)} className="text-fuchsia-500 hover:text-fuchsia-800 ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-cream-200 bg-cream-50 p-3">
                  {student.interests.map((interest: string) => (
                    <span key={interest} className="rounded-pill bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">{interest}</span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Account Management & Log Out */}
          {isMe && (
            <div className="border-t border-cream-200 pt-6 space-y-3">
              <h3 className="font-display text-sm font-bold text-navy-500">Account Management</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <PillButton variant="navy" className="w-full" onClick={() => navigate({ name: 'privacy' })}>
                  <Shield size={16} /> Privacy Settings
                </PillButton>
                
                <PillButton 
                  variant="red" 
                  className="w-full" 
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = window.location.origin;
                  }}
                >
                  <LogOut size={16} /> Log Out
                </PillButton>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageShell>
  );
}