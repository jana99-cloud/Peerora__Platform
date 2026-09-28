import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { Mail, Phone, MapPin, GraduationCap, Shield, MessageSquare, Ban, Flag, BookOpen, Award, Star, Settings, MessagesSquare, Wrench, Edit3, Save, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { ConversationPurposeModal } from '@/components/ConversationPurposeModal';
import { UniversityLogo, UniversityDisplay } from '@/components/UniversityLogo';
import { AcademicLevelIconByValue } from '@/components/AcademicLevelIcons';
import type { Post, ConversationDuration } from '@/data/types';

export function StudentProfilePage({ studentId }: { studentId: string }) {
  const { students, currentUser, navigate, blockUser, unblockUser, blockedUserIds, getUniversityActivityPoints, posts, startConversation, updateProfile, logout } = useApp() as any;
  const student = students.find((s: any) => s.id === studentId) ?? currentUser;
  
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  
  // States for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editMajor, setEditMajor] = useState(student.major);
  const [editCountry, setEditCountry] = useState(student.country);
  const [editPhone, setEditPhone] = useState(student.phone);
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
        country: editCountry,
        phone: editPhone,
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
      <div className="mx-auto max-w-3xl">
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-400 via-fuchsia-400 to-peach-400 p-6 shadow-card sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 squiggle-bg opacity-20" />
          
          {/* Edit / Save Button for Owner */}
          {isMe && (
            <div className="absolute right-6 top-6 z-10 flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1.5 rounded-pill bg-white px-4 py-2 text-xs font-bold text-navy-500 shadow-md transition hover:bg-cream-100"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 rounded-pill bg-black/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-black/30"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-pill bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/30"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>
          )}

          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/25 font-display text-3xl font-bold text-white shadow-pop shrink-0">
              {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            
            <div className="flex-1 text-center sm:text-left w-full">
              {isEditing ? (
                <div className="space-y-2 max-w-md">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl bg-white/20 px-3 py-1 font-display text-xl font-bold text-white placeholder-white/60 outline-none border border-white/40"
                    placeholder="Full Name"
                  />
                  <p className="font-body text-white/90">@{student.username}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <input
                      type="text"
                      value={editMajor}
                      onChange={(e) => setEditMajor(e.target.value)}
                      className="rounded-xl bg-white/25 px-3 py-1 text-xs font-bold text-white outline-none border border-white/40 placeholder-white/60"
                      placeholder="Major"
                    />
                    <input
                      type="text"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="rounded-xl bg-white/25 px-3 py-1 text-xs font-bold text-white outline-none border border-white/40 placeholder-white/60"
                      placeholder="Country"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{student.name}</h1>
                  <p className="mt-1 font-body text-white/90">@{student.username}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <span className="flex items-center gap-1.5 rounded-pill bg-white/20 px-3 py-1 text-xs font-bold text-white">
                      <GraduationCap size={14} /> {student.major}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-pill bg-white/20 px-3 py-1 text-xs font-bold text-white">
                      <MapPin size={14} /> {student.country}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-pill bg-white/20 px-3 py-1 text-xs font-bold text-white">
                      <AcademicLevelIconByValue value={student.level} size={14} className="text-white" /> {student.level}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Contact */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-bold text-navy-500">Contact</h2>
              <div className="space-y-2">
                <ContactRow icon={<Mail size={16} />} label="Email" value={canSeeEmail ? student.email : 'Hidden by privacy settings'} hidden={!canSeeEmail} />
                
                {isEditing ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-3">
                    <span className="text-navy-400"><Phone size={16} /></span>
                    <span className="text-xs font-bold uppercase text-navy-400 w-20">Phone</span>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="flex-1 rounded-xl border border-cream-300 bg-white px-3 py-1 text-sm font-semibold text-navy-500 outline-none"
                    />
                  </div>
                ) : (
                  <ContactRow icon={<Phone size={16} />} label="Phone" value={canSeePhone ? student.phone : 'Hidden by privacy settings'} hidden={!canSeePhone} />
                )}

                <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-3">
                  <UniversityLogo name={student.university} size={32} />
                  <span className="text-xs font-bold uppercase text-navy-400 w-20">University</span>
                  <span className="text-sm font-semibold text-navy-500 flex-1">{student.university}</span>
                </div>
              </div>
            </div>

            {/* University Activity Points */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-bold text-navy-500">University Activity</h2>
              <div className="flex items-center gap-3 rounded-2xl bg-daffodil-300/20 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-daffodil-400 text-white">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy-500">{getUniversityActivityPoints(student.university).toLocaleString()}</p>
                  <p className="text-xs font-semibold text-navy-400">Activity Points from {student.university}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy-500">
                <Star size={18} className="text-daffodil-500" /> Skills
              </h2>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 p-3 text-sm font-semibold text-navy-500 outline-none"
                    placeholder="Skills separated by commas (e.g. React, TypeScript, Python)"
                  />
                  <p className="mt-1 text-xs text-navy-400/70">Separate skills using commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill: string) => (
                    <span key={skill} className="rounded-pill bg-sky-300/50 px-3 py-1 text-xs font-bold text-sky-600">{skill}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Interests */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy-500">
                <Star size={18} className="text-fuchsia-500" /> Interests
              </h2>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editInterests}
                    onChange={(e) => setEditInterests(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 p-3 text-sm font-semibold text-navy-500 outline-none"
                    placeholder="Interests separated by commas (e.g. AI, Cloud, Cybersecurity)"
                  />
                  <p className="mt-1 text-xs text-navy-400/70">Separate interests using commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest: string) => (
                    <span key={interest} className="rounded-pill bg-fuchsia-300/50 px-3 py-1 text-xs font-bold text-fuchsia-600">{interest}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Expertise */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy-500">
                <Award size={18} className="text-sage-500" /> Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {student.expertise.map((exp: string) => (
                  <span key={exp} className="rounded-pill bg-sage-300/50 px-3 py-1 text-xs font-bold text-sage-600">{exp}</span>
                ))}
              </div>
            </div>

            {/* Courses */}
            {student.courses.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-card">
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy-500">
                  <BookOpen size={18} className="text-teal-500" /> Courses
                </h2>
                <div className="flex flex-wrap gap-2">
                  {student.courses.map((course: string) => (
                    <span key={course} className="rounded-pill bg-teal-300/50 px-3 py-1 text-xs font-bold text-teal-600">{course}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {isMe ? (
              <div className="rounded-3xl bg-white p-6 shadow-card">
                <h3 className="mb-3 font-display text-sm font-bold text-navy-500">My Account</h3>
                <div className="space-y-2">
                  <PillButton variant="navy" className="w-full" onClick={() => navigate({ name: 'privacy' })}>
                    <Shield size={16} /> Privacy Settings
                  </PillButton>
                  <PillButton variant="white" className="w-full" onClick={() => navigate({ name: 'study-groups' })}>
                    My Study Groups
                  </PillButton>
                  <PillButton variant="white" className="w-full" onClick={() => navigate({ name: 'find-students' })}>
                    Find Students
                  </PillButton>
                  
                  {/* زر تسجيل الخروج الفعّال */}
                  <PillButton 
                    variant="red" 
                    className="w-full mt-2" 
                    onClick={() => {
                      localStorage.removeItem('currentUser');
                      localStorage.removeItem('token');
                      sessionStorage.clear();
                      if (logout) {
                        try { logout(); } catch (e) { /* ignore */ }
                      }
                      navigate({ name: 'home' });
                      window.location.reload();
                    }}
                  >
                    <LogOut size={16} /> Log Out
                  </PillButton>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-6 shadow-card">
                <h3 className="mb-3 font-display text-sm font-bold text-navy-500">Actions</h3>
                <div className="space-y-2">
                  <PillButton variant="primary" className="w-full" onClick={() => setShowConversationModal(true)}>
                    <MessagesSquare size={16} /> Start Conversation
                  </PillButton>
                  <button
                    onClick={() => setShowReport(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-pill border-2 border-poppy-400/30 bg-white py-3 text-sm font-bold uppercase text-poppy-500 transition hover:bg-poppy-400/10"
                  >
                    <Flag size={16} /> Report User
                  </button>
                  {isBlocked ? (
                    <PillButton variant="sage" className="w-full" onClick={() => unblockUser(student.id)}>
                      Unblock User
                    </PillButton>
                  ) : (
                    <button
                      onClick={() => setShowBlock(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-pill border-2 border-navy-400/30 bg-white py-3 text-sm font-bold uppercase text-navy-500 transition hover:bg-cream-200"
                    >
                      <Ban size={16} /> Block User
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Privacy indicator */}
            <div className="rounded-3xl bg-cream-200 p-4">
              <div className="flex items-center gap-2 text-navy-400">
                <Shield size={16} />
                <span className="text-xs font-bold">
                  {student.privacy.profileVisibility === 'public' ? 'Public Profile' : 'Private Profile'}
                </span>
              </div>
              <p className="mt-1 text-xs text-navy-400/80">
                Messaging: {student.privacy.messagingPermission.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal open={showReport} onClose={() => setShowReport(false)} title="Report User">
        <p className="mb-4 text-sm text-navy-400">Why are you reporting {student.name}?</p>
        <div className="space-y-2">
          {['Harassment or bullying', 'Spam or fake account', 'Inappropriate behavior', 'Academic dishonesty', 'Other'].map((reason) => (
            <button
              key={reason}
              onClick={() => { setShowReport(false); }}
              className="w-full rounded-2xl border-2 border-cream-300 bg-cream-50 px-4 py-3 text-left text-sm font-semibold text-navy-500 transition hover:border-poppy-400 hover:bg-poppy-400/5"
            >
              {reason}
            </button>
          ))}
        </div>
      </Modal>

      {/* Block Modal */}
      <Modal open={showBlock} onClose={() => setShowBlock(false)} title="Block User">
        <p className="mb-4 text-sm text-navy-400">
          Blocking {student.name} will prevent them from seeing your profile, messaging you, or appearing in your searches. You can unblock them anytime.
        </p>
        <div className="flex justify-end gap-3">
          <PillButton variant="white" onClick={() => setShowBlock(false)}>Cancel</PillButton>
          <PillButton variant="red" onClick={() => { blockUser(student.id); setShowBlock(false); }}>Block</PillButton>
        </div>
      </Modal>

      <ConversationPurposeModal
        open={showConversationModal}
        onClose={() => setShowConversationModal(false)}
        post={peerConversationPost}
        onStart={handleStartPeerConversation}
      />
    </PageShell>
  );
}

function ContactRow({ icon, label, value, hidden }: { icon: React.ReactNode; label: string; value: string; hidden?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-3">
      <span className="text-navy-400">{icon}</span>
      <span className="text-xs font-bold uppercase text-navy-400 w-20">{label}</span>
      <span className={`text-sm font-semibold ${hidden ? 'text-navy-400/50 italic' : 'text-navy-500'}`}>{value}</span>
    </div>
  );
}
