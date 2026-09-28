export type PostType =
  | 'assignment'
  | 'research'
  | 'study-group'
  | 'project'
  | 'survey'
  | 'discussion'
  | 'presentation'
  | 'opportunity'
  | 'announcement';

export interface PostTypeMeta {
  type: PostType;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface Contributor {
  studentId: string;
  name: string;
  major: string;
  university: string;
}

export type ActivityFormat = 'online' | 'in-person' | 'hybrid';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  major: string;
  university: string;
  country: string;
  dueDate: string;
  membersNeeded: number;
  membersJoined: number;
  description: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  tags: string[];
  skillsNeeded: string[];
  contributors: Contributor[];
  activityFormat?: ActivityFormat;
  // type-specific extra fields
  extra?: Record<string, string>;
  createdAt: string;
}

export type FieldKey = 'email' | 'phone' | 'university' | 'major' | 'skills' | 'interests' | 'expertise';

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  emailVisibility: 'everyone' | 'same-university' | 'no-one';
  phoneVisible: boolean;
  messagingPermission: 'everyone' | 'same-university' | 'same-major' | 'no-one';
  postVisibility: 'public' | 'same-major' | 'same-university';
  fieldVisibility: Record<FieldKey, boolean>;
}

export interface Student {
  id: string;
  name: string;
  major: string;
  university: string;
  country: string;
  email: string;
  phone: string;
  username: string;
  photo?: string;
  skills: string[];
  interests: string[];
  expertise: string[];
  courses: string[];
  level: string;
  privacy: PrivacySettings;
  agreedToPrivacy: boolean;
  joinedPostIds: string[];
  joinedGroupIds: string[];
}

export interface StudyGroup {
  id: string;
  subject: string;
  college: string;
  major: string;
  university: string;
  description: string;
  creatorId: string;
  creatorName: string;
  meetingFrequency: string;
  maxSeats: number;
  members: GroupMember[];
  chat: ChatMessage[];
}

export interface GroupMember {
  studentId: string;
  name: string;
  role: 'creator' | 'member';
  major: string;
  university: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  attachment?: string;
}

export interface ActivityChat {
  postId: string;
  messages: ChatMessage[];
}

export interface Task {
  id: string;
  postId: string;
  title: string;
  assigneeName?: string;
  done: boolean;
  createdAt: string;
}

export interface FileItem {
  id: string;
  postId: string;
  name: string;
  uploadedBy: string;
  size: string;
  uploadedAt: string;
}

export interface ConversationSummary {
  id: string;
  postId: string;
  postTitle: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  participants: string[];
  createdAt: string;
  durationMinutes?: number;
  date?: string;
  mainTopic?: string;
  skillsDiscussed?: string[];
  collaborationAreas?: string[];
  decisions?: string[];
  deadlines?: string[];
  unresolvedPoints?: string[];
  nextSteps?: string[];
}

export type ConversationDuration = 10 | 20 | 30;
export type ConversationStatus = 'active' | 'completed';
export type CollaborationOutcome = 'collaborate' | 'stay-connected' | 'not-interested';

export interface ConversationSession {
  id: string;
  postId: string;
  postTitle: string;
  purpose: string;
  durationMinutes: ConversationDuration;
  startedAt: string;
  endedAt?: string;
  status: ConversationStatus;
  participantIds: string[];
  participantNames: string[];
  finalResponse?: string;
  extendedDuration?: number;
  outcomeVotes?: Record<string, CollaborationOutcome>;
}

export interface CollaborationRequest {
  id: string;
  postId: string;
  postTitle: string;
  requesterId: string;
  requesterName: string;
  requesterMajor: string;
  requesterUniversity: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
