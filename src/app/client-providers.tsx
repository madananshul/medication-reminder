'use client';

import type { ReactNode } from 'react';
import { DatabaseProvider } from '@/providers/DatabaseProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { InstallPrompt } from '@/components/layout/InstallPrompt';
import { ServiceWorkerRegistrar } from '@/components/layout/ServiceWorkerRegistrar';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <DatabaseProvider>
      <ToastProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-full max-w-lg mx-auto">
            <Header />
            <main className="flex-1 px-4 py-4 pb-20">{children}</main>
            <BottomNav />
          </div>
          <InstallPrompt />
          <ServiceWorkerRegistrar />
        </NotificationProvider>
      </ToastProvider>
    </DatabaseProvider>
  );
}
