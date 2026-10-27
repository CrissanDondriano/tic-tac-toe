import type { Mark, PlayerKey, SessionStats } from '@/lib/types';
import MarkIcon from '../MarkIcon';

interface ScoreBoardProps {
  player1: string;
  player2: string;
  stats: SessionStats;
  roundNumber: number;
  activePlayer: PlayerKey | null;
}

function Side({ name, mark, stats, active }: { name: string; mark: Mark; stats: SessionStats[PlayerKey]; active: boolean }) {
  const mirrored = mark === 'O';
  const ring = active ? (mark === 'X' ? 'ring-[3px] ring-x' : 'ring-[3px] ring-o') : '';

  return (
    <div className={`card flex min-w-0 flex-col gap-1.5 p-3.5 transition sm:gap-2 sm:p-5 ${ring} ${mirrored ? 'items-end text-right' : 'items-start text-left'}`}>
      <div className={`flex w-full min-w-0 items-center gap-2 ${mirrored ? 'flex-row-reverse' : ''}`}>
        <MarkIcon mark={mark} animate={false} className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
        <span className="truncate text-sm font-semibold sm:text-base" title={name}>
          {name}
        </span>
      </div>
      <div className="text-5xl font-bold leading-none tabular-nums sm:text-6xl">{stats.wins}</div>
      <div className="text-xs text-ink-soft">
        <span aria-label={`${stats.losses} losses`}>{stats.losses} L</span> · <span aria-label={`${stats.draws} draws`}>{stats.draws} D</span>
      </div>
    </div>
  );
}

export default function ScoreBoard({ player1, player2, stats, roundNumber, activePlayer }: ScoreBoardProps) {
  return (
    <section aria-label="Scoreboard" className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
      <Side name={player1} mark="X" stats={stats.player1} active={activePlayer === 'player1'} />
      <div className="card-dark flex h-14 w-14 flex-col items-center justify-center !rounded-full sm:h-[4.5rem] sm:w-[4.5rem]">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-white/70">Round</span>
        <span className="text-xl font-bold leading-none tabular-nums sm:text-2xl">{roundNumber}</span>
      </div>
      <Side name={player2} mark="O" stats={stats.player2} active={activePlayer === 'player2'} />
    </section>
  );
}
