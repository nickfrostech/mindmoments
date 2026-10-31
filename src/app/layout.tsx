import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'MindMoments — Cognitive Diary & Memory Reflection',
  description:
    'A private, local-first personal diary and cognitive reflection system to track focus, fatigue, and strategic decisions.',
  applicationName: 'MindMoments',
  authors: [{ name: 'MindMoments Team' }],
  creator: 'MindMoments',
  keywords: [
    'cognitive diary',
    'memory reflection',
    'focus tracker',
    'daily journal',
    'local-first',
    'indexeddb',
    'open-weight ai',
  ],
  icons: {
    icon: [
      { url: '/mindmoments-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/mindmoments-logo.svg',
    apple: '/mindmoments-logo.svg',
  },
  openGraph: {
    title: 'MindMoments — Cognitive Diary & Memory Reflection',
    description:
      'A private, local-first personal diary and cognitive reflection system to track focus, fatigue, and strategic decisions.',
    url: 'https://mindmoments.app',
    siteName: 'MindMoments',
    images: [
      {
        url: '/mindmoments-logo.svg',
        width: 64,
        height: 64,
        alt: 'MindMoments Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MindMoments — Cognitive Diary & Memory Reflection',
    description:
      'A private, local-first personal diary and cognitive reflection system to track focus, fatigue, and strategic decisions.',
    images: ['/mindmoments-logo.svg'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-on-surface font-body antialiased selection:bg-primary-blue/20 selection:text-primary-blue">
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
