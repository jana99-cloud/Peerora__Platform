import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { Mail, Phone, MapPin, GraduationCap, Shield, Award, Star, MessagesSquare, Edit3, Save, X, LogOut, Camera } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { ConversationPurposeModal } from '@/components/ConversationPurposeModal';
import { UniversityLogo } from '@/components/UniversityLogo';
import { AcademicLevelIconByValue } from '@/components/AcademicLevelIcons';
import type { Post, ConversationDuration } from '@/data/types';

export function StudentProfilePage({ studentId }: { studentId: string }) {
  const { students, currentUser, navigate, blockUser, unblockUser, blockedUserIds, getUniversityActivityPoints, posts, startConversation, updateProfile, logout } = useApp() as any;
  const student = students.find((s: any) => s.id === studentId) ?? currentUser;
  
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  
  // States for editing profile fields (مطابق للصورة)
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editMajor, setEditMajor] = useState(student.major);
  const [editUniversity, setEditUniversity] = useState(student.university);
  const [editLevel, setEditLevel] = useState(student.level);
  const [editPhone, setEditPhone] = useState(student.phone);
  const [editEmail, setEditEmail] = useState(student.email);
  const [editUsername, setEditUsername] = useState(student.username);
  const [editSkills, setEditSkills] = useState(student.skills.join(', '));
  const [editInterests, setEditInterests] = useState(student.interests.join(', '));

  const isMe = student.id === currentUser.id;
  const isBlocked = blockedUserIds.includes(student.id);

  const canSeeEmail = isMe || student.privacy.emailVisibility === 'everyone' || (student.privacy.emailVisibility === 'same-university' && student.university === currentUser.university);
  const canSeePhone = isMe || student.privacy.phoneVisible;

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
        skills: editSkills.split(',').map((s: string) => s.trim()).filter(Boolean),
        interests: editInterests.split(',').map((i: string) => i.trim()).filter(Boolean),
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
        
        {/* Profile Card Container */}
        <div className="rounded-3xl bg-white p-6 shadow-card space-y-6">
          
          {/* Avatar & Edit Header */}
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
              {isEditing && (
                <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy-500 text-white shadow-md">
                  <Camera size={14} />
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-xl font-bold text-navy-500">{student.name}</h1>
            <p className="text-xs font-semibold text-navy-400">@{student.username}</p>
          </div>

          {/* Form Fields matching the design */}
          <div className="space-y-4">
            
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Student Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500">
                  {student.name}
                </div>
              )}
            </div>

            {/* Major (Select/Input) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Major</label>
              {isEditing ? (
                <select
                  value={editMajor}
                  onChange={(e) => setEditMajor(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Information Systems">Information Systems</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500">
                  {student.major}
                </div>
              )}
            </div>

            {/* University (Select/Input) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">University</label>
              {isEditing ? (
                <select
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                >
                  <option value="Jazan University">Jazan University</option>
                  <option value="King Saud University">King Saud University</option>
                  <option value="King Abdulaziz University">King Abdulaziz University</option>
                  <option value="Imam Mohammad Ibn Saud Islamic University">Imam Mohammad Ibn Saud Islamic University</option>
                </select>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <UniversityLogo name={student.university} size={20} />
                  <span>{student.university}</span>
                </div>
              )}
            </div>

            {/* Academic Level (Select) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Academic Level</label>
              {isEditing ? (
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
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
                  placeholder="+966 50 000 0000"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500">
                  {canSeePhone ? student.phone : 'Hidden by privacy settings'}
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
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500">
                  {canSeeEmail ? student.email : 'Hidden by privacy settings'}
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Student Skills</label>
                {isEditing && <span className="text-xs font-bold text-fuchsia-500">+ Add</span>}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="e.g. Python, React, Machine Learning"
                />
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Student Interests</label>
                {isEditing && <span className="text-xs font-bold text-fuchsia-500">+ Add</span>}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editInterests}
                  onChange={(e) => setEditInterests(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="e.g. AI, Cloud, Cybersecurity"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-cream-200 bg-cream-50 p-3">
                  {student.interests.map((interest: string) => (
                    <span key={interest} className="rounded-pill bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">{interest}</span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Account Actions & Log Out for Owner */}
          {isMe && (
            <div className="border-t border-cream-200 pt-6 space-y-3">
              <h3 className="font-display text-sm font-bold text-navy-500">Account Management</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <PillButton variant="navy" className="w-full" onClick={() => navigate({ name: 'privacy' })}>
                  <Shield size={16} /> Privacy Settings
                </PillButton>
                
                {/* زر تسجيل الخروج الإلزامي */}
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

          {/* Actions for other users */}
          {!isMe && (
            <div className="border-t border-cream-200 pt-6 space-y-2">
              <PillButton variant="primary" className="w-full" onClick={() => setShowConversationModal(true)}>
                <MessagesSquare size={16} /> Start Conversation
              </PillButton>
            </div>
          )}

        </div>
      </div>

      <ConversationPurposeModal
        open={showConversationModal}
        onClose={() => setShowConversationModal(false)}
        post={peerConversationPost}
        onStart={handleStartPeerConversation}
      />
    </PageShell>
  );
}