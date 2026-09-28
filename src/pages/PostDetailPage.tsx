import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { PostTypeTag } from '@/components/Tags';
import { getPostTypeMeta } from '@/data/postTypes';
import { Users, Calendar, MapPin, GraduationCap, MessageSquare, Flag, Share2, AlertCircle, Wrench, Award, MessagesSquare, Check, X, UserCheck, Clock } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { UniversityLogo } from '@/components/UniversityLogo';
import type { CollaborationRequest } from '@/data/types';

const COLLABORATIVE_TYPES = ['assignment', 'research', 'project', 'presentation', 'study-group'];

export function PostDetailPage({ postId }: { postId: string }) {
  const { posts, navigate, joinPost, currentUser, reportPost, reportedPostIds, requireAuth, students, getConversationByPostId, collaborationRequests, submitCollaborationRequest, respondToCollaborationRequest } = useApp();
  const post = posts.find((p) => p.id === postId);
  const [showReport, setShowReport] = useState(false);
  const [showContributionReport, setShowContributionReport] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  if (!post) {
    return (
      <PageShell>
        <BackButton />
        <div className="rounded-card-lg bg-white p-12 text-center shadow-card">
          <AlertCircle className="mx-auto mb-4 text-poppy-500" size={48} />
          <p className="font-display text-xl font-bold text-navy-500">Post not found</p>
          <PillButton variant="navy" className="mt-4" onClick={() => navigate({ name: 'home' })}>Back to Home</PillButton>
        </div>
      </PageShell>
    );
  }

  const meta = getPostTypeMeta(post.type);
  const hasJoined = currentUser.joinedPostIds.includes(post.id);
  const isFull = post.membersJoined >= post.membersNeeded;
  const isAuthor = post.authorId === currentUser.id;
  const isReported = reportedPostIds.includes(post.id);
  const isCollaborative = COLLABORATIVE_TYPES.includes(post.type);

  const author = students.find((s) => s.id === post.authorId);
  const authorSkills = author && author.privacy.fieldVisibility.skills ? author.skills : [];
  const skillsNeeded = post.skillsNeeded || [];

  const handleJoin = () => {
    if (requireAuth({ name: 'join', postId: post.id })) {
      submitCollaborationRequest(post.id);
    }
  };

  const postRequests = collaborationRequests.filter((r) => r.postId === post.id);
  const pendingRequests = postRequests.filter((r) => r.status === 'pending');
  const myRequest = postRequests.find((r) => r.requesterId === currentUser.id);

  return (
    <PageShell>
      <BackButton />
      <div className="mx-auto max-w-3xl">
        {/* Hero card */}
        <div className="relative overflow-hidden rounded-card-lg border-2 border-cream-300 p-6 shadow-card sm:p-8" style={{ backgroundColor: '#FDFBF7' }}>
          <div className={`absolute inset-x-0 top-0 h-2 ${meta.color}`} />
          <div className="absolute right-0 top-0 h-32 w-32 squiggle-bg opacity-30" />
          <div className="relative flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <PostTypeTag type={post.type} size="md" />
              <span className="rounded-btn bg-cream-300 px-3 py-1 text-xs font-bold text-navy-500">
                {post.major}
              </span>
              <span className="rounded-btn bg-cream-300 px-3 py-1 text-xs font-bold text-navy-500">
                {post.university}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-500 sm:text-3xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-navy-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> Due {formatDate(post.dueDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={16} /> {post.membersJoined}/{post.membersNeeded} members
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} /> {post.country}
              </span>
              {post.activityFormat && (
                <span className={`flex items-center gap-1.5 rounded-btn px-2.5 py-1 text-xs font-bold ${
                  post.activityFormat === 'online' ? 'bg-sky-300 text-sky-700' :
                  post.activityFormat === 'in-person' ? 'bg-peach-300 text-peach-600' :
                  'bg-teal-300 text-teal-700'
                }`}>
                  {post.activityFormat === 'in-person' ? 'In Person' : post.activityFormat === 'hybrid' ? 'Hybrid' : 'Online'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Illustration placeholder */}
        <div className={`mt-4 flex h-40 items-center justify-center rounded-card-lg ${meta.bgColor} squiggle-bg`}>
          <span className="text-6xl opacity-50">{meta.icon}</span>
        </div>

        {/* Content grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-card-lg bg-white p-6 shadow-card">
              <h2 className="mb-2 font-display text-lg font-bold text-navy-500">About this {meta.label}</h2>
              <p className="text-sm leading-relaxed text-navy-400">{post.description}</p>
            </div>

            {/* Posted by + Skills */}
            <div className="rounded-card-lg bg-white p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-bold text-navy-500">Posted by</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lavender-300 font-display font-bold text-navy-500">
                  {post.authorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-navy-500">{post.authorName}</p>
                  <p className="text-xs font-semibold text-navy-400">{post.major}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <UniversityLogo name={post.university} size={18} />
                    <p className="text-xs font-semibold text-navy-400">{post.university}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate({ name: 'student-profile', studentId: post.authorId })}
                className="mb-4 w-full rounded-btn bg-cream-200 py-2 text-xs font-bold text-navy-500 transition hover:bg-cream-300"
              >
                View Profile
              </button>

              {/* Student Skills */}
              {authorSkills.length > 0 && (
                <div className="mb-3">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-400">
                    <Award size={14} className="text-daffodil-500" /> Student Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {authorSkills.map((skill) => (
                      <span key={skill} className="rounded-btn bg-sky-300/50 px-2.5 py-1 text-xs font-bold text-sky-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Needed */}
              {skillsNeeded.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-400">
                    <Wrench size={14} className="text-fuchsia-500" /> Skills Needed
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsNeeded.map((skill) => (
                      <span key={skill} className="rounded-btn bg-fuchsia-300/50 px-2.5 py-1 text-xs font-bold text-fuchsia-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contributors (collaborative only) */}
            {isCollaborative && post.contributors && post.contributors.length > 0 && (
              <div className="rounded-card-lg bg-white p-6 shadow-card">
                <h2 className="mb-3 font-display text-lg font-bold text-navy-500">Contributors</h2>
                <div className="space-y-2">
                  {post.contributors.map((contributor) => (
                    <div key={contributor.studentId} className="flex items-center gap-3 rounded-btn bg-cream-50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender-300 font-display text-xs font-bold text-navy-500">
                        {contributor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy-500">{contributor.name}</p>
                        <p className="text-xs font-semibold text-navy-400">{contributor.major} · {contributor.university}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post.extra && Object.keys(post.extra).length > 0 && (
              <div className="rounded-card-lg bg-white p-6 shadow-card">
                <h2 className="mb-3 font-display text-lg font-bold text-navy-500">Details</h2>
                <dl className="space-y-2">
                  {Object.entries(post.extra).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-4 border-b border-cream-200 pb-2">
                      <dt className="text-sm font-bold text-navy-400">{formatKey(key)}</dt>
                      <dd className="text-sm font-semibold text-navy-500 text-right">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="rounded-card-lg bg-white p-6 shadow-card">
              <h2 className="mb-3 font-display text-lg font-bold text-navy-500">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-btn bg-lavender-300 px-3 py-1 text-xs font-bold text-navy-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-card-lg bg-white p-6 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-sm font-bold text-navy-500">Members</span>
                <span className={`rounded-btn px-2.5 py-1 text-xs font-bold ${isFull ? 'bg-poppy-400 text-white' : 'bg-sage-400 text-white'}`}>
                  {post.membersJoined}/{post.membersNeeded}
                </span>
              </div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-cream-200">
                <div
                  className={`h-full ${meta.color} transition-all`}
                  style={{ width: `${Math.min(100, (post.membersJoined / post.membersNeeded) * 100)}%` }}
                />
              </div>
              {isAuthor ? (
                <>
                  {pendingRequests.length > 0 && (
                    <PillButton variant="primary" className="w-full mb-2" onClick={() => setShowRequests(true)}>
                      <UserCheck size={18} /> Review Requests ({pendingRequests.length})
                    </PillButton>
                  )}
                  <PillButton variant="teal" className="w-full mb-2" onClick={() => navigate({ name: 'activity-chat', postId: post.id })}>
                    <MessageSquare size={18} /> Open Team Chat
                  </PillButton>
                  <PillButton variant="primary" className="w-full" onClick={() => navigate({ name: 'activity-chat', postId: post.id })}>
                    <MessagesSquare size={18} /> Start Conversation
                  </PillButton>
                </>
              ) : hasJoined ? (
                <>
                  <PillButton variant="teal" className="w-full mb-2" onClick={() => navigate({ name: 'activity-chat', postId: post.id })}>
                    <MessageSquare size={18} /> Go to Team Chat
                  </PillButton>
                  <PillButton variant="primary" className="w-full" onClick={() => navigate({ name: 'activity-chat', postId: post.id })}>
                    <MessagesSquare size={18} /> Start Conversation
                  </PillButton>
                </>
              ) : myRequest ? (
                <div className="rounded-btn bg-cream-200 px-4 py-3 text-center">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-navy-500">
                    <Clock size={16} className="text-navy-400" />
                    {myRequest.status === 'pending' ? 'Request sent — awaiting approval' : myRequest.status === 'accepted' ? 'Accepted!' : 'Request declined'}
                  </p>
                </div>
              ) : isFull ? (
                <PillButton variant="white" className="w-full" disabled>This activity is full</PillButton>
              ) : (
                <PillButton variant="primary" className="w-full" onClick={handleJoin}>
                  Request to Join
                </PillButton>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReport(true)}
                  disabled={isReported}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-white py-2.5 text-xs font-bold text-poppy-500 border-2 border-poppy-400/30 transition hover:bg-poppy-400/10 disabled:opacity-50"
                >
                  <Flag size={14} /> {isReported ? 'Reported' : 'Report'}
                </button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-white py-2.5 text-xs font-bold text-navy-500 border-2 border-cream-300 transition hover:bg-cream-200">
                  <Share2 size={14} /> Share
                </button>
              </div>
              {isCollaborative && (
                <button
                  onClick={() => setShowContributionReport(true)}
                  className="flex items-center justify-center gap-1.5 rounded-btn bg-white py-2.5 text-xs font-bold text-plum-600 border-2 border-plum-400/30 transition hover:bg-plum-400/10"
                >
                  <AlertCircle size={14} /> Report Contribution Issue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal open={showReport} onClose={() => setShowReport(false)} title="Report Post">
        <p className="mb-4 text-sm text-navy-400">
          Help us keep the community safe. Tell us why you're reporting this post.
        </p>
        <div className="space-y-2">
          {['Spam or misleading', 'Harassment or hate speech', 'Inappropriate content', 'Academic dishonesty', 'Other'].map((reason) => (
            <button
              key={reason}
              onClick={() => { reportPost(post.id); setShowReport(false); }}
              className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-3 text-left text-sm font-semibold text-navy-500 transition hover:border-poppy-400 hover:bg-poppy-400/5"
            >
              {reason}
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={showContributionReport} onClose={() => setShowContributionReport(false)} title="Report Contribution Issue">
        <p className="mb-4 text-sm text-navy-400">
          Help us ensure fair recognition of all contributors. What's the issue?
        </p>
        <div className="space-y-2">
          {['My contribution was not acknowledged', 'My work was used without credit', 'Incorrect contributor information'].map((reason) => (
            <button
              key={reason}
              onClick={() => { reportPost(post.id); setShowContributionReport(false); }}
              className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-3 text-left text-sm font-semibold text-navy-500 transition hover:border-plum-400 hover:bg-plum-400/5"
            >
              {reason}
            </button>
          ))}
        </div>
      </Modal>

      {/* Collaboration requests modal */}
      <Modal open={showRequests} onClose={() => setShowRequests(false)} title="Collaboration Requests">
        {pendingRequests.length === 0 ? (
          <p className="text-center text-sm text-navy-400 py-8">No pending requests.</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onAccept={() => { respondToCollaborationRequest(req.id, 'accepted'); }}
                onReject={() => { respondToCollaborationRequest(req.id, 'rejected'); }}
                onViewProfile={() => { setShowRequests(false); navigate({ name: 'student-profile', studentId: req.requesterId }); }}
              />
            ))}
          </div>
        )}
      </Modal>
    </PageShell>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

function RequestCard({ request, onAccept, onReject, onViewProfile }: {
  request: CollaborationRequest;
  onAccept: () => void;
  onReject: () => void;
  onViewProfile: () => void;
}) {
  return (
    <div className="rounded-card-lg border-2 border-cream-300 bg-cream-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-300 font-display text-xs font-bold text-navy-500 shrink-0">
          {request.requesterName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy-500">{request.requesterName}</p>
          <p className="text-xs font-semibold text-navy-400">{request.requesterMajor} · {request.requesterUniversity}</p>
          <button onClick={onViewProfile} className="mt-1 text-xs font-bold text-fuchsia-500 hover:underline">
            View Profile
          </button>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={onAccept} className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-sage-500 py-2.5 text-sm font-bold text-white transition hover:bg-sage-600">
          <Check size={16} /> Accept
        </button>
        <button onClick={onReject} className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-poppy-400 py-2.5 text-sm font-bold text-white transition hover:bg-poppy-500">
          <X size={16} /> Reject
        </button>
      </div>
    </div>
  );
}
