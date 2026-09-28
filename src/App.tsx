import { AppProvider, useApp } from '@/context/AppContext';
import { LanguageProvider } from './LanguageContext'; // 🌟 تم تعديل المسار ليكون في مجلد src مباشرة
import { SignUpPage } from '@/pages/SignUpPage';
import { HomePage } from '@/pages/HomePage';
import { CreatePostSelectorPage, CreatePostFormPage } from '@/pages/CreatePostPage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { JoinPage } from '@/pages/JoinPage';
import { ActivityChatPage } from '@/pages/ActivityChatPage';
import { TeamWorkspacePage } from '@/pages/TeamWorkspacePage';
import { ConversationsPage } from '@/pages/ConversationsPage';
import { StudyGroupsHubPage, JoinGroupPage, CreateGroupPage, GroupDetailPage, GroupChatPage } from '@/pages/StudyGroupsPage';
import { FindStudentsPage } from '@/pages/FindStudentsPage';
import { StudentProfilePage } from '@/pages/StudentProfilePage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { AuthPromptModal } from '@/components/AuthPromptModal';
import { AIAssistant } from '@/components/AIAssistant';

function Router() {
  const { route, currentUser } = useApp();

  switch (route.name) {
    case 'signup':
      return <SignUpPage />;
    case 'home':
      return <HomePage />;
    case 'create-post':
      return <CreatePostSelectorPage />;
    case 'create-post-form':
      return <CreatePostFormPage postType={route.postType} />;
    case 'post-detail':
      return <PostDetailPage postId={route.postId} />;
    case 'join':
      return <JoinPage postId={route.postId} />;
    case 'activity-chat':
      return <ActivityChatPage postId={route.postId} />;
    case 'team-workspace':
      return <TeamWorkspacePage postId={route.postId} />;
    case 'conversations':
      return <ConversationsPage />;
    case 'study-groups':
      return <StudyGroupsHubPage />;
    case 'join-group':
      return <JoinGroupPage />;
    case 'create-group':
      return <CreateGroupPage />;
    case 'group-detail':
      return <GroupDetailPage groupId={route.groupId} />;
    case 'group-chat':
      return <GroupChatPage groupId={route.groupId} />;
    case 'find-students':
      return <FindStudentsPage />;
    case 'student-profile':
      return <StudentProfilePage studentId={route.studentId} />;
    case 'my-profile':
      return <StudentProfilePage studentId={currentUser.id} />;
    case 'privacy':
      return <PrivacyPage />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <Router />
        <AuthPromptModal />
        <AIAssistant />
      </LanguageProvider>
    </AppProvider>
  );
}
