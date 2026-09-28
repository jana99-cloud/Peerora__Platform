import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Post, Student, StudyGroup, ChatMessage, PostType, PrivacySettings, Task, FileItem, ConversationSummary, ConversationSession, CollaborationRequest, CollaborationOutcome } from '@/data/types';
import { seedPosts, seedStudents, seedGroups } from '@/data/seed';
import { supabase } from '@/lib/supabase';

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
  | { name: 'group detail'; groupId: string }
  | { name: 'group-chat'; groupId: string }
  | { name: 'find-students' }
  | { name: 'student-profile'; studentId: string }
  | { name: 'privacy' }
  | { name: 'my-profile' };

interface AppState {
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  cangoBack: boolean;
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
  addGroup: (group: StudyGroup) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (targetId: string, text: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Route[]>([{ name: 'home' }]);
  const currentIndex = history.length - 1;
  const route = history[currentIndex];

  const navigate = useCallback((newRoute: Route) => {
    setHistory((prev) => [...prev, newRoute]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, prev.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [history.length]);

  const cangoBack = history.length > 1;

  const [isSignedUp, setSignedUp] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<Student>(seedStudents[0]);
  const [showAuthPrompt, setShowAuthPrompt] = useState<boolean>(false);
  const [pendingAuthRoute, setPendingAuthRoute] = useState<Route | null>(null);

  const requireAuth = useCallback((targetRoute: Route): boolean => {
    if (!isSignedUp) {
      setPendingAuthRoute(targetRoute);
      setShowAuthPrompt(true);
      return false;
    }
    return true;
  }, [isSignedUp]);

  const dismissAuthPrompt = useCallback(() => {
    setShowAuthPrompt(false);
    setPendingAuthRoute(null);
  }, []);

  const proceedToSignup = useCallback(() => {
    setShowAuthPrompt(false);
    navigate({ name: 'signup' });
  }, [navigate]);

  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [groups, setGroups] = useState<StudyGroup[]>(seedGroups);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});

  // جلب البيانات من Supabase وتفعيل التحديث اللحظي
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase.from('posts').select('*');
      if (!error && data && data.length > 0) {
        const formatted = data.map((p: any) => ({
          ...p,
          maxMembers: p.maxMembers || 4,
          membersCount: p.membersCount || 1,
          members: p.members || [p.authorName || 'User']
        }));
        setPosts(formatted);
      }
    }
    fetchPosts();

    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addPost = useCallback(async (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    await supabase.from('posts').insert([{
      id: newPost.id,
      title: newPost.title,
      description: newPost.description,
      type: newPost.type,
      major: newPost.major,
      tags: newPost.tags,
      date: newPost.date,
      location: newPost.location,
      maxMembers: newPost.maxMembers,
      membersCount: newPost.membersCount,
      authorName: newPost.authorName || currentUser.name,
      authorId: currentUser.id,
      members: [currentUser.name]
    }]);
  }, [currentUser]);

  const joinPost = useCallback(async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedMembers = p.members ? [...p.members, currentUser.name] : [currentUser.name];
          const updatedCount = updatedMembers.length;
          
          supabase.from('posts').update({
            members: updatedMembers,
            membersCount: updatedCount
          }).eq('id', postId).then();

          return { ...p, membersCount: updatedCount, members: updatedMembers };
        }
        return p;
      })
    );
  }, [currentUser]);

  const addGroup = useCallback((group: StudyGroup) => {
    setGroups((prev) => [group, ...prev]);
  }, []);

  const sendChatMessage = useCallback((targetId: string, text: string) => {
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), msg]
    }));
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        goBack,
        cangoBack,
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
        addGroup,
        searchQuery,
        setSearchQuery,
        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}