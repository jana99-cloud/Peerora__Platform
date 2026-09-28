import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { PostTypeTag } from '@/components/Tags';
import { getPostTypeMeta } from '@/data/postTypes';
import { UniversityLogo } from '@/components/UniversityLogo';
import {
  MessageSquare, CheckSquare, FileText, Info, Send, Plus, Trash2,
  Check, Clock, Users, Calendar, MapPin, Award, Wrench, AlertCircle,
} from 'lucide-react';
import type { ChatMessage, ConversationSummary } from '@/data/types';

type Tab = 'chat' | 'tasks' | 'files' | 'details';

export function TeamWorkspacePage({ postId }: { postId: string }) {
  const { posts, activityChats, sendActivityMessage, currentUser, navigate, tasks, addTask, toggleTask, deleteTask, files, addFile, deleteFile, saveConversationSummary } = useApp();
  const post = posts.find((p) => p.id === postId);
  const [tab, setTab] = useState<Tab>('chat');
  const [chatInput, setChatInput] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [fileName, setFileName] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const messages = activityChats[postId] ?? [];
  const postTasks = tasks.filter((t) => t.postId === postId);
  const postFiles = files.filter((f) => f.postId === postId);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, tab]);

  const handleSend = useCallback(() => {
    if (!chatInput.trim()) return;
    sendActivityMessage(postId, {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: chatInput.trim(),
      timestamp: new Date().toISOString(),
    });
    setChatInput('');
  }, [chatInput, sendActivityMessage, postId, currentUser]);

  const handleAddTask = useCallback(() => {
    if (!taskInput.trim()) return;
    addTask(postId, taskInput.trim(), taskAssignee.trim() || undefined);
    setTaskInput('');
    setTaskAssignee('');
  }, [taskInput, taskAssignee, addTask, postId]);

  const handleAddFile = useCallback(() => {
    if (!fileName.trim()) return;
    addFile(postId, fileName.trim(), currentUser.name);
    setFileName('');
  }, [fileName, addFile, postId, currentUser]);

  const handleSaveSummary = useCallback(() => {
    if (!post) return;
    const participants = Array.from(new Set(messages.map((m) => m.senderName)));
    const keyPoints = messages.slice(-5).map((m) => m.text.slice(0, 80));
    const actionItems = postTasks.filter((t) => !t.done).slice(0, 5).map((t) => t.title);

    const summary: ConversationSummary = {
      id: `summary-${Date.now()}`,
      postId,
      postTitle: post.title,
      summary: `Team discussed "${post.title}" with ${messages.length} messages across ${participants.length} participants. ${postTasks.filter((t) => t.done).length} of ${postTasks.length} tasks completed.`,
      keyPoints: keyPoints.length > 0 ? keyPoints : ['No recent messages to summarize'],
      actionItems: actionItems.length > 0 ? actionItems : ['No pending tasks'],
      participants,
      createdAt: new Date().toISOString(),
    };
    saveConversationSummary(summary);
    setTab('details');
  }, [post, messages, postTasks, saveConversationSummary, postId]);

  if (!post) {
    return (
      <PageShell>
        <BackButton />
        <div className="rounded-card-lg bg-white p-12 text-center shadow-card">
          <AlertCircle className="mx-auto mb-4 text-poppy-500" size={48} />
          <p className="font-display text-xl font-bold text-navy-500">Project not found</p>
          <PillButton variant="navy" className="mt-4" onClick={() => navigate({ name: 'home' })}>Back to Home</PillButton>
        </div>
      </PageShell>
    );
  }

  const meta = getPostTypeMeta(post.type);
  const completedTasks = postTasks.filter((t) => t.done).length;
  const members = [
    { id: post.authorId, name: post.authorName, role: 'creator' as const },
    ...post.contributors.filter((c) => c.studentId !== post.authorId).map((c) => ({ id: c.studentId, name: c.name, role: 'member' as const })),
  ];

  return (
    <PageShell>
      <BackButton label="Back to post" />
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 rounded-card-lg border-2 border-cream-300 bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-card ${meta.bgColor} text-2xl`}>
                {meta.icon}
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-navy-500">{post.title}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <PostTypeTag type={post.type} size="sm" />
                  <span className="text-xs font-bold text-navy-400">{post.membersJoined}/{post.membersNeeded} members</span>
                </div>
              </div>
            </div>
            <PillButton variant="navy" size="sm" onClick={handleSaveSummary}>
              <FileText size={14} /> Save Summary
            </PillButton>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 rounded-card-lg bg-white p-1.5 shadow-soft">
          <TabButton active={tab === 'chat'} onClick={() => setTab('chat')} icon={<MessageSquare size={16} />} label="Team Chat" badge={messages.length} />
          <TabButton active={tab === 'tasks'} onClick={() => setTab('tasks')} icon={<CheckSquare size={16} />} label="Tasks" badge={postTasks.length} />
          <TabButton active={tab === 'files'} onClick={() => setTab('files')} icon={<FileText size={16} />} label="Files" badge={postFiles.length} />
          <TabButton active={tab === 'details'} onClick={() => setTab('details')} icon={<Info size={16} />} label="Details" />
        </div>

        {/* Tab content */}
        {tab === 'chat' && (
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3 flex flex-col rounded-card-lg bg-white shadow-card overflow-hidden" style={{ height: '60vh' }}>
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <MessageSquare className="mb-2 text-navy-400/40" size={32} />
                    <p className="text-sm font-semibold text-navy-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <ChatBubble key={msg.id} msg={msg} currentUserId={currentUser.id} />
                  ))
                )}
              </div>
              <div className="border-t border-cream-200 p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
                  />
                  <button
                    onClick={handleSend}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500 text-white transition hover:bg-fuchsia-600 hover:scale-105"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-card-lg bg-white p-5 shadow-card">
              <h3 className="mb-3 font-display text-sm font-bold text-navy-500">Team Members</h3>
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 rounded-card bg-cream-50 p-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender-300 font-display text-xs font-bold text-navy-500">
                      {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-500 truncate">{m.name}</p>
                      <p className="text-[10px] font-bold text-navy-400">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div className="rounded-card-lg bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-navy-500">Project Tasks</h2>
                <p className="text-sm font-semibold text-navy-400">{completedTasks} of {postTasks.length} completed</p>
              </div>
              <div className="flex items-center gap-2 rounded-pill bg-sage-300/50 px-3 py-1.5">
                <Check size={14} className="text-sage-600" />
                <span className="text-xs font-bold text-sage-600">{postTasks.length > 0 ? Math.round((completedTasks / postTasks.length) * 100) : 0}%</span>
              </div>
            </div>

            <div className="mb-4 h-2 overflow-hidden rounded-full bg-cream-200">
              <div className="h-full bg-sage-500 transition-all duration-300" style={{ width: `${postTasks.length > 0 ? (completedTasks / postTasks.length) * 100 : 0}%` }} />
            </div>

            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Add a task..."
                className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
              />
              <input
                type="text"
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Assignee (optional)"
                className="sm:w-44 rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
              />
              <button
                onClick={handleAddTask}
                disabled={!taskInput.trim()}
                className="flex items-center justify-center gap-1.5 rounded-btn bg-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-fuchsia-600 disabled:opacity-40"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="space-y-2">
              {postTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckSquare className="mb-2 text-navy-400/40" size={32} />
                  <p className="text-sm font-semibold text-navy-400">No tasks yet. Add your first task above!</p>
                </div>
              ) : (
                postTasks.map((task) => (
                  <div key={task.id} className={`flex items-center gap-3 rounded-card border-2 p-3 transition ${task.done ? 'border-sage-300 bg-sage-300/10' : 'border-cream-300 bg-cream-50'}`}>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-btn border-2 transition shrink-0 ${
                        task.done ? 'border-sage-500 bg-sage-500 text-white' : 'border-cream-300 bg-white hover:border-sage-400'
                      }`}
                    >
                      {task.done && <Check size={14} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${task.done ? 'text-navy-400 line-through' : 'text-navy-500'}`}>{task.title}</p>
                      {task.assigneeName && (
                        <p className="text-xs font-semibold text-navy-400">Assigned to: {task.assigneeName}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-btn p-1.5 text-navy-400/40 transition hover:bg-poppy-400/10 hover:text-poppy-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'files' && (
          <div className="rounded-card-lg bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-navy-500">Shared Files</h2>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
                placeholder="File name (e.g. research_paper.pdf)..."
                className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none transition"
              />
              <button
                onClick={handleAddFile}
                disabled={!fileName.trim()}
                className="flex items-center justify-center gap-1.5 rounded-btn bg-teal-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600 disabled:opacity-40"
              >
                <Plus size={16} /> Upload
              </button>
            </div>

            <div className="space-y-2">
              {postFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-2 text-navy-400/40" size={32} />
                  <p className="text-sm font-semibold text-navy-400">No files shared yet. Upload your first file!</p>
                </div>
              ) : (
                postFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 rounded-card border-2 border-cream-300 bg-cream-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-teal-300/50 text-teal-600 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy-500 truncate">{file.name}</p>
                      <p className="text-xs font-semibold text-navy-400">{file.uploadedBy} · {file.size} · {new Date(file.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="rounded-btn p-1.5 text-navy-400/40 transition hover:bg-poppy-400/10 hover:text-poppy-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'details' && <ProjectDetailsTab postId={postId} />}
      </div>
    </PageShell>
  );
}

function ProjectDetailsTab({ postId }: { postId: string }) {
  const { posts, students, conversationSummaries, navigate } = useApp();
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  const meta = getPostTypeMeta(post.type);
  const author = students.find((s) => s.id === post.authorId);
  const authorSkills = author && author.privacy.fieldVisibility.skills ? author.skills : [];
  const postSummaries = conversationSummaries.filter((s) => s.postId === postId);

  return (
    <div className="space-y-4">
      <div className="rounded-card-lg bg-white p-6 shadow-card">
        <h2 className="mb-2 font-display text-lg font-bold text-navy-500">About this {meta.label}</h2>
        <p className="text-sm leading-relaxed text-navy-400">{post.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card-lg bg-white p-5 shadow-card">
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-navy-500">
            <Calendar size={16} className="text-lavender-500" /> Timeline
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="font-bold text-navy-400">Due Date</dt><dd className="font-semibold text-navy-500">{new Date(post.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</dd></div>
            <div className="flex justify-between"><dt className="font-bold text-navy-400">Created</dt><dd className="font-semibold text-navy-500">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</dd></div>
            <div className="flex justify-between"><dt className="font-bold text-navy-400">Format</dt><dd className="font-semibold text-navy-500 capitalize">{post.activityFormat ?? 'hybrid'}</dd></div>
          </dl>
        </div>

        <div className="rounded-card-lg bg-white p-5 shadow-card">
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-navy-500">
            <Users size={16} className="text-fuchsia-500" /> Team
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="font-bold text-navy-400">Members</dt><dd className="font-semibold text-navy-500">{post.membersJoined}/{post.membersNeeded}</dd></div>
            <div className="flex justify-between"><dt className="font-bold text-navy-400">Contributors</dt><dd className="font-semibold text-navy-500">{post.contributors.length}</dd></div>
            <div className="flex justify-between"><dt className="font-bold text-navy-400">Location</dt><dd className="font-semibold text-navy-500">{post.country}</dd></div>
          </dl>
        </div>
      </div>

      <div className="rounded-card-lg bg-white p-6 shadow-card">
        <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-navy-500">
          <Wrench size={16} className="text-fuchsia-500" /> Skills Needed
        </h3>
        <div className="flex flex-wrap gap-2">
          {(post.skillsNeeded ?? []).map((skill) => (
            <span key={skill} className="rounded-btn bg-fuchsia-300/50 px-2.5 py-1 text-xs font-bold text-fuchsia-600">{skill}</span>
          ))}
        </div>
      </div>

      {authorSkills.length > 0 && (
        <div className="rounded-card-lg bg-white p-6 shadow-card">
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-navy-500">
            <Award size={16} className="text-daffodil-500" /> Author Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {authorSkills.map((skill) => (
              <span key={skill} className="rounded-btn bg-sky-300/50 px-2.5 py-1 text-xs font-bold text-sky-600">{skill}</span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-card-lg bg-white p-6 shadow-card">
        <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-navy-500">
          <MapPin size={16} className="text-teal-500" /> University
        </h3>
        <div className="flex items-center gap-3">
          <UniversityLogo name={post.university} size={36} />
          <div>
            <p className="text-sm font-bold text-navy-500">{post.university}</p>
            <p className="text-xs font-semibold text-navy-400">{post.major}</p>
          </div>
        </div>
      </div>

      {postSummaries.length > 0 && (
        <div className="rounded-card-lg bg-white p-6 shadow-card">
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-navy-500">
            <FileText size={16} className="text-lavender-500" /> Conversation Summaries
          </h3>
          <div className="space-y-3">
            {postSummaries.map((s) => (
              <div key={s.id} className="rounded-card border-2 border-cream-300 bg-cream-50 p-4">
                <p className="text-xs font-bold text-navy-400 mb-1">{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                <p className="text-sm font-semibold text-navy-500 mb-2">{s.summary}</p>
                {s.actionItems.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-bold uppercase text-navy-400 mb-1">Action Items</p>
                    <ul className="space-y-0.5">
                      {s.actionItems.map((item, i) => (
                        <li key={i} className="text-xs font-semibold text-navy-500 flex items-center gap-1.5">
                          <Check size={12} className="text-sage-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs font-semibold text-navy-400">Participants: {s.participants.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate({ name: 'post-detail', postId })}
        className="block w-full rounded-card-lg bg-navy-500 py-3 text-center text-sm font-bold text-white transition hover:bg-navy-600"
      >
        View Original Post
      </button>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-btn px-3 py-2.5 text-sm font-bold transition ${
        active ? 'bg-fuchsia-500 text-white shadow-pop' : 'text-navy-400 hover:bg-cream-200'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`rounded-full px-1.5 text-[10px] font-bold ${active ? 'bg-white/25 text-white' : 'bg-fuchsia-400/20 text-fuchsia-600'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function ChatBubble({ msg, currentUserId }: { msg: ChatMessage; currentUserId: string }) {
  const isMe = msg.senderId === currentUserId;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-message-pop`}>
      <div className={`max-w-[75%] rounded-card px-4 py-2.5 ${isMe ? 'bg-fuchsia-500 text-white' : 'bg-cream-200 text-navy-500'}`}>
        {!isMe && <p className="mb-0.5 text-xs font-bold text-lavender-600">{msg.senderName}</p>}
        <p className="text-sm font-semibold">{msg.text}</p>
        <p className={`mt-1 text-[10px] ${isMe ? 'text-white/70' : 'text-navy-400/70'}`}>
          {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
