import type { Post, Student, StudyGroup, PostType, ActivityFormat, ChatMessage } from '@/data/types';
import type { Route } from '@/context/AppContext';
import { POST_TYPES, MAJORS, UNIVERSITY_NAMES } from '@/data/postTypes';

export interface AIAction {
  type: 'navigate' | 'create-post-template' | 'recommend-students' | 'recommend-posts' | 'summarize-activity' | 'generate-agenda' | 'create-tasks' | 'recommend-groups' | 'create-study-group' | 'conversation-analysis' | 'confirm-create-group';
  label: string;
  route?: Route;
  data?: unknown;
}

export interface AIResponse {
  text: string;
  actions?: AIAction[];
  richContent?: RichContent;
}

export interface RichContent {
  kind: 'student-list' | 'post-list' | 'post-template' | 'agenda' | 'task-list' | 'group-list' | 'conversation-analysis';
  students?: Array<{ id: string; name: string; major: string; university: string; skills: string[]; matchScore: number }>;
  posts?: Array<{ id: string; title: string; type: PostType; major: string; university: string }>;
  template?: PostTemplate;
  agenda?: AgendaItem[];
  tasks?: Array<{ title: string; assignee?: string }>;
  groups?: Array<{ id: string; subject: string; university: string; memberCount: number; meetingFrequency: string }>;
  analysis?: ConversationAnalysis;
}

export interface PostTemplate {
  type: PostType;
  title: string;
  major: string;
  skillsNeeded: string[];
  description: string;
  membersNeeded: number;
  activityFormat: ActivityFormat;
  tags: string[];
}

export interface AgendaItem {
  time: string;
  topic: string;
  duration: string;
}

export interface ConversationAnalysis {
  messageCount: number;
  mainTopics: string[];
  keyPoints: string[];
  skillsDiscussed: string[];
  collaborationAreas: string[];
  agreedTasks: string[];
  unresolvedQuestions: string[];
  deadlines: string[];
  suggestedNextSteps: string[];
  conciseSummary: string;
  decisions: string[];
}

export type QuickAction =
  | 'define-project'
  | 'find-collaborator'
  | 'summarize-activity'
  | 'generate-agenda'
  | 'browse-posts'
  | 'find-students'
  | 'create-post';

export interface QuickActionDef {
  id: QuickAction;
  label: string;
  icon: string;
}

export const QUICK_ACTIONS: QuickActionDef[] = [
  { id: 'define-project', label: 'Help me define my project skills & requirements', icon: 'target' },
  { id: 'find-collaborator', label: 'Find the best collaborator match for my skills', icon: 'users' },
  { id: 'summarize-activity', label: 'Summarize my active conversations & next steps', icon: 'message' },
  { id: 'generate-agenda', label: 'Generate a meeting agenda for my next session', icon: 'calendar' },
];

const SKILL_KEYWORDS: Record<string, string[]> = {
  'python': ['python', 'py', 'django', 'flask', 'pandas', 'numpy'],
  'react': ['react', 'frontend', 'front-end', 'jsx', 'redux'],
  'machine learning': ['ml', 'machine learning', 'tensorflow', 'pytorch', 'deep learning', 'neural'],
  'ai': ['ai', 'artificial intelligence', 'nlp', 'computer vision', 'llm', 'gpt'],
  'java': ['java', 'spring', 'kotlin'],
  'c++': ['c++', 'cpp', 'c plus'],
  'data analysis': ['data analysis', 'analytics', 'statistics', 'spss', 'excel'],
  'web development': ['web', 'html', 'css', 'javascript', 'node'],
  'robotics': ['robotics', 'robot', 'arduino', 'esp32', 'embedded', 'iot'],
  'design': ['design', 'ui', 'ux', 'figma', 'graphic', 'visual'],
  'research': ['research', 'lab', 'experiment', 'thesis', 'paper'],
  'finance': ['finance', 'financial', 'accounting', 'excel', 'investment'],
  'marketing': ['marketing', 'seo', 'social media', 'advertising'],
  'cybersecurity': ['cyber', 'security', 'hacking', 'penetration', 'crypto'],
  'mobile': ['mobile', 'ios', 'android', 'flutter', 'react native'],
};

const POST_TYPE_KEYWORDS: Record<PostType, string[]> = {
  'assignment': ['assignment', 'homework', 'problem set', 'lab report', 'coursework'],
  'research': ['research', 'paper', 'study', 'investigation', 'thesis', 'publication'],
  'study-group': ['study group', 'study buddy', 'review session', 'exam prep'],
  'project': ['project', 'build', 'develop', 'create', 'prototype', 'system', 'app'],
  'survey': ['survey', 'questionnaire', 'poll', 'data collection'],
  'discussion': ['discussion', 'debate', 'talk', 'conversation', 'forum'],
  'presentation': ['presentation', 'slides', 'present', 'co-presenter', 'talk'],
  'opportunity': ['opportunity', 'internship', 'job', 'scholarship', 'fellowship', 'program'],
  'announcement': ['announcement', 'event', 'hackathon', 'competition', 'workshop'],
};

const ACTIVITY_FORMAT_KEYWORDS: Record<ActivityFormat, string[]> = {
  'online': ['online', 'virtual', 'remote', 'discord', 'zoom', 'teams'],
  'in-person': ['in person', 'in-person', 'campus', 'physical', 'on-site', 'classroom'],
  'hybrid': ['hybrid', 'mixed', 'both online and in person'],
};

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.add(skill);
    }
  }
  return Array.from(found);
}

function detectPostType(text: string): PostType {
  const lower = text.toLowerCase();
  let best: PostType = 'project';
  let bestScore = 0;
  for (const [type, keywords] of Object.entries(POST_TYPE_KEYWORDS) as [PostType, string[]][]) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = type;
    }
  }
  return best;
}

function detectActivityFormat(text: string): ActivityFormat {
  const lower = text.toLowerCase();
  for (const [fmt, keywords] of Object.entries(ACTIVITY_FORMAT_KEYWORDS) as [ActivityFormat, string[]][]) {
    if (keywords.some((kw) => lower.includes(kw))) return fmt;
  }
  return 'hybrid';
}

function detectMajor(text: string, majors: string[]): string {
  const lower = text.toLowerCase();
  const matched = majors.find((m) => lower.includes(m.toLowerCase()));
  if (matched) return matched;
  if (lower.includes('computer') || lower.includes('cs') || lower.includes('programming')) return 'Computer Science';
  if (lower.includes('medicine') || lower.includes('medical') || lower.includes('health')) return 'Medicine and Surgery';
  if (lower.includes('engineering') || lower.includes('mechanical') || lower.includes('electrical')) return 'Mechanical Engineering';
  if (lower.includes('business') || lower.includes('finance')) return 'Business Administration';
  if (lower.includes('psychology') || lower.includes('psych')) return 'Psychology';
  if (lower.includes('biology') || lower.includes('bio')) return 'Biology';
  return '';
}

function detectUniversity(text: string, universityNames: string[]): string {
  const lower = text.toLowerCase();
  return universityNames.find((u) => lower.includes(u.toLowerCase())) ?? '';
}

function detectMembersNeeded(text: string): number {
  const match = text.match(/(\d+)\s*(?:people|person|members|students|collaborators|teammates|partners)\b/i);
  if (match) return parseInt(match[1]);
  const needMatch = text.match(/need\s*(\d+)/i);
  if (needMatch) return parseInt(needMatch[1]);
  return 4;
}

function scoreStudent(student: Student, query: string, requestedSkills: string[], requestedMajor: string, requestedUniversity: string): number {
  let score = 0;
  const studentSkills = student.skills.map((s) => s.toLowerCase());
  const studentInterests = student.interests.map((i) => i.toLowerCase());

  requestedSkills.forEach((skill) => {
    const skillLower = skill.toLowerCase();
    if (studentSkills.some((s) => s.includes(skillLower) || skillLower.includes(s))) score += 30;
    if (studentInterests.some((i) => i.includes(skillLower) || skillLower.includes(i))) score += 15;
  });

  if (requestedMajor && student.major.toLowerCase().includes(requestedMajor.toLowerCase())) score += 20;
  if (requestedUniversity && student.university === requestedUniversity) score += 25;

  const queryLower = query.toLowerCase();
  student.skills.forEach((s) => {
    if (queryLower.includes(s.toLowerCase())) score += 10;
  });
  student.interests.forEach((i) => {
    if (queryLower.includes(i.toLowerCase())) score += 5;
  });

  if (student.expertise.some((e) => requestedSkills.some((rs) => e.toLowerCase().includes(rs.toLowerCase())))) score += 12;

  return score;
}

function scorePost(post: Post, query: string, requestedSkills: string[], requestedMajor: string): number {
  let score = 0;
  const postSkills = post.skillsNeeded.map((s) => s.toLowerCase());
  const postTags = post.tags.map((t) => t.toLowerCase());

  requestedSkills.forEach((skill) => {
    const skillLower = skill.toLowerCase();
    if (postSkills.some((s) => s.includes(skillLower) || skillLower.includes(s))) score += 25;
    if (postTags.some((t) => t.includes(skillLower))) score += 10;
  });

  if (requestedMajor && post.major.toLowerCase().includes(requestedMajor.toLowerCase())) score += 20;

  const queryLower = query.toLowerCase();
  if (post.title.toLowerCase().includes(queryLower) || post.description.toLowerCase().includes(queryLower)) score += 15;
  post.tags.forEach((t) => { if (queryLower.includes(t.toLowerCase())) score += 8; });
  post.skillsNeeded.forEach((s) => { if (queryLower.includes(s.toLowerCase())) score += 8; });

  if (post.membersJoined < post.membersNeeded) score += 5;

  return score;
}

function generateTemplate(text: string, currentUser: Student): PostTemplate {
  const type = detectPostType(text);
  const skills = extractSkills(text);
  const major = detectMajor(text, []) || currentUser.major;
  const format = detectActivityFormat(text);
  const members = detectMembersNeeded(text);
  const meta = POST_TYPES.find((p) => p.type === type)!;

  const titleMatch = text.match(/(?:for|about|on|titled?)\s+[""']?(.+?)[""']?(?:\.|$|,)/i);
  const title = titleMatch ? titleMatch[1].trim() : `${meta.label} — ${skills.slice(0, 2).join(' & ') || currentUser.major} Initiative`;

  const descriptionParts: string[] = [];
  if (skills.length > 0) descriptionParts.push(`This ${meta.label.toLowerCase()} involves working with: ${skills.join(', ')}.`);
  descriptionParts.push(`Collaboration format: ${format === 'in-person' ? 'in person' : format}.`);
  descriptionParts.push(`Looking for ${members} dedicated team members to share the workload.`);

  const tags = skills.slice(0, 4);
  if (major) tags.push(major);

  return {
    type,
    title,
    major,
    skillsNeeded: skills.length > 0 ? skills : ['Python', 'Research', 'Data Analysis'],
    description: descriptionParts.join(' '),
    membersNeeded: members,
    activityFormat: format,
    tags,
  };
}

function generateAgenda(posts: Post[], groups: StudyGroup[], currentUser: Student): AgendaItem[] {
  const items: AgendaItem[] = [
    { time: '0:00', topic: 'Welcome & introductions', duration: '5 min' },
  ];

  const userPosts = posts.filter((p) => p.authorId === currentUser.id || p.contributors.some((c) => c.studentId === currentUser.id));
  if (userPosts.length > 0) {
    items.push({ time: '0:05', topic: `Project updates (${userPosts.length} active ${userPosts.length === 1 ? 'project' : 'projects'})`, duration: '15 min' });
  }

  const userGroups = groups.filter((g) => g.members.some((m) => m.studentId === currentUser.id));
  if (userGroups.length > 0) {
    items.push({ time: '0:20', topic: `Study group check-ins (${userGroups.length} ${userGroups.length === 1 ? 'group' : 'groups'})`, duration: '10 min' });
  }

  items.push({ time: '0:30', topic: 'Task assignment & next steps', duration: '10 min' });
  items.push({ time: '0:40', topic: 'Open discussion & Q&A', duration: '15 min' });
  items.push({ time: '0:55', topic: 'Wrap-up & action items recap', duration: '5 min' });

  return items;
}

function generateTasks(text: string, skills: string[]): Array<{ title: string; assignee?: string }> {
  const tasks: Array<{ title: string; assignee?: string }> = [];
  const lower = text.toLowerCase();

  if (lower.includes('research') || lower.includes('paper') || lower.includes('study')) {
    tasks.push({ title: 'Conduct literature review', assignee: undefined });
    tasks.push({ title: 'Define research methodology', assignee: undefined });
    tasks.push({ title: 'Collect and analyze data', assignee: undefined });
    tasks.push({ title: 'Draft findings section', assignee: undefined });
  } else if (lower.includes('project') || lower.includes('build') || lower.includes('develop') || lower.includes('app')) {
    tasks.push({ title: 'Define project architecture', assignee: undefined });
    tasks.push({ title: 'Set up development environment', assignee: undefined });
    if (skills.includes('react') || skills.includes('web development')) {
      tasks.push({ title: 'Build frontend interface', assignee: undefined });
    }
    if (skills.includes('python') || skills.includes('machine learning') || skills.includes('ai')) {
      tasks.push({ title: 'Implement core algorithm/model', assignee: undefined });
    }
    tasks.push({ title: 'Write tests and documentation', assignee: undefined });
  } else if (lower.includes('presentation') || lower.includes('slides')) {
    tasks.push({ title: 'Outline presentation structure', assignee: undefined });
    tasks.push({ title: 'Create slide deck', assignee: undefined });
    tasks.push({ title: 'Rehearse presentation', assignee: undefined });
  } else if (lower.includes('assignment') || lower.includes('homework')) {
    tasks.push({ title: 'Review assignment requirements', assignee: undefined });
    tasks.push({ title: 'Divide problems among team', assignee: undefined });
    tasks.push({ title: 'Solve and verify answers', assignee: undefined });
    tasks.push({ title: 'Compile final submission', assignee: undefined });
  } else {
    tasks.push({ title: 'Define scope and objectives', assignee: undefined });
    tasks.push({ title: 'Assign roles to team members', assignee: undefined });
    tasks.push({ title: 'Set milestones and deadlines', assignee: undefined });
    tasks.push({ title: 'Begin first deliverable', assignee: undefined });
  }

  return tasks;
}

// ===== Conversation Analysis =====

const DEADLINE_PATTERNS = [
  /\b(?:by|before|due|deadline)\s+(\w+day|\d{1,2}(?:st|nd|rd|th)?|\d{1,2}\/\d{1,2})\b/gi,
  /\b(?:next|this)\s+(week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  /\b(?:tomorrow|today|tonight)\b/gi,
  /\b(?:end of (?:week|month|semester|term))\b/gi,
  /\b\d{1,2}\s*(?:am|pm)\b/gi,
  /\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/gi,
];

const TASK_INDICATORS = [
  /\b(?:I'll|I will|i'll|i will)\s+(.+)/gi,
  /\b(?:let's|let us)\s+(.+)/gi,
  /\b(?:we should|we need to|we must|we have to)\s+(.+)/gi,
  /\b(?:can you|could you|will you)\s+(.+)/gi,
  /\b(?:assigned to|responsible for|in charge of)\s+(.+)/gi,
  /\b(?:todo|to-do|task|action item)[:\s]+(.+)/gi,
];

const QUESTION_PATTERN = /\b(?:what|how|when|where|why|who|which|can we|should we|do we|are we|will we|is there)\b[^?]*\?/gi;

const AGREEMENT_INDICATORS = [
  /\b(?:agreed|agreed upon|decided|decision|conclusion|settled on|let's go with|we'll do|approved)\b/gi,
  /\b(?:sounds good|makes sense|I agree|agreed|let's do it|perfect|great idea)\b/gi,
];

const COLLABORATION_INDICATORS = [
  /\b(?:collaborate|collaboration|work together|partner|team up|join forces)\b/gi,
  /\b(?:split the work|divide|assign roles|each take|I'll handle|you handle)\b/gi,
  /\b(?:share|combine|merge|integrate|co-author|co-write)\b/gi,
];

export function analyzeConversation(messages: ChatMessage[]): ConversationAnalysis {
  const allText = messages.map((m) => m.text).join(' ');
  const lower = allText.toLowerCase();

  // Extract skills mentioned
  const skillsDiscussed = extractSkills(allText);

  // Extract deadlines
  const deadlines: string[] = [];
  DEADLINE_PATTERNS.forEach((pattern) => {
    const matches = allText.match(pattern);
    if (matches) {
      matches.forEach((m) => {
        if (!deadlines.includes(m)) deadlines.push(m.trim());
      });
    }
  });

  // Extract tasks / action items
  const agreedTasks: string[] = [];
  TASK_INDICATORS.forEach((pattern) => {
    const matches = allText.matchAll(pattern);
    for (const match of matches) {
      const task = match[1]?.trim();
      if (task && task.length > 3 && task.length < 100) {
        const cleanTask = task.replace(/[.!?].*$/, '').trim();
        if (!agreedTasks.some((t) => t.toLowerCase() === cleanTask.toLowerCase())) {
          agreedTasks.push(cleanTask);
        }
      }
    }
  });

  // Extract questions (unresolved)
  const unresolvedQuestions: string[] = [];
  const questionMatches = allText.matchAll(QUESTION_PATTERN);
  for (const match of questionMatches) {
    const q = match[0].trim();
    if (q.length > 5 && q.length < 150 && !unresolvedQuestions.some((uq) => uq.toLowerCase() === q.toLowerCase())) {
      unresolvedQuestions.push(q);
    }
  }

  // Detect agreements/decisions
  const decisions: string[] = [];
  AGREEMENT_INDICATORS.forEach((pattern) => {
    const matches = allText.matchAll(pattern);
    for (const match of matches) {
      // Get the sentence containing the agreement
      const idx = allText.toLowerCase().indexOf(match[0].toLowerCase());
      const sentenceStart = allText.lastIndexOf('.', idx) + 1;
      const sentenceEnd = allText.indexOf('.', idx + match[0].length);
      const sentence = allText.slice(sentenceStart, sentenceEnd > 0 ? sentenceEnd + 1 : undefined).trim();
      if (sentence.length > 5 && sentence.length < 200 && !decisions.some((d) => d.toLowerCase() === sentence.toLowerCase())) {
        decisions.push(sentence);
      }
    }
  });

  // Detect collaboration areas
  const collaborationAreas: string[] = [];
  COLLABORATION_INDICATORS.forEach((pattern) => {
    const matches = allText.matchAll(pattern);
    for (const match of matches) {
      const idx = allText.toLowerCase().indexOf(match[0].toLowerCase());
      const sentenceStart = allText.lastIndexOf('.', idx) + 1;
      const sentenceEnd = allText.indexOf('.', idx + match[0].length);
      const sentence = allText.slice(sentenceStart, sentenceEnd > 0 ? sentenceEnd + 1 : undefined).trim();
      if (sentence.length > 5 && sentence.length < 200 && !collaborationAreas.some((c) => c.toLowerCase() === sentence.toLowerCase())) {
        collaborationAreas.push(sentence);
      }
    }
  });

  // Main topics — derived from most common meaningful words
  const wordFreq: Record<string, number> = {};
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'i', 'you', 'we', 'they', 'it', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about', 'that', 'this', 'have', 'has', 'will', 'can', 'do', 'did', 'so', 'if', 'as', 'be', 'my', 'your', 'our', 'me', 'him', 'her', 'them', 'from', 'by', 'not', 'no', 'yes', 'ok', 'okay', 'like', 'just', 'really', 'very', 'some', 'any', 'all', 'what', 'how', 'when', 'where', 'why', 'who']);
  const words = lower.split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w) && /^[a-z]+$/.test(w));
  words.forEach((w) => { wordFreq[w] = (wordFreq[w] ?? 0) + 1; });
  const mainTopics = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  // Key points — take meaningful messages
  const keyPoints = messages
    .filter((m) => m.text.length > 15 && !/[\u0600-\u06FF]/.test(m.text))
    .slice(-5)
    .map((m) => `${m.senderName}: ${m.text.slice(0, 80)}`);

  // Suggested next steps
  const suggestedNextSteps: string[] = [];
  if (agreedTasks.length > 0) suggestedNextSteps.push(`Follow up on ${agreedTasks.length} agreed task${agreedTasks.length === 1 ? '' : 's'}`);
  if (unresolvedQuestions.length > 0) suggestedNextSteps.push(`Address ${unresolvedQuestions.length} unresolved question${unresolvedQuestions.length === 1 ? '' : 's'}`);
  if (deadlines.length > 0) suggestedNextSteps.push(`Track ${deadlines.length} mentioned deadline${deadlines.length === 1 ? '' : 's'}`);
  if (skillsDiscussed.length > 0) suggestedNextSteps.push(`Leverage discussed skills: ${skillsDiscussed.join(', ')}`);
  if (collaborationAreas.length > 0) suggestedNextSteps.push(`Explore ${collaborationAreas.length} collaboration opportunit${collaborationAreas.length === 1 ? 'y' : 'ies'}`);
  if (suggestedNextSteps.length === 0) suggestedNextSteps.push('Schedule a follow-up conversation to continue the discussion');

  // Concise summary
  const participantCount = new Set(messages.map((m) => m.senderId)).size;
  const conciseSummary = `Conversation with ${messages.length} messages from ${participantCount} participant${participantCount === 1 ? '' : 's'}. ` +
    (mainTopics.length > 0 ? `Main topics: ${mainTopics.slice(0, 3).join(', ')}. ` : '') +
    (agreedTasks.length > 0 ? `${agreedTasks.length} task${agreedTasks.length === 1 ? '' : 's'} identified. ` : '') +
    (decisions.length > 0 ? `${decisions.length} decision${decisions.length === 1 ? '' : 's'} made. ` : '') +
    (unresolvedQuestions.length > 0 ? `${unresolvedQuestions.length} question${unresolvedQuestions.length === 1 ? '' : 's'} unresolved.` : '');

  return {
    messageCount: messages.length,
    mainTopics,
    keyPoints,
    skillsDiscussed,
    collaborationAreas,
    agreedTasks,
    unresolvedQuestions,
    deadlines,
    suggestedNextSteps,
    conciseSummary,
    decisions,
  };
}

// ===== Date/Time Parsing =====

export function parseDateRequest(text: string): { date: Date | null; time: string | null; raw: string } {
  const lower = text.toLowerCase();
  const now = new Date();
  let date: Date | null = null;
  let time: string | null = null;

  // Relative dates
  if (lower.includes('tomorrow')) {
    date = new Date(now);
    date.setDate(date.getDate() + 1);
  } else if (lower.includes('today')) {
    date = new Date(now);
  } else if (lower.includes('next week')) {
    date = new Date(now);
    date.setDate(date.getDate() + 7);
  } else if (lower.includes('next monday')) {
    date = new Date(now);
    const daysUntil = (1 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntil);
  } else if (lower.includes('next tuesday')) {
    date = new Date(now);
    const daysUntil = (2 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntil);
  } else if (lower.includes('next wednesday')) {
    date = new Date(now);
    const daysUntil = (3 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntil);
  } else if (lower.includes('next thursday')) {
    date = new Date(now);
    const daysUntil = (4 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntil);
  } else if (lower.includes('next friday')) {
    date = new Date(now);
    const daysUntil = (5 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntil);
  } else if (lower.includes('next saturday')) {
    date = new Date(now);
    const daysUntil = (6 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntil);
  } else if (lower.includes('next sunday')) {
    date = new Date(now);
    const daysUntil = (0 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntil);
  }

  // Time parsing
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3].toLowerCase();
    if (period === 'pm' && hour < 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  return { date, time, raw: text };
}

export function formatDateDisplay(date: Date, time: string | null): string {
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  if (time) {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dateStr} at ${displayHour}:${String(m).padStart(2, '0')} ${period}`;
  }
  return dateStr;
}

// ===== Study Group Search =====

function scoreGroup(group: StudyGroup, query: string, requestedMajor: string, requestedUniversity: string): number {
  let score = 0;
  const lower = query.toLowerCase();
  if (group.subject.toLowerCase().includes(lower) || lower.includes(group.subject.toLowerCase())) score += 30;
  if (requestedMajor && group.major.toLowerCase().includes(requestedMajor.toLowerCase())) score += 20;
  if (requestedUniversity && group.university === requestedUniversity) score += 25;
  if (group.description.toLowerCase().includes(lower)) score += 10;
  if (group.members.some((m) => m.name.toLowerCase().includes(lower))) score += 5;
  return score;
}

export function searchStudyGroups(groups: StudyGroup[], query: string, currentUser: Student): Array<{ id: string; subject: string; university: string; memberCount: number; meetingFrequency: string; score: number }> {
  const major = detectMajor(query, MAJORS);
  const university = detectUniversity(query, UNIVERSITY_NAMES);
  const lower = query.toLowerCase();

  return groups
    .map((g) => ({ group: g, score: scoreGroup(g, query, major, university) }))
    .filter((x) => x.score > 0 || lower.includes('study group') || lower.includes('group'))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => ({
      id: x.group.id,
      subject: x.group.subject,
      university: x.group.university,
      memberCount: x.group.members.length,
      meetingFrequency: x.group.meetingFrequency,
      score: x.score,
    }));
}

// ===== Enhanced Conversation Summary Generation =====

export function generateConversationSummary(
  messages: ChatMessage[],
  postTitle: string,
  postId: string,
  durationMinutes: number,
  participants: string[],
): import('@/data/types').ConversationSummary {
  const analysis = analyzeConversation(messages);
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    id: `summary-${Date.now()}`,
    postId,
    postTitle,
    summary: analysis.conciseSummary,
    keyPoints: analysis.keyPoints.length > 0 ? analysis.keyPoints : ['No key points extracted from this conversation'],
    actionItems: analysis.agreedTasks.length > 0 ? analysis.agreedTasks : ['No specific tasks were assigned during this conversation'],
    participants,
    createdAt: new Date().toISOString(),
    durationMinutes,
    date,
    mainTopic: analysis.mainTopics.length > 0 ? analysis.mainTopics.join(', ') : 'General discussion',
    skillsDiscussed: analysis.skillsDiscussed,
    collaborationAreas: analysis.collaborationAreas,
    decisions: analysis.decisions,
    deadlines: analysis.deadlines,
    unresolvedPoints: analysis.unresolvedQuestions,
    nextSteps: analysis.suggestedNextSteps,
  };
}

function summarizeActivity(posts: Post[], groups: StudyGroup[], activityChats: Record<string, ChatMessage[]>, currentUser: Student): string {
  const joinedPosts = posts.filter((p) => currentUser.joinedPostIds.includes(p.id));
  const authoredPosts = posts.filter((p) => p.authorId === currentUser.id);
  const userGroups = groups.filter((g) => g.members.some((m) => m.studentId === currentUser.id));

  const parts: string[] = [];

  if (authoredPosts.length > 0) {
    parts.push(`You have ${authoredPosts.length} active ${authoredPosts.length === 1 ? 'post' : 'posts'} you created:`);
    authoredPosts.slice(0, 3).forEach((p) => {
      parts.push(`  - "${p.title}" (${p.membersJoined}/${p.membersNeeded} members joined)`);
    });
  }

  if (joinedPosts.length > 0) {
    parts.push(`\nYou've joined ${joinedPosts.length} ${joinedPosts.length === 1 ? 'activity' : 'activities'}:`);
    joinedPosts.slice(0, 3).forEach((p) => {
      parts.push(`  - "${p.title}" — due ${p.dueDate}`);
    });
  }

  if (userGroups.length > 0) {
    parts.push(`\nYou're in ${userGroups.length} study ${userGroups.length === 1 ? 'group' : 'groups'}:`);
    userGroups.forEach((g) => {
      parts.push(`  - ${g.subject} (${g.members.length} members, ${g.meetingFrequency})`);
    });
  }

  const totalChats = Object.entries(activityChats).filter(([id]) => currentUser.joinedPostIds.includes(id)).reduce((sum, [, msgs]) => sum + msgs.length, 0);
  if (totalChats > 0) {
    parts.push(`\nYou have ${totalChats} new message${totalChats === 1 ? '' : 's'} across your activity chats.`);
  }

  const nextSteps: string[] = [];
  if (authoredPosts.some((p) => p.membersJoined < p.membersNeeded)) nextSteps.push('Review pending join requests on your posts');
  if (joinedPosts.length > 0) nextSteps.push('Check due dates on activities you joined');
  if (userGroups.length > 0) nextSteps.push('Catch up on your study group chats');

  if (nextSteps.length > 0) {
    parts.push(`\nSuggested next steps:`);
    nextSteps.forEach((s) => parts.push(`  -> ${s}`));
  }

  if (parts.length === 0) {
    return `Hi ${currentUser.name}! You don't have any active activities or study groups yet. I'd recommend:\n\n  -> Browse the feed to find projects that match your skills\n  -> Create a post to attract collaborators\n  -> Join a study group in your field\n\nWhat would you like to do first?`;
  }

  return parts.join('\n');
}

export function processAIInput(
  input: string,
  context: {
    currentUser: Student;
    students: Student[];
    posts: Post[];
    groups: StudyGroup[];
    activityChats: Record<string, ChatMessage[]>;
    universityNames: string[];
    majors: string[];
  }
): AIResponse {
  const { currentUser, students, posts, groups, activityChats, universityNames, majors } = context;
  const lower = input.toLowerCase().trim();

  if (!lower) {
    return { text: "I'm here to help! Tell me what you're looking for or tap one of the quick actions above." };
  }

  const skills = extractSkills(input);
  const major = detectMajor(input, majors);
  const university = detectUniversity(input, universityNames);
  const wantsCreate = lower.includes('create') || lower.includes('post') || lower.includes('start') || lower.includes('new project') || lower.includes('set up');
  const wantsFindStudent = lower.includes('find') && (lower.includes('student') || lower.includes('collaborator') || lower.includes('partner') || lower.includes('match') || lower.includes('teammate'));
  const wantsSummarize = lower.includes('summarize') || lower.includes('summary') || lower.includes('next steps') || lower.includes('my activity') || lower.includes('my conversations');
  const wantsAgenda = lower.includes('agenda') || lower.includes('meeting') || lower.includes('schedule') || lower.includes('plan');
  const wantsBrowse = lower.includes('browse') || lower.includes('explore') || lower.includes('show me') || lower.includes('find') && (lower.includes('project') || lower.includes('activity') || lower.includes('post'));

  const wantsGroup = lower.includes('study group') || lower.includes('group for') || (lower.includes('find') && lower.includes('group'));
  const wantsSchedule = lower.includes('schedule') || lower.includes('tomorrow') || lower.includes('next monday') || lower.includes('next tuesday') || lower.includes('next wednesday') || lower.includes('next thursday') || lower.includes('next friday') || lower.includes('next saturday') || lower.includes('next sunday') || (lower.includes('at') && /\d{1,2}\s*(am|pm)/i.test(lower));

  // Study group search
  if (wantsGroup && !wantsSchedule) {
    const groupResults = searchStudyGroups(groups, input, currentUser);
    if (groupResults.length > 0) {
      return {
        text: `I found ${groupResults.length} study group${groupResults.length === 1 ? '' : 's'} matching your request. Tap any to view details and join.`,
        actions: [{ type: 'navigate', label: 'Browse All Groups', route: { name: 'study-groups' } }],
        richContent: {
          kind: 'group-list',
          groups: groupResults.map((g) => ({ id: g.id, subject: g.subject, university: g.university, memberCount: g.memberCount, meetingFrequency: g.meetingFrequency })),
        },
      };
    }
    return {
      text: `I couldn't find any study groups matching "${input}". You can browse all available groups or create a new one.`,
      actions: [
        { type: 'navigate', label: 'Browse All Groups', route: { name: 'study-groups' } },
        { type: 'navigate', label: 'Create a Group', route: { name: 'create-group' } },
      ],
    };
  }

  // Scheduling / date request with study group creation
  if (wantsSchedule && (lower.includes('study group') || lower.includes('group'))) {
    const { date, time } = parseDateRequest(input);
    const subjectMatch = input.match(/(?:group for|study group for|group on)\s+(.+?)(?:\s+(?:tomorrow|today|next|at|on)\b|$)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : currentUser.major;

    if (!date) {
      return {
        text: `I'd like to help schedule a study group${subject ? ` for ${subject}` : ''}, but I couldn't determine the date. Could you specify when? For example: "Schedule a study group for tomorrow at 5 PM" or "next Monday".`,
        actions: [{ type: 'navigate', label: 'Create Group Manually', route: { name: 'create-group' } }],
      };
    }

    const dateDisplay = formatDateDisplay(date, time);
    return {
      text: `I can create a study group${subject ? ` for ${subject}` : ''} scheduled for ${dateDisplay}. Would you like me to create it?`,
      actions: [
        { type: 'confirm-create-group', label: 'Confirm & Create', data: { subject, date, time, dateDisplay } },
        { type: 'navigate', label: 'Customize Instead', route: { name: 'create-group' } },
      ],
    };
  }

  // General scheduling request
  if (wantsSchedule) {
    const { date, time } = parseDateRequest(input);
    if (date) {
      const dateDisplay = formatDateDisplay(date, time);
      return {
        text: `I understood you want to schedule something for ${dateDisplay}. To create a study group or activity, I need a bit more info:\n\n  -> What subject or topic?\n  -> Is this a study group or a project activity?\n\nFor example: "Schedule a study group for Computer Science tomorrow at 5 PM"`,
      };
    }
    return {
      text: `I'd like to help with scheduling, but I couldn't determine the date and time. Please specify when — for example: "tomorrow at 5 PM", "next Friday at 2 PM".`,
    };
  }

  if (wantsCreate && !wantsFindStudent) {
    const template = generateTemplate(input, currentUser);
    return {
      text: `I've drafted a ${POST_TYPES.find((p) => p.type === template.type)?.label} based on your description. Review the template below — you can publish it directly or adjust the details.\n\n${template.description}`,
      actions: [
        { type: 'create-post-template', label: `Publish as ${POST_TYPES.find((p) => p.type === template.type)?.label}`, data: template },
        { type: 'navigate', label: 'Customize in Create Post', route: { name: 'create-post' } },
      ],
      richContent: { kind: 'post-template', template },
    };
  }

  if (wantsFindStudent || (skills.length > 0 && !wantsBrowse)) {
    const matches = students
      .filter((s) => s.id !== currentUser.id)
      .map((s) => ({
        student: s,
        score: scoreStudent(s, input, skills, major, university),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (matches.length > 0) {
      const topMatch = matches[0];
      return {
        text: `I found ${matches.length} potential collaborator${matches.length === 1 ? '' : 's'}${skills.length > 0 ? ` matching your skills in ${skills.join(', ')}` : ''}.${topMatch.score > 50 ? ` ${topMatch.student.name} looks like an excellent match!` : ''} Tap a profile to learn more.`,
        actions: [
          { type: 'navigate', label: 'Open Find Students', route: { name: 'find-students' } },
        ],
        richContent: {
          kind: 'student-list',
          students: matches.map((m) => ({
            id: m.student.id,
            name: m.student.name,
            major: m.student.major,
            university: m.student.university,
            skills: m.student.skills,
            matchScore: Math.min(99, Math.round(m.score)),
          })),
        },
      };
    }

    return {
      text: `I couldn't find exact skill matches in the current student database. Try broadening your search, or I can open the full Find Students page so you can browse everyone and apply filters.`,
      actions: [{ type: 'navigate', label: 'Browse All Students', route: { name: 'find-students' } }],
    };
  }

  if (wantsSummarize) {
    const summary = summarizeActivity(posts, groups, activityChats, currentUser);
    const actions: AIAction[] = [];
    if (authoredOrJoined(posts, currentUser)) {
      actions.push({ type: 'navigate' as const, label: 'View My Posts', route: { name: 'home' } as Route });
    }
    if (groups.some((g) => g.members.some((m) => m.studentId === currentUser.id))) {
      actions.push({ type: 'navigate' as const, label: 'My Study Groups', route: { name: 'study-groups' } as Route });
    }
    return { text: summary, actions };
  }

  if (wantsAgenda) {
    const agenda = generateAgenda(posts, groups, currentUser);
    return {
      text: `Here's a suggested meeting agenda tailored to your current activities. Feel free to adjust the timings to fit your team's needs.`,
      richContent: { kind: 'agenda', agenda },
    };
  }

  if (wantsBrowse || skills.length > 0) {
    const matches = posts
      .map((p) => ({ post: p, score: scorePost(p, input, skills, major) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (matches.length > 0) {
      return {
        text: `I found ${matches.length} activit${matches.length === 1 ? 'y' : 'ies'} that match what you're looking for. Tap any to see the full details and join.`,
        richContent: {
          kind: 'post-list',
          posts: matches.map((m) => ({
            id: m.post.id,
            title: m.post.title,
            type: m.post.type,
            major: m.post.major,
            university: m.post.university,
          })),
        },
      };
    }
  }

  const wantsTasks = lower.includes('task') || lower.includes('todo') || lower.includes('to-do') || lower.includes('break down') || lower.includes('plan the work') || lower.includes('assign work');

  if (wantsTasks) {
    const taskList = generateTasks(input, skills);
    return {
      text: `I've generated ${taskList.length} structured tasks based on your description. You can add these to your project's Team Workspace task list.`,
      actions: [
        { type: 'create-tasks', label: 'Add Tasks to Workspace', data: taskList },
      ],
      richContent: { kind: 'task-list', tasks: taskList },
    };
  }

  return {
    text: `I can help you with several things:\n\n  -> Define your project and I'll generate a structured post template\n  -> Find collaborators that match your skills and interests\n  -> Recommend relevant activities from the feed\n  -> Summarize your active conversations and next steps\n  -> Generate a meeting agenda for your team\n  -> Break down your project into tasks\n\nTry telling me something like: "I need a Python developer for an AI health project at Jazan University"`,
  };
}

function authoredOrJoined(posts: Post[], currentUser: Student): boolean {
  return posts.some((p) => p.authorId === currentUser.id || currentUser.joinedPostIds.includes(p.id));
}

// ===== In-Conversation AI Assistance =====

export function processConversationAIInput(
  input: string,
  messages: ChatMessage[],
  postTitle: string,
): AIResponse {
  const lower = input.toLowerCase().trim();

  if (lower.includes('summarize') || lower.includes('summary')) {
    if (messages.length === 0) {
      return { text: 'There are no messages in this conversation yet to summarize. Start chatting first, then ask me to summarize!' };
    }
    const analysis = analyzeConversation(messages);
    return {
      text: `Here's my analysis of the conversation so far:\n\n${analysis.conciseSummary}`,
      richContent: { kind: 'conversation-analysis', analysis },
    };
  }

  if (lower.includes('main topic') || lower.includes('topics discussed')) {
    if (messages.length === 0) return { text: 'No messages yet to analyze.' };
    const analysis = analyzeConversation(messages);
    if (analysis.mainTopics.length > 0) {
      return {
        text: `The main topics discussed in this conversation are:\n\n${analysis.mainTopics.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}`,
      };
    }
    return { text: 'I couldn identify clear main topics from the current messages. Try sending more detailed messages first.' };
  }

  if (lower.includes('important point') || lower.includes('key point')) {
    if (messages.length === 0) return { text: 'No messages yet to extract points from.' };
    const analysis = analyzeConversation(messages);
    if (analysis.keyPoints.length > 0) {
      return {
        text: `Here are the important points from the conversation:\n\n${analysis.keyPoints.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}`,
      };
    }
    return { text: 'No significant points have been made yet. Continue your discussion and ask me again.' };
  }

  if (lower.includes('collaboration') || lower.includes('collaborate') || lower.includes('work together')) {
    if (messages.length === 0) return { text: 'No messages yet to analyze for collaboration opportunities.' };
    const analysis = analyzeConversation(messages);
    if (analysis.collaborationAreas.length > 0) {
      return {
        text: `I identified ${analysis.collaborationAreas.length} potential area${analysis.collaborationAreas.length === 1 ? '' : 's'} for collaboration:\n\n${analysis.collaborationAreas.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}`,
      };
    }
    return { text: 'No specific collaboration areas have been discussed yet. Consider talking about how you could split the work or combine your skills.' };
  }

  if (lower.includes('agree') || lower.includes('agreed') || lower.includes('decision') || lower.includes('decided')) {
    if (messages.length === 0) return { text: 'No messages yet to check for agreements.' };
    const analysis = analyzeConversation(messages);
    if (analysis.decisions.length > 0) {
      return {
        text: `Here are the agreements and decisions made so far:\n\n${analysis.decisions.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}`,
      };
    }
    return { text: 'No explicit agreements or decisions have been detected in the conversation yet.' };
  }

  if (lower.includes('task') || lower.includes('assigned') || lower.includes('todo') || lower.includes('to-do') || lower.includes('responsib')) {
    if (messages.length === 0) return { text: 'No messages yet to extract tasks from.' };
    const analysis = analyzeConversation(messages);
    if (analysis.agreedTasks.length > 0) {
      return {
        text: `Here are the tasks identified in this conversation:\n\n${analysis.agreedTasks.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}\n\nYou can add these to your Team Workspace task list.`,
        actions: [{ type: 'create-tasks', label: 'Add Tasks to Workspace', data: analysis.agreedTasks.map((t) => ({ title: t })) }],
      };
    }
    return { text: "No tasks have been explicitly assigned yet. Try using phrases like \"I'll handle...\" or \"We should...\" to help me track tasks." };
  }

  if (lower.includes('unresolved') || lower.includes('question') || lower.includes('unclear') || lower.includes('open issue')) {
    if (messages.length === 0) return { text: 'No messages yet to check for unresolved questions.' };
    const analysis = analyzeConversation(messages);
    if (analysis.unresolvedQuestions.length > 0) {
      return {
        text: `There ${analysis.unresolvedQuestions.length === 1 ? 'is' : 'are'} ${analysis.unresolvedQuestions.length} unresolved question${analysis.unresolvedQuestions.length === 1 ? '' : 's'} in this conversation:\n\n${analysis.unresolvedQuestions.map((q, i) => `  ${i + 1}. ${q}`).join('\n')}`,
      };
    }
    return { text: 'No unresolved questions detected. All questions appear to have been addressed!' };
  }

  if (lower.includes('next step') || lower.includes('what now') || lower.includes('what should we do')) {
    if (messages.length === 0) return { text: 'Start your conversation first, then I can suggest next steps based on what you discuss.' };
    const analysis = analyzeConversation(messages);
    return {
      text: `Based on the conversation, here are my suggested next steps:\n\n${analysis.suggestedNextSteps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}`,
    };
  }

  if (lower.includes('deadline') || lower.includes('due date') || lower.includes('when is') || lower.includes('timeline')) {
    if (messages.length === 0) return { text: 'No messages yet to check for deadlines.' };
    const analysis = analyzeConversation(messages);
    if (analysis.deadlines.length > 0) {
      return {
        text: `I found ${analysis.deadlines.length} deadline${analysis.deadlines.length === 1 ? '' : 's'} mentioned in the conversation:\n\n${analysis.deadlines.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}`,
      };
    }
    return { text: 'No specific deadlines have been mentioned in this conversation yet.' };
  }

  if (lower.includes('skill') || lower.includes('what skills')) {
    if (messages.length === 0) return { text: 'No messages yet to check for skills discussed.' };
    const analysis = analyzeConversation(messages);
    if (analysis.skillsDiscussed.length > 0) {
      return {
        text: `The skills discussed in this conversation are: ${analysis.skillsDiscussed.join(', ')}`,
      };
    }
    return { text: 'No specific skills have been discussed yet in this conversation.' };
  }

  if (lower.includes('meeting style') || lower.includes('meeting summary') || lower.includes('meeting report')) {
    if (messages.length === 0) return { text: 'No messages yet to generate a meeting summary.' };
    const analysis = analyzeConversation(messages);
    return {
      text: `Meeting Summary for "${postTitle}"\n\n${analysis.conciseSummary}\n\nKey Points:\n${analysis.keyPoints.map((p) => `  - ${p}`).join('\n')}\n\nTasks:\n${analysis.agreedTasks.map((t) => `  - ${t}`).join('\n')}\n\nNext Steps:\n${analysis.suggestedNextSteps.map((s) => `  - ${s}`).join('\n')}`,
      richContent: { kind: 'conversation-analysis', analysis },
    };
  }

  return {
    text: `I'm your in-conversation AI assistant. I can help you with:\n\n  -> Summarize the conversation so far\n  -> Identify main topics discussed\n  -> Extract important points\n  -> Identify collaboration areas\n  -> List agreed tasks or decisions\n  -> Find unresolved questions\n  -> Suggest next steps\n  -> Extract deadlines mentioned\n  -> List skills discussed\n  -> Generate a meeting-style summary\n\nJust ask me in plain language, like "What did we agree on?" or "Summarize this conversation".`,
  };
}

export function processQuickAction(
  action: QuickAction,
  context: {
    currentUser: Student;
    students: Student[];
    posts: Post[];
    groups: StudyGroup[];
    activityChats: Record<string, ChatMessage[]>;
    universityNames: string[];
    majors: string[];
  }
): AIResponse {
  switch (action) {
    case 'define-project':
      return {
        text: `Let's define your project! Tell me about what you want to work on. For example:\n\n"I need 3 people for a machine learning research project on healthcare data, online collaboration"\n\nI'll generate a structured post template with the right type, skills, and format — ready to publish.`,
      };
    case 'find-collaborator':
      return processAIInput(`find collaborator match for ${context.currentUser.skills.slice(0, 3).join(', ')}`, context);
    case 'summarize-activity':
      return processAIInput('summarize my activity and next steps', context);
    case 'generate-agenda':
      return processAIInput('generate meeting agenda', context);
    case 'browse-posts':
      return { text: 'Here are some activities from the feed. Tap any to see details.', actions: [{ type: 'navigate', label: 'Browse Feed', route: { name: 'home' } }] };
    case 'find-students':
      return { text: 'Let me open the Find Students page for you.', actions: [{ type: 'navigate', label: 'Find Students', route: { name: 'find-students' } }] };
    case 'create-post':
      return { text: 'Let me take you to the post creation page.', actions: [{ type: 'navigate', label: 'Create Post', route: { name: 'create-post' } }] };
    default:
      return { text: 'How can I help you today?' };
  }
}
