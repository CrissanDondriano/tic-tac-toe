'use client';

import Header from '@/components/Header';
import HistorySection from '@/components/home/HistorySection';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import Leaderboard from '@/components/home/Leaderboard';
import SavedBanner from '@/components/home/SavedBanner';
import { useFlash } from '@/hooks/useFlash';
import { useGameHistory } from '@/hooks/useGameHistory';

export default function HomePage() {
  const { status, games, leaders, error, reload, remove } = useGameHistory();
  const { message, dismiss } = useFlash();

  return (
    <>
      <Header></Header>

      <main className="page pb-[max(4rem,env(safe-area-inset-bottom))]">
        <Hero />
        {message && <SavedBanner message={message} onDismiss={dismiss} />}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          <HistorySection status={status} games={games} error={error} onRetry={reload} onDelete={remove} />
          <aside className="flex flex-col gap-5">
            {status === 'ready' && <Leaderboard entries={leaders} />}
            <HowItWorks />
          </aside>
        </div>
      </main>
    </>
  );
}
