import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientProviders } from './client-providers';

export const metadata: Metadata = {
  title: 'MedReminder',
  description: 'Medication reminder app - never miss a dose',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MedReminder',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="h-full bg-gray-50 antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
