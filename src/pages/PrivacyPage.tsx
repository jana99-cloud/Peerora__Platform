import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { Shield, Eye, EyeOff, Mail, Phone, MessageSquare, Globe, Check, Lock } from 'lucide-react';
import { useState } from 'react';
import type { PrivacySettings, FieldKey } from '@/data/types';

const FIELD_LABELS: Record<FieldKey, string> = {
  email: 'Email',
  phone: 'Phone Number',
  university: 'University',
  major: 'Major',
  skills: 'Skills',
  interests: 'Interests',
  expertise: 'Expertise',
};

const FIELD_KEYS: FieldKey[] = ['email', 'phone', 'university', 'major', 'skills', 'interests', 'expertise'];

export function PrivacyPage() {
  const { currentUser, updatePrivacy, navigate } = useApp();
  const [settings, setSettings] = useState<PrivacySettings>(currentUser.privacy);

  const handleSave = () => {
    updatePrivacy(settings);
    navigate({ name: 'my-profile' });
  };

  return (
    <PageShell>
      <BackButton label="Back to profile" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-btn bg-navy-500">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-500">Privacy Settings</h1>
            <p className="text-sm text-navy-400">Control who can see your information and contact you</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Field Visibility */}
          <div className="rounded-card-lg bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-cream-200 text-navy-500">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-navy-500">Information Visibility</h3>
                <p className="text-xs text-navy-400">Choose which information other students can see</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {FIELD_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2 rounded-btn bg-cream-50 px-3 py-2.5 cursor-pointer transition hover:bg-cream-200">
                  <input
                    type="checkbox"
                    checked={settings.fieldVisibility[key]}
                    onChange={(e) => setSettings({ ...settings, fieldVisibility: { ...settings.fieldVisibility, [key]: e.target.checked } })}
                    className="accent-fuchsia-500 h-4 w-4"
                  />
                  <span className="text-sm font-semibold text-navy-500">{FIELD_LABELS[key]}</span>
                  <span className={`ml-auto text-xs font-bold ${settings.fieldVisibility[key] ? 'text-sage-600' : 'text-navy-400/60'}`}>
                    {settings.fieldVisibility[key] ? 'Visible' : 'Private'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Profile visibility */}
          <SettingCard icon={<Globe size={20} />} title="Profile Visibility" description="Who can view your profile page">
            <ToggleGroup
              value={settings.profileVisibility}
              onChange={(v) => setSettings({ ...settings, profileVisibility: v as 'public' | 'private' })}
              options={[
                { value: 'public', label: 'Public', icon: <Eye size={16} /> },
                { value: 'private', label: 'Private', icon: <EyeOff size={16} /> },
              ]}
            />
          </SettingCard>

          {/* Email visibility */}
          <SettingCard icon={<Mail size={20} />} title="Email Visibility" description="Who can see your email address">
            <ToggleGroup
              value={settings.emailVisibility}
              onChange={(v) => setSettings({ ...settings, emailVisibility: v as PrivacySettings['emailVisibility'] })}
              options={[
                { value: 'everyone', label: 'Everyone' },
                { value: 'same-university', label: 'Same University' },
                { value: 'no-one', label: 'No One' },
              ]}
            />
          </SettingCard>

          {/* Phone visibility */}
          <SettingCard icon={<Phone size={20} />} title="Phone Number" description="Should your phone number be visible?">
            <ToggleGroup
              value={settings.phoneVisible ? 'yes' : 'no'}
              onChange={(v) => setSettings({ ...settings, phoneVisible: v === 'yes' })}
              options={[
                { value: 'yes', label: 'Visible' },
                { value: 'no', label: 'Hidden' },
              ]}
            />
          </SettingCard>

          {/* Messaging permission */}
          <SettingCard icon={<MessageSquare size={20} />} title="Who Can Message Me" description="Control who can send you messages">
            <ToggleGroup
              value={settings.messagingPermission}
              onChange={(v) => setSettings({ ...settings, messagingPermission: v as PrivacySettings['messagingPermission'] })}
              options={[
                { value: 'everyone', label: 'Everyone' },
                { value: 'same-university', label: 'Same University' },
                { value: 'same-major', label: 'Same Major' },
                { value: 'no-one', label: 'No One' },
              ]}
            />
          </SettingCard>

          {/* Post visibility */}
          <SettingCard icon={<Eye size={20} />} title="Post Visibility" description="Who can see your posts by default">
            <ToggleGroup
              value={settings.postVisibility}
              onChange={(v) => setSettings({ ...settings, postVisibility: v as PrivacySettings['postVisibility'] })}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'same-major', label: 'Same Major' },
                { value: 'same-university', label: 'Same University' },
              ]}
            />
          </SettingCard>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <PillButton variant="white" onClick={() => navigate({ name: 'my-profile' })}>Cancel</PillButton>
          <PillButton variant="primary" onClick={handleSave}>Save Settings</PillButton>
        </div>
      </div>
    </PageShell>
  );
}

function SettingCard({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card-lg bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-cream-200 text-navy-500">{icon}</div>
        <div>
          <h3 className="font-display text-base font-bold text-navy-500">{title}</h3>
          <p className="text-xs text-navy-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleGroup({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string; icon?: React.ReactNode }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-2 rounded-btn px-4 py-2.5 text-sm font-bold transition-all duration-150 ${
            value === opt.value
              ? 'bg-fuchsia-500 text-white shadow-pop'
              : 'bg-cream-200 text-navy-400 hover:bg-cream-300'
          }`}
        >
          {opt.icon}
          {opt.label}
          {value === opt.value && <Check size={14} />}
        </button>
      ))}
    </div>
  );
}
