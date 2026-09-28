import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/Modal';
import { PillButton } from '@/components/PillButton';
import { Lock } from 'lucide-react';

export function AuthPromptModal() {
  const { showAuthPrompt, dismissAuthPrompt, proceedToSignup } = useApp();

  return (
    <Modal open={showAuthPrompt} onClose={dismissAuthPrompt} title="Account Required">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-btn bg-fuchsia-500">
          <Lock className="text-white" size={28} />
        </div>
        <p className="mb-2 text-sm font-semibold text-navy-500">
          You need an account to perform this action.
        </p>
        <p className="mb-6 text-sm text-navy-400">
          Sign up to create posts, join activities, start study groups, and connect with students worldwide.
        </p>
        <div className="flex gap-3">
          <PillButton variant="white" onClick={dismissAuthPrompt}>Maybe Later</PillButton>
          <PillButton variant="primary" onClick={proceedToSignup}>Sign Up Now</PillButton>
        </div>
      </div>
    </Modal>
  );
}
