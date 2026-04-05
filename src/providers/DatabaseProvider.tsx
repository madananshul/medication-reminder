'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ensureDefaultSettings } from '@/lib/db';
import { Spinner } from '@/components/ui/Spinner';

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureDefaultSettings().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
