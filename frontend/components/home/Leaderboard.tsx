import { Trophy } from 'lucide-react';
import { plural } from '@/lib/format';
import type { LeaderboardEntry } from '@/lib/types';

const TOP = 5;

export default function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <section className="card p-5 sm:p-6" aria-labelledby="leaderboard-title">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-canvas text-brand">
          <Trophy aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 id="leaderboard-title" className="text-lg font-bold">
            Leaderboard
          </h2>
          <p className="text-xs text-ink-soft">Win rate across all sessions</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Play a session to put your name up here.</p>
      ) : (
        <ol className="mt-3 flex flex-col">
          {entries.slice(0, TOP).map((entry, index) => {
            const played = entry.wins + entry.losses + entry.draws;
            const rate = played ? Math.round((entry.wins / played) * 100) : 0;
            return (
              <li key={entry.name.toLowerCase()} className="flex items-center gap-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-sm font-bold" aria-label={`Rank ${index + 1}`}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{entry.name}</div>
                  <div className="text-xs text-ink-soft">
                    {plural(entry.sessions, 'session')} · {entry.wins}W {entry.losses}L {entry.draws}D
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums text-brand">{rate}%</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
