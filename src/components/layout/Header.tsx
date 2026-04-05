'use client';

import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';

const pageTitles: Record<string, string> = {
  '/': 'Today',
  '/medications': 'My Medications',
  '/add': 'Add Medication',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? APP_NAME;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <h1 className="text-2xl font-bold text-gray-900 text-center">{title}</h1>
    </header>
  );
}
