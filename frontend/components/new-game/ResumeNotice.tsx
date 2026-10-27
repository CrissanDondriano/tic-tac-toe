import { History, Play, Trash2 } from 'lucide-react';
import { plural } from '@/lib/format';
import { computeStats, type SessionState } from '@/lib/session';

interface ResumeNoticeProps {
  session: SessionState;
  onResume: () => void;
  onDiscard: () => void;
}

export default function ResumeNotice({ session, onResume, onDiscard }: ResumeNoticeProps) {
  const stats = computeStats(session.rounds);

  return (
    <section aria-label="Unfinished session" className="mt-5 rounded-3xl bg-canvas p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
        <History aria-hidden="true" className="h-4 w-4" />
        Unfinished session
      </div>
      <p className="mt-2 truncate text-base font-bold">
        {session.player1} <span className="font-normal text-ink-soft">vs</span> {session.player2}
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        {plural(session.rounds.length, 'round')} played · {stats.player1.wins}–{stats.player2.wins}
      </p>
      <div className="mt-3 flex gap-3">
        <button type="button" className="btn-primary min-h-11 flex-1 px-4" onClick={onResume}>
          <Play aria-hidden="true" className="h-4 w-4 fill-current" />
          Resume
        </button>
        <button type="button" className="btn-secondary min-h-11 flex-1 px-4" onClick={onDiscard}>
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          Discard
        </button>
      </div>
    </section>
  );
}
