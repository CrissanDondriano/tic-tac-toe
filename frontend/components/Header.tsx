import Link from 'next/link';
import type { ReactNode } from 'react';
import Logo from './Logo';

export default function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="page flex items-center justify-between gap-3 py-5 sm:py-7">
      <Link
        href="/"
        className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
      >
        <Logo className="h-9 w-9 shrink-0" />
        <span className="truncate text-lg font-bold tracking-tight sm:text-xl">
          tic<span className="text-x">·</span>tac<span className="text-o">·</span>toe
        </span>
      </Link>
      {children}
    </header>
  );
}
