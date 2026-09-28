import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { POST_TYPES, MAJORS } from '@/data/postTypes';
import { ChevronRight } from 'lucide-react';
import type { PostType } from '@/data/types';

export function CreatePostSelectorPage() {
  const { navigate } = useApp();

  return (
    <PageShell>
      <BackButton />
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-bold text-navy-500">Create a Post</h1>
        <p className="mt-2 text-navy-400">What kind of activity are you posting?</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POST_TYPES.map((pt) => (
          <button
            key={pt.type}
            onClick={() => navigate({ name: 'create-post-form', postType: pt.type })}
            className="group flex flex-col items-start gap-2 rounded-card-lg bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-btn ${pt.bgColor} text-3xl`}>
              {pt.icon}
            </div>
            <h3 className="font-display text-lg font-bold text-navy-500">{pt.label}</h3>
            <div className="flex items-center gap-1 text-sm font-bold text-navy-400 group-hover:text-fuchsia-500 transition">
              Get started <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
            </div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

import { useState } from 'react';
import { PillButton } from '@/components/PillButton';
import { getPostTypeMeta } from '@/data/postTypes';
import type { Post } from '@/data/types';

const EXTRA_FIELDS: Record<PostType, { key: string; label: string; placeholder: string; type?: 'text' | 'date' | 'select'; options?: string[] }[]> = {
  assignment: [{ key: 'scope', label: 'Assignment Scope', placeholder: 'e.g. Problem Set 5' }],
  research: [
    { key: 'researchTopic', label: 'Research Topic', placeholder: 'e.g. LLM Hallucination Detection' },
    { key: 'requiredSkills', label: 'Required Skills', placeholder: 'e.g. Python, NLP, PyTorch' },
  ],
  'study-group': [
    { key: 'course', label: 'Course', placeholder: 'e.g. CS420 Machine Learning' },
    { key: 'meetingFrequency', label: 'Meeting Frequency', placeholder: 'e.g. Weekly — Thursdays 7pm' },
    { key: 'groupSize', label: 'Group Size', placeholder: 'e.g. 6' },
  ],
  project: [
    { key: 'projectScope', label: 'Project Scope', placeholder: 'e.g. Full-stack IoT system' },
    { key: 'techNeeded', label: 'Tech / Tools Needed', placeholder: 'e.g. Arduino, React, Node.js' },
    { key: 'teamSize', label: 'Team Size', placeholder: 'e.g. 5' },
  ],
  survey: [
    { key: 'surveyLink', label: 'Survey Link / Target', placeholder: 'e.g. forms.example/survey' },
    { key: 'targetAudience', label: 'Target Audience', placeholder: 'e.g. All CS students' },
  ],
  discussion: [
    { key: 'format', label: 'Format', placeholder: 'Open-ended or scheduled', type: 'select', options: ['Open-ended', 'Scheduled session'] },
    { key: 'scheduledFor', label: 'Scheduled For (if applicable)', placeholder: 'e.g. 2026-09-22 18:00' },
  ],
  presentation: [
    { key: 'presentationDate', label: 'Presentation Date & Time', placeholder: 'e.g. 2026-09-28 14:00' },
    { key: 'coPresenterNeeds', label: 'Slide / Co-presenter Needs', placeholder: 'e.g. Energy efficiency section' },
  ],
  opportunity: [
    { key: 'opportunityType', label: 'Opportunity Type', placeholder: 'Internship, Competition, Exchange', type: 'select', options: ['Internship', 'Competition', 'Exchange Program', 'Scholarship', 'Research Position'] },
    { key: 'eligibility', label: 'Eligibility', placeholder: 'e.g. CS Juniors & Seniors, GPA 3.5+' },
  ],
  announcement: [
    { key: 'audience', label: 'Audience', placeholder: 'Major, University, or Global', type: 'select', options: ['Major', 'University', 'Global'] },
    { key: 'expiryDate', label: 'Expiry Date', placeholder: 'e.g. 2026-10-05', type: 'date' },
  ],
};

export function CreatePostFormPage({ postType }: { postType: PostType }) {
  const { navigate, addPost, currentUser } = useApp();
  const meta = getPostTypeMeta(postType);
  const extraFields = EXTRA_FIELDS[postType];

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [major, setMajor] = useState(currentUser.major);
  const [membersNeeded, setMembersNeeded] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [skillsNeeded, setSkillsNeeded] = useState('');
  const [activityFormat, setActivityFormat] = useState<'online' | 'in-person' | 'hybrid'>('online');
  const [extra, setExtra] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const post: Post = {
      id: `p${Date.now()}`,
      type: postType,
      title: title || 'Untitled Post',
      major,
      university: currentUser.university,
      country: currentUser.country,
      dueDate: dueDate || '2026-10-01',
      membersNeeded: parseInt(membersNeeded) || 4,
      membersJoined: 1,
      description: description || 'No description provided.',
      authorId: currentUser.id,
      authorName: currentUser.name,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      skillsNeeded: skillsNeeded ? skillsNeeded.split(',').map((s) => s.trim()) : [],
      contributors: [
        { studentId: currentUser.id, name: currentUser.name, major: currentUser.major, university: currentUser.university },
      ],
      activityFormat,
      extra,
      createdAt: '2026-09-20',
    };
    addPost(post);
    navigate({ name: 'post-detail', postId: post.id });
  };

  return (
    <PageShell>
      <BackButton label="Back to post types" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-btn ${meta.bgColor} text-3xl`}>
            {meta.icon}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-500">Create {meta.label}</h1>
            <p className="text-sm text-navy-400">Fill in the details below to post your activity</p>
          </div>
        </div>

        <div className="rounded-card-lg bg-white p-6 shadow-card space-y-4">
          <FormField label="Title" value={title} onChange={setTitle} placeholder="Give your post a clear title" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Due Date" value={dueDate} onChange={setDueDate} type="date" />
            <FormSelect label="Major" value={major} onChange={setMajor} options={MAJORS} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Members Needed" value={membersNeeded} onChange={setMembersNeeded} type="number" placeholder="e.g. 4" />
            <FormField label="Tags (comma-separated)" value={tags} onChange={setTags} placeholder="AI, Python, Research" />
          </div>
          <FormField label="Skills Needed (comma-separated)" value={skillsNeeded} onChange={setSkillsNeeded} placeholder="e.g. Python, Machine Learning, UI/UX" />

          {/* Activity Format */}
          <div>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">Activity Format</span>
            <div className="flex gap-2">
              {(['online', 'in-person', 'hybrid'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setActivityFormat(fmt)}
                  className={`rounded-btn px-4 py-2.5 text-sm font-bold capitalize transition-all ${
                    activityFormat === fmt
                      ? 'bg-fuchsia-500 text-white shadow-pop'
                      : 'bg-cream-50 border-2 border-cream-300 text-navy-400 hover:bg-cream-100'
                  }`}
                >
                  {fmt === 'in-person' ? 'In Person' : fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Extra fields */}
          {extraFields.map((field) => (
            <div key={field.key}>
              {field.type === 'select' ? (
                <FormSelect
                  label={field.label}
                  value={extra[field.key] ?? ''}
                  onChange={(v) => setExtra({ ...extra, [field.key]: v })}
                  options={field.options ?? []}
                  placeholder={field.placeholder}
                />
              ) : (
                <FormField
                  label={field.label}
                  value={extra[field.key] ?? ''}
                  onChange={(v) => setExtra({ ...extra, [field.key]: v })}
                  placeholder={field.placeholder}
                  type={field.type}
                />
              )}
            </div>
          ))}

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what you're looking for, what the work involves, and any requirements..."
              className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition resize-none"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <PillButton variant="white" onClick={() => navigate({ name: 'create-post' })}>Cancel</PillButton>
            <PillButton variant="primary" onClick={handleSubmit}>Publish Post</PillButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function FormField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 placeholder:text-navy-400/50 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
      />
    </label>
  );
}

function FormSelect({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-navy-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-btn border-2 border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 transition"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}
