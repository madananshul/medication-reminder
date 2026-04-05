'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
      <div className="flex-1">
        <p className="font-bold text-lg">Install MedReminder</p>
        <p className="text-blue-100 text-base">Add to home screen for easy access</p>
      </div>
      <Button variant="secondary" size="sm" onClick={handleInstall}>
        Install
      </Button>
      <button
        onClick={() => setDismissed(true)}
        className="text-blue-200 hover:text-white p-2"
        aria-label="Dismiss"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
