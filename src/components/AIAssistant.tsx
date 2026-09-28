import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Send, Target, Users, MessageSquare, Calendar, ArrowRight, FileText, ChevronRight, CheckSquare, GraduationCap, Sparkle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getPostTypeMeta, MAJORS, UNIVERSITY_NAMES } from '@/data/postTypes';
import {
  processAIInput,
  processQuickAction,
  processConversationAIInput,
  QUICK_ACTIONS,
  type AIResponse,
  type AIAction,
  type QuickAction as QuickActionId,
  type RichContent,
  type PostTemplate,
  type ConversationAnalysis,
} from '@/lib/aiEngine';
import type { Post, PostType, StudyGroup } from '@/data/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  actions?: AIAction[];
  richContent?: RichContent;
  timestamp: number;
}

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'ai',
  text: "Hi! I'm your AI Assistant — your guided advisor on GlobalStudent.\n\nI can help you discover projects, match with collaborators, generate post templates, plan meetings, and navigate the platform. What would you like to do?",
  timestamp: Date.now(),
};

const QUICK_ACTION_ICONS: Record<string, React.ReactNode> = {
  target: <Target size={16} />,
  users: <Users size={16} />,
  message: <MessageSquare size={16} />,
  calendar: <Calendar size={16} />,
};

export function AIAssistant() {
  const { currentUser, students, posts, groups, activityChats, navigate, requireAuth, addPost, addTask, createGroup, joinGroup } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const buildContext = useCallback(() => ({
    currentUser,
    students,
    posts,
    groups,
    activityChats,
    universityNames: UNIVERSITY_NAMES,
    majors: MAJORS,
  }), [currentUser, students, posts, groups, activityChats]);

  const handleResponse = useCallback((response: AIResponse) => {
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      text: response.text,
      actions: response.actions,
      richContent: response.richContent,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  }, []);

  const processInput = useCallback((text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processAIInput(text, buildContext());
      handleResponse(response);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  }, [buildContext, handleResponse]);

  const handleQuickAction = useCallback((actionId: QuickActionId) => {
    const label = QUICK_ACTIONS.find((q) => q.id === actionId)?.label ?? actionId;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: label,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuickAction(actionId, buildContext());
      handleResponse(response);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  }, [buildContext, handleResponse]);

  const handleAction = useCallback((action: AIAction) => {
    if (action.type === 'navigate' && action.route) {
      const route = action.route;
      if (route.name === 'create-post' || route.name === 'create-post-form') {
        requireAuth(route);
      } else {
        navigate(route);
      }
      setOpen(false);
    } else if (action.type === 'create-post-template' && action.data) {
      const template = action.data as PostTemplate;
      const newPost: Post = {
        id: `ai-${Date.now()}`,
        type: template.type,
        title: template.title,
        major: template.major,
        university: currentUser.university,
        country: currentUser.country,
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        membersNeeded: template.membersNeeded,
        membersJoined: 1,
        description: template.description,
        authorId: currentUser.id,
        authorName: currentUser.name,
        tags: template.tags,
        skillsNeeded: template.skillsNeeded,
        contributors: [
          { studentId: currentUser.id, name: currentUser.name, major: currentUser.major, university: currentUser.university },
        ],
        activityFormat: template.activityFormat,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addPost(newPost);
      const confirmMessage: ChatMessage = {
        id: `ai-confirm-${Date.now()}`,
        role: 'ai',
        text: `Your "${getPostTypeMeta(template.type).label}" has been published! You can view it now.`,
        actions: [{ type: 'navigate', label: 'View Post', route: { name: 'post-detail', postId: newPost.id } }],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, confirmMessage]);
    } else if (action.type === 'confirm-create-group' && action.data) {
      const data = action.data as { subject: string; date: Date; time: string | null; dateDisplay: string };
      const newGroup: StudyGroup = {
        id: `grp-ai-${Date.now()}`,
        subject: data.subject || currentUser.major,
        college: 'General',
        major: currentUser.major,
        university: currentUser.university,
        description: `AI-scheduled study group for ${data.subject}. Scheduled for ${data.dateDisplay}.`,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        members: [{ studentId: currentUser.id, name: currentUser.name, role: 'creator', major: currentUser.major, university: currentUser.university }],
        meetingFrequency: 'Weekly',
        maxSeats: 10,
        chat: [{ id: `m${Date.now()}`, senderId: 'system', senderName: 'AI Assistant', text: `Study group scheduled for ${data.dateDisplay}. First meeting coming up!`, timestamp: new Date().toISOString() }],
      };
      createGroup(newGroup);
      const confirmMessage: ChatMessage = {
        id: `ai-confirm-${Date.now()}`,
        role: 'ai',
        text: `Study group "${newGroup.subject}" has been created and scheduled for ${data.dateDisplay}! You're the admin. Invite other students to join.`,
        actions: [{ type: 'navigate', label: 'View Group', route: { name: 'group-detail', groupId: newGroup.id } }],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, confirmMessage]);
    } else if (action.type === 'create-tasks' && action.data) {
      const taskList = action.data as Array<{ title: string; assignee?: string }>;
      const recentPost = posts.find((p) => p.authorId === currentUser.id) ?? posts[0];
      if (recentPost) {
        taskList.forEach((task) => {
          addTask(recentPost.id, task.title, task.assignee);
        });
        const confirmMessage: ChatMessage = {
          id: `ai-confirm-${Date.now()}`,
          role: 'ai',
          text: `${taskList.length} task${taskList.length === 1 ? '' : 's'} added to "${recentPost.title}" Team Workspace! View them in the Tasks tab.`,
          actions: [{ type: 'navigate', label: 'Open Workspace', route: { name: 'team-workspace', postId: recentPost.id } }],
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, confirmMessage]);
      }
    }
  }, [navigate, requireAuth, currentUser, addPost, addTask, createGroup, posts, joinGroup]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) processInput(input.trim());
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-[90] flex items-center gap-2.5 rounded-pill bg-gradient-to-r from-lavender-500 via-fuchsia-500 to-lavender-500 px-4 py-3.5 text-white shadow-pop transition-all duration-300 hover:scale-105 animate-glow-pulse ${
          open ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'
        }`}
        aria-label="Open AI Assistant"
      >
        <Sparkles size={22} className="animate-spark-rotate" />
        <span className="hidden text-sm font-bold sm:block">AI Assistant</span>
      </button>

      {/* Slide-over drawer */}
      {open && createPortal(
        <div className="fixed inset-0 z-[100] flex animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy-600/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative ml-auto flex h-full w-full max-w-md flex-col rounded-l-3xl bg-cream-50 shadow-pop animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-300 bg-gradient-to-r from-lavender-500 via-fuchsia-500 to-lavender-500 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">AI Assistant</h3>
                  <p className="text-xs font-semibold text-white/80">Your Guided Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3"
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onAction={handleAction}
                />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-lavender-400 to-fuchsia-400 shrink-0">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-card-lg rounded-bl-sm bg-white px-4 py-3 shadow-soft">
                    <span className="h-2 w-2 rounded-full bg-lavender-400 animate-typing-dot" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-lavender-400 animate-typing-dot" style={{ animationDelay: '200ms' }} />
                    <span className="h-2 w-2 rounded-full bg-lavender-400 animate-typing-dot" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 pb-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy-400">Quick Actions</p>
                <div className="grid gap-2">
                  {QUICK_ACTIONS.map((qa) => (
                    <button
                      key={qa.id}
                      onClick={() => handleQuickAction(qa.id)}
                      className="group flex items-start gap-3 rounded-card border-2 border-cream-300 bg-white px-3.5 py-3 text-left transition-all hover:border-lavender-400 hover:bg-lavender-200/30 hover:shadow-soft"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-lavender-200 text-lavender-600 transition group-hover:bg-lavender-400 group-hover:text-white shrink-0">
                        {QUICK_ACTION_ICONS[qa.icon]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-navy-500">{qa.label}</p>
                      </div>
                      <ChevronRight size={16} className="ml-auto text-navy-400/40 transition group-hover:text-lavender-500 group-hover:translate-x-0.5 shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="border-t border-cream-300 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything... e.g. I need a Python dev for an AI project"
                  className="flex-1 rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
                />
                <button
                  onClick={() => input.trim() && processInput(input.trim())}
                  disabled={!input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-btn bg-gradient-to-r from-lavender-500 to-fuchsia-500 text-white shadow-pop transition hover:scale-105 disabled:opacity-40 disabled:scale-100"
                  aria-label="Send"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] font-semibold text-navy-400/50">
                AI Assistant can help you discover, match, discuss & collaborate
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function MessageBubble({ message, onAction }: { message: ChatMessage; onAction: (action: AIAction) => void }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end animate-message-pop">
        <div className="max-w-[80%] rounded-card-lg rounded-tr-sm bg-gradient-to-r from-lavender-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 animate-message-pop">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-lavender-400 to-fuchsia-400 shrink-0">
        <Sparkles size={16} className="text-white" />
      </div>
      <div className="max-w-[85%] space-y-2">
        <div className="rounded-card-lg rounded-bl-sm bg-white px-4 py-3 shadow-soft">
          <p className="whitespace-pre-line text-sm font-medium text-navy-500 leading-relaxed">{message.text}</p>
        </div>

        {/* Rich content */}
        {message.richContent && (
          <RichContentView content={message.richContent} onAction={onAction} />
        )}

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.actions.map((action, i) => (
              <button
                key={i}
                onClick={() => onAction(action)}
                className="flex items-center gap-1.5 rounded-btn bg-cream-200 border-2 border-lavender-300 px-3 py-2 text-xs font-bold text-navy-500 transition hover:bg-lavender-200 hover:border-lavender-400 hover:shadow-soft"
              >
                {action.label}
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RichContentView({ content, onAction }: { content: RichContent; onAction: (action: AIAction) => void }) {
  const { navigate } = useApp();

  if (content.kind === 'student-list' && content.students) {
    return (
      <div className="space-y-2">
        {content.students.map((student) => (
          <button
            key={student.id}
            onClick={() => { navigate({ name: 'student-profile', studentId: student.id }); }}
            className="w-full flex items-center gap-3 rounded-card border-2 border-cream-300 bg-cream-50 px-3 py-2.5 text-left transition hover:border-lavender-400 hover:bg-lavender-200/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-300 font-display text-xs font-bold text-navy-500 shrink-0">
              {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navy-500 truncate">{student.name}</p>
              <p className="text-xs font-semibold text-navy-400 truncate">{student.major}</p>
              <p className="text-xs text-navy-400/70 truncate">{student.university}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 rounded-btn bg-sage-300/50 px-2 py-0.5">
                <span className="text-[10px] font-bold text-sage-600">MATCH</span>
                <span className="text-xs font-bold text-sage-600">{student.matchScore}%</span>
              </div>
              {student.skills.length > 0 && (
                <p className="mt-1 text-[10px] font-semibold text-navy-400/70">{student.skills.slice(0, 3).join(' · ')}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (content.kind === 'post-list' && content.posts) {
    return (
      <div className="space-y-2">
        {content.posts.map((post) => {
          const meta = getPostTypeMeta(post.type);
          return (
            <button
              key={post.id}
              onClick={() => { navigate({ name: 'post-detail', postId: post.id }); }}
              className="w-full flex items-center gap-3 rounded-card border-2 border-cream-300 bg-cream-50 px-3 py-2.5 text-left transition hover:border-lavender-400 hover:bg-lavender-200/30"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-btn ${meta.bgColor} text-lg shrink-0`}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-navy-500 truncate">{post.title}</p>
                <p className="text-xs font-semibold text-navy-400">{meta.label} · {post.major}</p>
                <p className="text-xs text-navy-400/70 truncate">{post.university}</p>
              </div>
              <ChevronRight size={16} className="text-navy-400/40 shrink-0" />
            </button>
          );
        })}
      </div>
    );
  }

  if (content.kind === 'post-template' && content.template) {
    const template = content.template;
    const meta = getPostTypeMeta(template.type);
    return (
      <div className="rounded-card-lg border-2 border-lavender-300 bg-lavender-200/20 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-btn ${meta.bgColor} text-base`}>
            {meta.icon}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-navy-400">Generated Template</p>
            <p className="text-sm font-bold text-navy-500">{meta.label}</p>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <TemplateRow label="Title" value={template.title} />
          <TemplateRow label="Major" value={template.major} />
          <TemplateRow label="Format" value={template.activityFormat === 'in-person' ? 'In Person' : template.activityFormat} />
          <TemplateRow label="Members" value={`${template.membersNeeded} needed`} />
          <div>
            <p className="font-bold uppercase text-navy-400 mb-1">Skills Needed</p>
            <div className="flex flex-wrap gap-1">
              {template.skillsNeeded.map((s) => (
                <span key={s} className="rounded-btn bg-sky-300/50 px-2 py-0.5 text-[11px] font-bold text-sky-600">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold uppercase text-navy-400 mb-1">Description</p>
            <p className="font-medium text-navy-500 leading-relaxed">{template.description}</p>
          </div>
        </div>
      </div>
    );
  }

  if (content.kind === 'agenda' && content.agenda) {
    return (
      <div className="rounded-card-lg border-2 border-teal-300/60 bg-teal-300/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-teal-600" />
          <p className="text-sm font-bold text-navy-500">Suggested Meeting Agenda</p>
        </div>
        <div className="space-y-1.5">
          {content.agenda.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-btn bg-white px-3 py-2">
              <span className="text-xs font-bold text-teal-600 tabular-nums w-10 shrink-0">{item.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-navy-500">{item.topic}</p>
              </div>
              <span className="text-[10px] font-semibold text-navy-400/70 shrink-0">{item.duration}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (content.kind === 'task-list' && content.tasks) {
    return (
      <div className="rounded-card-lg border-2 border-sage-300/60 bg-sage-300/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <CheckSquare size={18} className="text-sage-600" />
          <p className="text-sm font-bold text-navy-500">Generated Tasks ({content.tasks.length})</p>
        </div>
        <div className="space-y-1.5">
          {content.tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3 rounded-btn bg-white px-3 py-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-btn border-2 border-sage-400 text-[10px] font-bold text-sage-600 shrink-0">{i + 1}</span>
              <p className="text-xs font-bold text-navy-500 flex-1">{task.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (content.kind === 'group-list' && content.groups) {
    return (
      <div className="space-y-2">
        {content.groups.map((group) => (
          <button
            key={group.id}
            onClick={() => { navigate({ name: 'group-detail', groupId: group.id }); }}
            className="w-full flex items-center gap-3 rounded-card border-2 border-cream-300 bg-cream-50 px-3 py-2.5 text-left transition hover:border-teal-400 hover:bg-teal-200/20"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-teal-300/50 text-teal-600 shrink-0">
              <GraduationCap size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navy-500 truncate">{group.subject}</p>
              <p className="text-xs font-semibold text-navy-400 truncate">{group.university}</p>
              <p className="text-xs text-navy-400/70 truncate">{group.memberCount} members · {group.meetingFrequency}</p>
            </div>
            <ChevronRight size={16} className="text-navy-400/40 shrink-0" />
          </button>
        ))}
      </div>
    );
  }

  if (content.kind === 'conversation-analysis' && content.analysis) {
    const a = content.analysis;
    return (
      <div className="rounded-card-lg border-2 border-lavender-300/60 bg-lavender-200/10 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkle size={16} className="text-lavender-600" />
          <p className="text-sm font-bold text-navy-500">Conversation Analysis</p>
        </div>
        <p className="text-xs font-semibold text-navy-500">{a.conciseSummary}</p>
        {a.mainTopics.length > 0 && (
          <AnalysisSection title="Main Topics" items={a.mainTopics} icon={<Target size={12} />} />
        )}
        {a.keyPoints.length > 0 && (
          <AnalysisSection title="Key Points" items={a.keyPoints} icon={<CheckCircle2 size={12} />} />
        )}
        {a.skillsDiscussed.length > 0 && (
          <AnalysisSection title="Skills Discussed" items={a.skillsDiscussed} icon={<Sparkle size={12} />} />
        )}
        {a.collaborationAreas.length > 0 && (
          <AnalysisSection title="Collaboration Areas" items={a.collaborationAreas} icon={<Users size={12} />} />
        )}
        {a.agreedTasks.length > 0 && (
          <AnalysisSection title="Agreed Tasks" items={a.agreedTasks} icon={<CheckSquare size={12} />} />
        )}
        {a.decisions.length > 0 && (
          <AnalysisSection title="Decisions Made" items={a.decisions} icon={<CheckCircle2 size={12} />} />
        )}
        {a.deadlines.length > 0 && (
          <AnalysisSection title="Deadlines Mentioned" items={a.deadlines} icon={<Clock size={12} />} />
        )}
        {a.unresolvedQuestions.length > 0 && (
          <AnalysisSection title="Unresolved Questions" items={a.unresolvedQuestions} icon={<AlertCircle size={12} />} />
        )}
        {a.suggestedNextSteps.length > 0 && (
          <AnalysisSection title="Suggested Next Steps" items={a.suggestedNextSteps} icon={<ArrowRight size={12} />} />
        )}
      </div>
    );
  }

  return null;
}

function AnalysisSection({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-navy-400">
        {icon} {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-navy-500">
            <span className="text-navy-400/40 shrink-0">·</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TemplateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-bold uppercase text-navy-400 w-16 shrink-0">{label}</span>
      <span className="font-semibold text-navy-500">{value}</span>
    </div>
  );
}
