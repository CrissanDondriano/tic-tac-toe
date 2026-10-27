'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { plural } from '@/lib/format';
import type { SavedGame } from '@/lib/types';
import MarkIcon from '../MarkIcon';
import GameCard from './GameCard';

interface HistorySectionProps {
  status: 'loading' | 'ready' | 'error';
  games: SavedGame[];
  error: string;
  onRetry: () => void;
  onDelete: (id: string) => Promise<void>;
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card h-32 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center gap-4 px-6 py-12 text-center">
      <div className="flex gap-3">
        <MarkIcon mark="X" animate={false} className="h-12 w-12" />
        <MarkIcon mark="O" animate={false} className="h-12 w-12" />
      </div>
      <h3 className="text-xl font-bold">No games yet</h3>
      <p className="max-w-xs text-sm text-ink-soft">Finished sessions show up here with scores and round-by-round boards.</p>
      <Link href="/new" className="btn-primary w-full sm:w-auto">
        Start your first game
      </Link>
    </div>
  );
}

export default function HistorySection({ status, games, error, onRetry, onDelete }: HistorySectionProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const visible = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    if (!needle) return games;
    return games.filter((game) => game.player1.toLowerCase().includes(needle) || game.player2.toLowerCase().includes(needle));
  }, [games, deferredQuery]);

  const rounds = useMemo(() => games.reduce((sum, game) => sum + game.totalRounds, 0), [games]);
  const hasGames = status === 'ready' && games.length > 0;

  return (
    <section aria-labelledby="history-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="history-title" className="text-2xl font-bold tracking-tight">
            Game history
          </h2>
          {hasGames && (
            <p className="mt-0.5 text-sm text-ink-soft">
              {plural(games.length, 'session')} · {plural(rounds, 'round')}
            </p>
          )}
        </div>
        {hasGames && (
          <input
            type="search"
            className="input !min-h-11 w-full text-sm sm:max-w-56"
            placeholder="Search players…"
            aria-label="Search games by player name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        )}
      </div>

      {status === 'loading' && <Skeleton />}

      {status === 'error' && (
        <div role="alert" className="card flex flex-col items-start gap-4 p-6">
          <div>
            <h3 className="text-lg font-bold">Couldn’t load your games</h3>
            <p className="mt-1 text-sm text-ink-soft">{error}</p>
          </div>
          <button type="button" className="btn-secondary" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && games.length === 0 && <EmptyState />}

      {hasGames && (
        <div className="flex flex-col gap-4">
          {visible.map((game) => (
            <GameCard key={game.id} game={game} onDelete={onDelete} />
          ))}
          {visible.length === 0 && <p className="card p-6 text-center text-sm text-ink-soft">No games match “{deferredQuery}”.</p>}
        </div>
      )}
    </section>
  );
}
