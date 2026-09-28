import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { PillButton } from '@/components/PillButton';
import { PostTypeTag } from '@/components/Tags';
import { getPostTypeMeta } from '@/data/postTypes';
import { UniversityLogo } from '@/components/UniversityLogo';
import { Clock, Users, Wrench, MessageSquare, Target } from 'lucide-react';
import type { Post, ConversationDuration } from '@/data/types';

const DURATION_OPTIONS: { value: ConversationDuration; label: string; desc: string }[] = [
  { value: 10, label: '10 minutes', desc: 'Quick intro & alignment' },
  { value: 20, label: '20 minutes', desc: 'Detailed discussion' },
  { value: 30, label: '30 minutes', desc: 'Deep collaboration planning' },
];

const PURPOSES = [
  'Discuss whether you are a good match for this project',
  'Align on roles, skills, and contribution expectations',
  'Plan the project timeline and first deliverables',
  'Explore shared research interests and goals',
];

interface Props {
  open: boolean;
  onClose: () => void;
  post: Post;
  onStart: (purpose: string, durationMinutes: ConversationDuration) => void;
}

export function ConversationPurposeModal({ open, onClose, post, onStart }: Props) {
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [duration, setDuration] = useState<ConversationDuration>(20);
  const meta = getPostTypeMeta(post.type);

  const handleStart = () => {
    onStart(purpose, duration);
  };

  return (
    <Modal open={open} onClose={onClose} title="Start a Purpose-Driven Conversation">
      {/* Project info card */}
      <div className="mb-4 rounded-card-lg border-2 border-cream-300 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{meta.icon}</span>
          <h4 className="font-display text-base font-bold text-navy-500">{post.title}</h4>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <PostTypeTag type={post.type} size="sm" />
          <span className="rounded-btn bg-cream-200 px-2.5 py-1 text-xs font-bold text-navy-500">{post.major}</span>
          <span className="flex items-center gap-1 rounded-btn bg-cream-200 px-2.5 py-1 text-xs font-bold text-navy-500">
            <UniversityLogo name={post.university} size={14} />
            {post.university}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-navy-400">
            <Users size={14} className="text-fuchsia-500" />
            <span className="font-bold">{post.membersJoined}/{post.membersNeeded} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-navy-400">
            <Clock size={14} className="text-lavender-500" />
            <span className="font-bold">Due {new Date(post.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {post.skillsNeeded.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 flex items-center gap-1 text-xs font-bold uppercase text-navy-400">
              <Wrench size={12} className="text-fuchsia-500" /> Required Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.skillsNeeded.map((skill) => (
                <span key={skill} className="rounded-btn bg-fuchsia-300/50 px-2 py-0.5 text-xs font-bold text-fuchsia-600">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {post.contributors.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-xs font-bold uppercase text-navy-400">Participants</p>
            <div className="flex flex-wrap gap-1.5">
              {post.contributors.map((c) => (
                <span key={c.studentId} className="rounded-btn bg-lavender-200 px-2 py-0.5 text-xs font-bold text-navy-500">{c.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Purpose selection */}
      <div className="mb-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-400">
          <Target size={14} className="text-fuchsia-500" /> Conversation Purpose
        </p>
        <div className="space-y-2">
          {PURPOSES.map((p) => (
            <button
              key={p}
              onClick={() => setPurpose(p)}
              className={`w-full rounded-btn border-2 px-3 py-2.5 text-left text-sm font-semibold transition ${
                purpose === p
                  ? 'border-fuchsia-400 bg-fuchsia-300/20 text-navy-500'
                  : 'border-cream-300 bg-cream-50 text-navy-400 hover:border-cream-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 shrink-0 ${purpose === p ? 'border-fuchsia-500 bg-fuchsia-500' : 'border-cream-400'}`}>
                  {purpose === p && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                {p}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration selection */}
      <div className="mb-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-400">
          <Clock size={14} className="text-lavender-500" /> Select Duration
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDuration(opt.value)}
              className={`rounded-card border-2 p-3 text-center transition ${
                duration === opt.value
                  ? 'border-sage-500 bg-sage-300/20 shadow-soft'
                  : 'border-cream-300 bg-cream-50 hover:border-cream-400'
              }`}
            >
              <Clock size={18} className={`mx-auto mb-1 ${duration === opt.value ? 'text-sage-600' : 'text-navy-400'}`} />
              <p className={`text-sm font-bold ${duration === opt.value ? 'text-sage-700' : 'text-navy-500'}`}>{opt.label}</p>
              <p className="text-[10px] font-semibold text-navy-400 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <PillButton variant="primary" className="w-full" onClick={handleStart}>
        <MessageSquare size={18} /> Start Conversation
      </PillButton>
    </Modal>
  );
}
