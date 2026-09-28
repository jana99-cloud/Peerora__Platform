import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { getPostTypeMeta, MAJORS, UNIVERSITY_NAMES, ACADEMIC_LEVEL_VALUES } from '@/data/postTypes';
import { AlertCircle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const COLLABORATIVE_TYPES = ['assignment', 'research', 'project', 'presentation', 'study-group'];

export function JoinPage({ postId }: { postId: string }) {
  const { posts, navigate, joinPost, currentUser } = useApp();
  const post = posts.find((p) => p.id === postId);
  const [name, setName] = useState(currentUser.name);
  const [major, setMajor] = useState(currentUser.major);
  const [university, setUniversity] = useState(currentUser.university);
  const [level, setLevel] = useState(currentUser.level);
  const [agreedToContribution, setAgreedToContribution] = useState(false);
  const [joined, setJoined] = useState(false);

  if (!post) {
    return (
      <PageShell>
        <BackButton />
        <div className="rounded-card-lg bg-white p-12 text-center shadow-card">
          <AlertCircle className="mx-auto mb-4 text-poppy-500" size={48} />
          <p className="font-display text-xl font-bold text-navy-500">Post not found</p>
        </div>
      </PageShell>
    );
  }

  const meta = getPostTypeMeta(post.type);
  const isCollaborative = COLLABORATIVE_TYPES.includes(post.type);

  const handleJoin = () => {
    if (isCollaborative && !agreedToContribution) return;
    joinPost(post.id);
    setJoined(true);
  };

  if (joined) {
    return (
      <PageShell>
        <BackButton />
        <div className="mx-auto max-w-md rounded-card-lg bg-white p-8 text-center shadow-card animate-pop-in">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sage-300">
            <CheckCircle2 className="text-sage-600" size={40} />
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-500">You're in!</h1>
          <p className="mt-2 text-sm text-navy-400">
            You've successfully joined "{post.title}". The post creator has been notified, and you can now access the team chat.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <PillButton variant="teal" onClick={() => navigate({ name: 'activity-chat', postId: post.id })}>
              Go to Team Chat
            </PillButton>
            <PillButton variant="white" onClick={() => navigate({ name: 'home' })}>Back to Home</PillButton>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <BackButton label="Back to post" />
      <div className="mx-auto max-w-lg">
        <div className="mb-4 text-center">
          <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-btn ${meta.bgColor} text-3xl`}>
            {meta.icon}
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-500">Complete to Join</h1>
          <p className="mt-1 text-sm text-navy-400">"{post.title}"</p>
        </div>

        <div className="rounded-card-lg bg-white p-6 shadow-card space-y-4">
          <FormField label="Name" value={name} onChange={setName} />
          <FormSelect label="Major" value={major} onChange={setMajor} options={MAJORS} />
          <FormSelect label="University" value={university} onChange={setUniversity} options={UNIVERSITY_NAMES} />
          <FormSelect label="Academic Level" value={level} onChange={setLevel} options={ACADEMIC_LEVEL_VALUES} />

          <div className="flex items-start gap-2.5 rounded-card bg-daffodil-300/40 p-4">
            <Info className="shrink-0 text-daffodil-600" size={18} />
            <p className="text-xs font-semibold text-navy-500">
              Disclaimer: Your name, major, university, and student level will be visible to the post creator ({post.authorName}) when you join this activity.
            </p>
          </div>

          {/* Contribution rights notice for collaborative activities */}
          {isCollaborative && (
            <div className="rounded-card border-2 border-sage-400/40 bg-sage-300/20 p-4">
              <p className="mb-3 text-xs font-semibold text-navy-500">
                By joining this activity, I agree to acknowledge the contributions of all team members and not claim another student's work as my own.
              </p>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToContribution}
                  onChange={(e) => setAgreedToContribution(e.target.checked)}
                  className="mt-0.5 accent-sage-500 h-4 w-4 shrink-0"
                />
                <span className="text-sm font-bold text-navy-500 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-sage-600" />
                  I agree to respect and acknowledge all contributors.
                </span>
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <PillButton variant="white" onClick={() => navigate({ name: 'post-detail', postId: post.id })}>Cancel</PillButton>
            <PillButton
              variant="primary"
              onClick={handleJoin}
              disabled={isCollaborative && !agreedToContribution}
              className={isCollaborative && !agreedToContribution ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Join Now
            </PillButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
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
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}
