import type { Metadata, Viewport } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });

export const metadata: Metadata = {
  title: 'Tic Tac Toe',
  description: 'Play rounds of Tic Tac Toe, keep score, and browse your game history.',
};

export const viewport: Viewport = {
  themeColor: '#F1EFFF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${sora.variable} min-h-[100dvh]`}>
        {children}
      </body>
    </html>
  );
}
