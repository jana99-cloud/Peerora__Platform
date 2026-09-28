import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { Users, Search, Plus, X, MessageSquare, ChevronRight, GraduationCap, Calendar, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import type { StudyGroup } from '@/data/types';
import { MAJORS, UNIVERSITY_NAMES } from '@/data/postTypes';

// --- Study Groups Hub ---
export function StudyGroupsHubPage() {
  const { groups, navigate, currentUser, requireAuth } = useApp();

  return (
    <PageShell title="Study Groups">
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => navigate({ name: 'join-group' })}
          className="group flex items-center gap-4 rounded-card-lg bg-gradient-to-br from-teal-400 to-teal-500 p-6 text-left shadow-card transition hover:-translate-y-1 hover:shadow-pop"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-btn bg-white/20">
            <Search className="text-white" size={28} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Join Group</h2>
            <p className="text-sm text-white/80">Browse and join existing study groups</p>
          </div>
          <ChevronRight className="ml-auto text-white transition group-hover:translate-x-1" size={24} />
        </button>

        <button
          onClick={() => requireAuth({ name: 'create-group' })}
          className="group flex items-center gap-4 rounded-card-lg bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 p-6 text-left shadow-card transition hover:-translate-y-1 hover:shadow-pop"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-btn bg-white/20">
            <Plus className="text-white" size={28} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Create Group</h2>
            <p className="text-sm text-white/80">Start your own study group</p>
          </div>
          <ChevronRight className="ml-auto text-white transition group-hover:translate-x-1" size={24} />
        </button>
      </div>

      {/* My Groups */}
      <h2 className="mb-4 font-display text-xl font-bold text-navy-500">My Groups</h2>
      {currentUser.joinedGroupIds.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups
            .filter((g) => currentUser.joinedGroupIds.includes(g.id))
            .map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-card-lg bg-white py-16 text-center shadow-soft">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
            <Users className="text-navy-400" size={28} />
          </div>
          <p className="font-display text-lg font-bold text-navy-500">You haven't joined any groups yet</p>
          <p className="mt-1 text-sm text-navy-400">Browse groups or create your own to get started</p>
        </div>
      )}

      {/* Discover Groups */}
      <h2 className="mb-4 mt-8 font-display text-xl font-bold text-navy-500">Discover Groups</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups
          .filter((g) => !currentUser.joinedGroupIds.includes(g.id))
          .map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
      </div>
    </PageShell>
  );
}

function GroupCard({ group }: { group: StudyGroup }) {
  const { navigate } = useApp();
  return (
    <button
      onClick={() => navigate({ name: 'group-detail', groupId: group.id })}
      className="group flex flex-col gap-3 rounded-card-lg bg-white p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-btn bg-sage-300 px-3 py-1 text-xs font-bold text-white">
          {group.members.length}/{group.maxSeats} seats
        </span>
        <MessageSquare className="text-teal-500" size={18} />
      </div>
      <h3 className="font-display text-lg font-bold text-navy-500 line-clamp-1">{group.subject}</h3>
      <p className="text-sm text-navy-400 line-clamp-2">{group.description}</p>
      <div className="mt-auto flex items-center justify-between border-t border-cream-200 pt-3 text-xs font-semibold text-navy-400">
        <span className="flex items-center gap-1">
          <GraduationCap size={13} /> {group.university}
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} /> {group.major}
        </span>
      </div>
    </button>
  );
}

// --- Join Group Page ---
export function JoinGroupPage() {
  const { groups, joinGroup, leaveGroup, currentUser, navigate, searchQuery, setSearchQuery, requireAuth } = useApp();
  const [filterMajor, setFilterMajor] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');

  const filtered = groups.filter((g) => {
    if (filterMajor && g.major !== filterMajor) return false;
    if (filterUniversity && g.university !== filterUniversity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return g.subject.toLowerCase().includes(q) || g.major.toLowerCase().includes(q) || g.university.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <PageShell title="Join a Study Group">
      <BackButton label="Back to Study Groups" />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
          <input
            type="text"
            placeholder="Search by subject, major, university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-btn border-2 border-cream-300 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
          />
        </div>
        <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)} className="rounded-btn border-2 border-cream-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none">
          <option value="">All Majors</option>
          {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filterUniversity} onChange={(e) => setFilterUniversity(e.target.value)} className="rounded-btn border-2 border-cream-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none">
          <option value="">All Universities</option>
          {UNIVERSITY_NAMES.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((group) => {
          const hasJoined = currentUser.joinedGroupIds.includes(group.id);
          const isFull = group.members.length >= group.maxSeats;
          return (
            <div key={group.id} className="flex flex-col gap-3 rounded-card bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 cursor-pointer" onClick={() => navigate({ name: 'group-detail', groupId: group.id })}>
                <h3 className="font-display text-lg font-bold text-navy-500">{group.subject}</h3>
                <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-navy-400">
                  <span className="flex items-center gap-1"><GraduationCap size={12} /> {group.major}</span>
                  <span>·</span>
                  <span>{group.university}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {group.members.length}/{group.maxSeats}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasJoined ? (
                  <>
                    <PillButton variant="teal" size="sm" onClick={() => navigate({ name: 'group-chat', groupId: group.id })}>
                      <MessageSquare size={14} /> Chat
                    </PillButton>
                    <PillButton variant="white" size="sm" onClick={() => leaveGroup(group.id)}>
                      <X size={14} /> Leave
                    </PillButton>
                  </>
                ) : isFull ? (
                  <span className="rounded-btn bg-cream-200 px-4 py-2 text-xs font-bold text-navy-400">Full</span>
                ) : (
                  <PillButton variant="sage" size="sm" onClick={() => requireAuth({ name: 'group-detail', groupId: group.id })}>Join</PillButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

// --- Create Group Page ---
export function CreateGroupPage() {
  const { navigate, createGroup, currentUser } = useApp();
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState(currentUser.major);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('');
  const [maxSeats, setMaxSeats] = useState('8');

  const handleCreate = () => {
    const group: StudyGroup = {
      id: `g${Date.now()}`,
      subject: subject || 'New Study Group',
      college: college || 'General',
      major,
      university: currentUser.university,
      description: description || 'No description provided.',
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      meetingFrequency: frequency || 'TBD',
      maxSeats: parseInt(maxSeats) || 8,
      members: [
        { studentId: currentUser.id, name: currentUser.name, role: 'creator', major: currentUser.major, university: currentUser.university },
      ],
      chat: [],
    };
    createGroup(group);
    navigate({ name: 'group-detail', groupId: group.id });
  };

  return (
    <PageShell title="Create Study Group">
      <BackButton label="Back to Study Groups" />
      <div className="mx-auto max-w-lg">
        <div className="rounded-card-lg bg-white p-6 shadow-card space-y-4">
          <FormField label="College" value={college} onChange={setCollege} placeholder="e.g. Computer & Information Sciences" />
          <FormSelect label="Major" value={major} onChange={setMajor} options={MAJORS} />
          <FormField label="Subject" value={subject} onChange={setSubject} placeholder="e.g. Machine Learning Study Group" />
          <FormField label="Meeting Frequency" value={frequency} onChange={setFrequency} placeholder="e.g. Weekly — Thursdays 7pm" />
          <FormField label="Max Seats" value={maxSeats} onChange={setMaxSeats} type="number" placeholder="e.g. 8" />
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What will this group study? What's the format?"
              className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition resize-none"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <PillButton variant="white" onClick={() => navigate({ name: 'study-groups' })}>Cancel</PillButton>
            <PillButton variant="sage" onClick={handleCreate}>Create Group</PillButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// --- Group Detail Page ---
export function GroupDetailPage({ groupId }: { groupId: string }) {
  const { groups, navigate, joinGroup, leaveGroup, currentUser } = useApp();
  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <PageShell>
        <BackButton />
        <div className="rounded-card-lg bg-white p-12 text-center shadow-card">
          <p className="font-display text-xl font-bold text-navy-500">Group not found</p>
          <PillButton variant="navy" className="mt-4" onClick={() => navigate({ name: 'study-groups' })}>Back to Study Groups</PillButton>
        </div>
      </PageShell>
    );
  }

  const hasJoined = currentUser.joinedGroupIds.includes(group.id);
  const isCreator = group.creatorId === currentUser.id;
  const isFull = group.members.length >= group.maxSeats;
  const availableSeats = group.maxSeats - group.members.length;

  return (
    <PageShell>
      <BackButton label="Back to Study Groups" />
      <div className="mx-auto max-w-3xl">
        <div className="rounded-card-lg bg-gradient-to-br from-sage-400 to-teal-500 p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-2 text-white/80 mb-2">
            <GraduationCap size={18} />
            <span className="text-sm font-bold">{group.college}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{group.subject}</h1>
          <p className="mt-2 text-white/90">{group.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
            <span className="flex items-center gap-1.5"><UserIcon size={16} /> {group.major}</span>
            <span className="flex items-center gap-1.5"><GraduationCap size={16} /> {group.university}</span>
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {group.meetingFrequency}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-card-lg bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-navy-500">Members ({group.members.length})</h2>
            <div className="space-y-3">
              {group.members.map((member) => (
                <div key={member.studentId} className="flex items-center gap-3 rounded-card bg-cream-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-300 font-display text-sm font-bold text-navy-500">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-navy-500">{member.name}</p>
                    <p className="text-xs font-semibold text-navy-400">{member.major} · {member.university}</p>
                  </div>
                  <span className={`rounded-btn px-3 py-1 text-xs font-bold ${member.role === 'creator' ? 'bg-fuchsia-400 text-white' : 'bg-cream-300 text-navy-500'}`}>
                    {member.role === 'creator' ? 'Creator' : 'Member'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-card-lg bg-white p-6 shadow-card">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-sm font-bold text-navy-500">Available Seats</span>
                <span className="font-display text-2xl font-bold text-sage-600">{availableSeats}</span>
              </div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-cream-200">
                <div className="h-full bg-sage-500 transition-all" style={{ width: `${(group.members.length / group.maxSeats) * 100}%` }} />
              </div>
              <p className="mb-4 text-xs font-semibold text-navy-400">
                {group.maxSeats - availableSeats} of {group.maxSeats} seats filled
              </p>
              {isCreator ? (
                <PillButton variant="teal" className="w-full" onClick={() => navigate({ name: 'group-chat', groupId: group.id })}>
                  <MessageSquare size={18} /> Open Group Chat
                </PillButton>
              ) : hasJoined ? (
                <>
                  <PillButton variant="teal" className="w-full mb-2" onClick={() => navigate({ name: 'group-chat', groupId: group.id })}>
                    <MessageSquare size={18} /> Group Chat
                  </PillButton>
                  <PillButton variant="red" className="w-full" onClick={() => { leaveGroup(group.id); navigate({ name: 'study-groups' }); }}>
                    Leave Group
                  </PillButton>
                </>
              ) : isFull ? (
                <PillButton variant="white" className="w-full" disabled>Group is Full</PillButton>
              ) : (
                <PillButton variant="sage" className="w-full" onClick={() => joinGroup(group.id)}>Join Group</PillButton>
              )}
            </div>

            <div className="rounded-card-lg bg-white p-6 shadow-card">
              <h3 className="mb-2 font-display text-sm font-bold text-navy-500">Group Creator</h3>
              <button
                onClick={() => navigate({ name: 'student-profile', studentId: group.creatorId })}
                className="flex w-full items-center gap-3 rounded-card bg-cream-50 p-3 transition hover:bg-cream-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-400 font-display text-sm font-bold text-white">
                  {group.creatorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-navy-500">{group.creatorName}</p>
                  <p className="text-xs font-semibold text-navy-400">View profile</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// --- Group Chat Page ---
export function GroupChatPage({ groupId }: { groupId: string }) {
  const { groups, navigate, sendGroupMessage, currentUser } = useApp();
  const group = groups.find((g) => g.id === groupId);
  const [input, setInput] = useState('');

  if (!group) {
    return (
      <PageShell>
        <BackButton />
        <div className="rounded-card-lg bg-white p-12 text-center shadow-card">
          <p className="font-display text-xl font-bold text-navy-500">Group not found</p>
        </div>
      </PageShell>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendGroupMessage(group.id, {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    });
    setInput('');
  };

  return (
    <PageShell>
      <BackButton label="Back to group" />
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-500">{group.subject}</h1>
            <p className="text-sm font-semibold text-navy-400">{group.members.length} members · {group.meetingFrequency}</p>
          </div>
          <PillButton variant="white" size="sm" onClick={() => navigate({ name: 'group-detail', groupId: group.id })}>
            Group Details
          </PillButton>
        </div>

        <ChatLayout
          messages={group.chat}
          currentUserId={currentUser.id}
          members={group.members.map((m) => ({ id: m.studentId, name: m.name, role: m.role }))}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          sideTitle="Group Members"
          extraInfo={`Next meeting: ${group.meetingFrequency}`}
        />
      </div>
    </PageShell>
  );
}

// --- Shared Chat Layout (used by group chat + activity chat) ---
import type { ChatMessage } from '@/data/types';
import { Paperclip, Send } from 'lucide-react';

interface ChatMember {
  id: string;
  name: string;
  role?: string;
}

export function ChatLayout({
  messages,
  currentUserId,
  members,
  input,
  setInput,
  onSend,
  sideTitle,
  extraInfo,
}: {
  messages: ChatMessage[];
  currentUserId: string;
  members: ChatMember[];
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  sideTitle: string;
  extraInfo?: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Chat area */}
      <div className="lg:col-span-2 flex flex-col rounded-card-lg bg-white shadow-card overflow-hidden" style={{ height: '70vh' }}>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare className="mb-2 text-navy-400/40" size={32} />
              <p className="text-sm font-semibold text-navy-400">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-card px-4 py-2.5 ${isMe ? 'bg-fuchsia-500 text-white' : 'bg-cream-200 text-navy-500'}`}>
                    {!isMe && <p className="mb-0.5 text-xs font-bold text-lavender-600">{msg.senderName}</p>}
                    <p className="text-sm font-semibold">{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${isMe ? 'text-white/70' : 'text-navy-400/70'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t border-cream-200 p-3">
          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 text-navy-400 transition hover:bg-cream-200">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
            />
            <button
              onClick={onSend}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500 text-white transition hover:bg-fuchsia-600 hover:scale-105"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Members sidebar */}
      <div className="rounded-card-lg bg-white p-5 shadow-card">
        <h3 className="mb-3 font-display text-sm font-bold text-navy-500">{sideTitle}</h3>
        {extraInfo && (
          <div className="mb-3 rounded-card bg-teal-300/30 p-3">
            <p className="text-xs font-semibold text-teal-600">{extraInfo}</p>
          </div>
        )}
        <div className="space-y-2">
          {members.map((m) => (
            <label key={m.id} className="flex items-center gap-2 rounded-card bg-cream-50 p-2.5 cursor-pointer transition hover:bg-cream-200">
              <input type="checkbox" className="accent-fuchsia-500" defaultChecked />
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender-300 font-display text-xs font-bold text-navy-500">
                {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <span className="flex-1 text-sm font-semibold text-navy-500">{m.name}</span>
              {m.role === 'creator' && <span className="rounded-btn bg-fuchsia-400 px-2 py-0.5 text-[10px] font-bold text-white">Creator</span>}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Reusable form helpers ---
function FormField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
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

function FormSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </label>
  );
}
