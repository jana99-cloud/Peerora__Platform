import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import type { Post, Student, StudyGroup, ChatMessage, PostType, PrivacySettings, Task, FileItem, ConversationSummary, ConversationSession, ConversationDuration, CollaborationRequest, CollaborationOutcome } from '@/data/types';
import { seedPosts, seedStudents, seedGroups } from '@/data/seed';

export type Route =
  | { name: 'signup' }
  | { name: 'home' }
  | { name: 'create-post' }
  | { name: 'create-post-form'; postType: PostType }
  | { name: 'post-detail'; postId: string }
  | { name: 'join'; postId: string }
  | { name: 'activity-chat'; postId: string }
  | { name: 'team-workspace'; postId: string }
  | { name: 'conversations' }
  | { name: 'study-groups' }
  | { name: 'join-group' }
  | { name: 'create-group' }
  | { name: 'group-detail'; groupId: string }
  | { name: 'group-chat'; groupId: string }
  | { name: 'find-students' }
  | { name: 'student-profile'; studentId: string }
  | { name: 'privacy' }
  | { name: 'my-profile' };

interface AppState {
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  canGoBack: boolean;
  currentUser: Student;
  setCurrentUser: (student: Student) => void;
  isSignedUp: boolean;
  setSignedUp: (v: boolean) => void;
  pendingAuthRoute: Route | null;
  requireAuth: (route: Route) => boolean;
  showAuthPrompt: boolean;
  dismissAuthPrompt: () => void;
  proceedToSignup: () => void;
  posts: Post[];
  addPost: (post: Post) => void;
  joinPost: (postId: string) => void;
  students: Student[];
  groups: StudyGroup[];
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  createGroup: (group: StudyGroup) => void;
  sendGroupMessage: (groupId: string, message: ChatMessage) => void;
  activityChats: Record<string, ChatMessage[]>;
  sendActivityMessage: (postId: string, message: ChatMessage) => void;
  blockedUserIds: string[];
  blockUser: (studentId: string) => void;
  unblockUser: (studentId: string) => void;
  reportedPostIds: string[];
  reportPost: (postId: string) => void;
  updatePrivacy: (settings: PrivacySettings) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  universityActivityPoints: Record<string, number>;
  getUniversityActivityPoints: (university: string) => number;
  tasks: Task[];
  addTask: (postId: string, title: string, assigneeName?: string) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  files: FileItem[];
  addFile: (postId: string, name: string, uploadedBy: string) => void;
  deleteFile: (fileId: string) => void;
  conversationSummaries: ConversationSummary[];
  saveConversationSummary: (summary: ConversationSummary) => void;
  conversations: ConversationSession[];
  startConversation: (postId: string, purpose: string, durationMinutes: ConversationDuration) => string;
  completeConversation: (conversationId: string, finalResponse?: string) => void;
  getConversationByPostId: (postId: string) => ConversationSession | undefined;
  extendConversation: (conversationId: string, extraMinutes: number) => void;
  voteConversationOutcome: (conversationId: string, userId: string, outcome: CollaborationOutcome) => void;
  collaborationRequests: CollaborationRequest[];
  submitCollaborationRequest: (postId: string) => void;
  respondToCollaborationRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'peerora_permanent_state_v2';

function loadPersistedState(): Partial<PersistedState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

interface PersistedState {
  isSignedUp: boolean;
  currentUser: Student;
  posts: Post[];
  groups: StudyGroup[];
  activityChats: Record<string, ChatMessage[]>;
  blockedUserIds: string[];
  reportedPostIds: string[];
  tasks: Task[];
  files: FileItem[];
  conversationSummaries: ConversationSummary[];
  conversations: ConversationSession[];
  collaborationRequests: CollaborationRequest[];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersistedState();

  const [history, setHistory] = useState<Route[]>([{ name: 'home' }]);
  const [isSignedUp, setSignedUp] = useState(persisted?.isSignedUp ?? false);
  const [pendingAuthRoute, setPendingAuthRoute] = useState<Route | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [currentUser, setCurrentUser] = useState<Student>(persisted?.currentUser ?? seedStudents[0]);
  const [posts, setPosts] = useState<Post[]>(persisted?.posts ?? seedPosts);
  const [students] = useState<Student[]>(seedStudents);
  const [groups, setGroups] = useState<StudyGroup[]>(persisted?.groups ?? seedGroups);
  const [activityChats, setActivityChats] = useState<Record<string, ChatMessage[]>>(persisted?.activityChats ?? {});
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(persisted?.blockedUserIds ?? []);
  const [reportedPostIds, setReportedPostIds] = useState<string[]>(persisted?.reportedPostIds ?? []);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>(persisted?.tasks ?? []);
  const [files, setFiles] = useState<FileItem[]>(persisted?.files ?? []);
  const [conversationSummaries, setConversationSummaries] = useState<ConversationSummary[]>(persisted?.conversationSummaries ?? []);
  const [conversations, setConversations] = useState<ConversationSession[]>(persisted?.conversations ?? []);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>(persisted?.collaborationRequests ?? []);

  useEffect(() => {
    const state: PersistedState = {
      isSignedUp,
      currentUser,
      posts,
      groups,
      activityChats,
      blockedUserIds,
      reportedPostIds,
      tasks,
      files,
      conversationSummaries,
      conversations,
      collaborationRequests,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable
    }
  }, [isSignedUp, currentUser, posts, groups, activityChats, blockedUserIds, reportedPostIds, tasks, files, conversationSummaries, conversations, collaborationRequests]);

  const route = history[history.length - 1];

  const navigate = useCallback((newRoute: Route) => {
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].name === newRoute.name && JSON.stringify(prev[prev.length - 1]) === JSON.stringify(newRoute)) {
        return prev;
      }
      return [...prev, newRoute];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const requireAuth = useCallback((targetRoute: Route): boolean => {
    if (isSignedUp) {
      navigate(targetRoute);
      return true;
    }
    setPendingAuthRoute(targetRoute);
    setShowAuthPrompt(true);
    return false;
  }, [isSignedUp, navigate]);

  const dismissAuthPrompt = useCallback(() => {
    setShowAuthPrompt(false);
    setPendingAuthRoute(null);
  }, []);

  const proceedToSignup = useCallback(() => {
    setShowAuthPrompt(false);
    setHistory((prev) => [...prev, { name: 'signup' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const joinPost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, membersJoined: p.membersJoined + 1 } : p
      )
    );
    setCurrentUser((prev) => ({
      ...prev,
      joinedPostIds: [...prev.joinedPostIds, postId],
    }));
  }, []);

  const joinGroup = useCallback((groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: [
                ...g.members,
                {
                  studentId: currentUser.id,
                  name: currentUser.name,
                  role: 'member' as const,
                  major: currentUser.major,
                  university: currentUser.university,
                },
              ],
            }
          : g
      )
    );
    setCurrentUser((prev) => ({
      ...prev,
      joinedGroupIds: [...prev.joinedGroupIds, groupId],
    }));
  }, [currentUser]);

  const leaveGroup = useCallback((groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((m) => m.studentId !== currentUser.id) }
          : g
      )
    );
    setCurrentUser((prev) => ({
      ...prev,
      joinedGroupIds: prev.joinedGroupIds.filter((id) => id !== groupId),
    }));
  }, [currentUser]);

  const createGroup = useCallback((group: StudyGroup) => {
    setGroups((prev) => [group, ...prev]);
  }, []);

  const sendGroupMessage = useCallback((groupId: string, message: ChatMessage) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, chat: [...g.chat, message] } : g
      )
    );
  }, []);

  const sendActivityMessage = useCallback((postId: string, message: ChatMessage) => {
    setActivityChats((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), message],
    }));
  }, []);

  const blockUser = useCallback((studentId: string) => {
    setBlockedUserIds((prev) => (prev.includes(studentId) ? prev : [...prev, studentId]));
  }, []);

  const unblockUser = useCallback((studentId: string) => {
    setBlockedUserIds((prev) => prev.filter((id) => id !== studentId));
  }, []);

  const reportPost = useCallback((postId: string) => {
    setReportedPostIds((prev) => (prev.includes(postId) ? prev : [...prev, postId]));
  }, []);

  const updatePrivacy = useCallback((settings: PrivacySettings) => {
    setCurrentUser((prev) => ({ ...prev, privacy: settings }));
  }, []);

  const addTask = useCallback((postId: string, title: string, assigneeName?: string) => {
    setTasks((prev) => [
      ...prev,
      {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        postId,
        title,
        assigneeName,
        done: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const addFile = useCallback((postId: string, name: string, uploadedBy: string) => {
    setFiles((prev) => [
      ...prev,
      {
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        postId,
        name,
        uploadedBy,
        size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const saveConversationSummary = useCallback((summary: ConversationSummary) => {
    setConversationSummaries((prev) => [summary, ...prev]);
  }, []);

  const startConversation = useCallback((postId: string, purpose: string, durationMinutes: ConversationDuration): string => {
    const post = posts.find((p) => p.id === postId);
    const id = `conv-${Date.now()}`;
    const session: ConversationSession = {
      id,
      postId,
      postTitle: post?.title ?? 'Unknown',
      purpose,
      durationMinutes,
      startedAt: new Date().toISOString(),
      status: 'active',
      participantIds: post ? [post.authorId, currentUser.id].filter((v, i, a) => a.indexOf(v) === i) : [currentUser.id],
      participantNames: post ? [post.authorName, currentUser.name].filter((v, i, a) => a.indexOf(v) === i) : [currentUser.name],
    };
    setConversations((prev) => [session, ...prev]);
    return id;
  }, [posts, currentUser]);

  const completeConversation = useCallback((conversationId: string, finalResponse?: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, status: 'completed' as const, endedAt: new Date().toISOString(), finalResponse }
          : c
      )
    );
  }, []);

  const getConversationByPostId = useCallback((postId: string): ConversationSession | undefined => {
    return conversations.find((c) => c.postId === postId && c.status === 'active');
  }, [conversations]);

  const extendConversation = useCallback((conversationId: string, extraMinutes: number) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, extendedDuration: (c.extendedDuration ?? c.durationMinutes) + extraMinutes }
          : c
      )
    );
  }, []);

  const voteConversationOutcome = useCallback((conversationId: string, userId: string, outcome: CollaborationOutcome) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, outcomeVotes: { ...(c.outcomeVotes ?? {}), [userId]: outcome } }
          : c
      )
    );
  }, []);

  const submitCollaborationRequest = useCallback((postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const existing = collaborationRequests.find(
      (r) => r.postId === postId && r.requesterId === currentUser.id
    );
    if (existing) return;
    const req: CollaborationRequest = {
      id: `cr-${Date.now()}`,
      postId,
      postTitle: post.title,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterMajor: currentUser.major,
      requesterUniversity: currentUser.university,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setCollaborationRequests((prev) => [req, ...prev]);
  }, [posts, currentUser, collaborationRequests]);

  const respondToCollaborationRequest = useCallback((requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
    if (status === 'accepted') {
      const req = collaborationRequests.find((r) => r.id === requestId);
      if (req) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === req.postId
              ? {
                  ...p,
                  membersJoined: p.membersJoined + 1,
                  contributors: [...p.contributors, {
                    studentId: req.requesterId,
                    name: req.requesterName,
                    major: req.requesterMajor,
                    university: req.requesterUniversity,
                  }],
                }
              : p
          )
        );
      }
    }
  }, [collaborationRequests]);

  const universityActivityPoints = useMemo(() => {
    const points: Record<string, number> = {};
    const addPoints = (uni: string, amount: number) => {
      points[uni] = (points[uni] ?? 0) + amount;
    };
    posts.forEach((p) => {
      addPoints(p.university, 50);
      addPoints(p.university, p.membersJoined * 10);
      if (p.contributors) {
        p.contributors.forEach((c) => addPoints(c.university, 5));
      }
    });
    groups.forEach((g) => {
      addPoints(g.university, 30);
      addPoints(g.university, g.members.length * 8);
    });
    students.forEach((s) => {
      addPoints(s.university, 15);
    });
    return points;
  }, [posts, groups, students]);

  const getUniversityActivityPoints = useCallback((university: string): number => {
    return universityActivityPoints[university] ?? 0;
  }, [universityActivityPoints]);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        goBack,
        canGoBack: history.length > 1,
        currentUser,
        setCurrentUser,
        isSignedUp,
        setSignedUp,
        pendingAuthRoute,
        requireAuth,
        showAuthPrompt,
        dismissAuthPrompt,
        proceedToSignup,
        posts,
        addPost,
        joinPost,
        students,
        groups,
        joinGroup,
        leaveGroup,
        createGroup,
        sendGroupMessage,
        activityChats,
        sendActivityMessage,
        blockedUserIds,
        blockUser,
        unblockUser,
        reportedPostIds,
        reportPost,
        updatePrivacy,
        searchQuery,
        setSearchQuery,
        universityActivityPoints,
        getUniversityActivityPoints,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        files,
        addFile,
        deleteFile,
        conversationSummaries,
        saveConversationSummary,
        conversations,
        startConversation,
        completeConversation,
        getConversationByPostId,
        extendConversation,
        voteConversationOutcome,
        collaborationRequests,
        submitCollaborationRequest,
        respondToCollaborationRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}