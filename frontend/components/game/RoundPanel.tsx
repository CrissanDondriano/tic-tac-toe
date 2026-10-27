'use client';

import { useId } from 'react';
import type { RoundResult } from '@/lib/session';
import type { Mark, PlayerKey, SessionStats } from '@/lib/types';
import MarkIcon from '../MarkIcon';
import Modal from '../ui/Modal';

type Outcome = 'win' | 'loss' | 'draw';

interface RoundPanelProps {
  result: RoundResult;
  roundNumber: number;
  player1: string;
  player2: string;
  stats: SessionStats;
  saving: boolean;
  error: string | null;
  onContinue: () => void;
  onStop: () => void;
}

const OUTCOME_LABEL: Record<Outcome, string> = { win: 'Winner', loss: 'Defeated', draw: 'Draw' };

function outcomeFor(result: RoundResult, player: PlayerKey): Outcome {
  if (result.winner === 'draw') return 'draw';
  return result.winner === player ? 'win' : 'loss';
}

function ResultColumn({ name, mark, outcome, stats }: { name: string; mark: Mark; outcome: Outcome; stats: SessionStats[PlayerKey] }) {
  const winSurface = mark === 'X' ? 'bg-x-tint ring-2 ring-x' : 'bg-o-tint ring-2 ring-o';
  const winBadge = mark === 'X' ? 'bg-x text-white' : 'bg-o-deep text-white';
  const badge = outcome === 'win' ? winBadge : 'bg-white text-ink-soft';

  return (
    <div className={`flex min-w-0 flex-col items-center gap-3 rounded-3xl px-2 py-4 sm:px-3 sm:py-5 ${outcome === 'win' ? winSurface : 'bg-canvas'}`}>
      <MarkIcon mark={mark} animate={false} className="h-9 w-9 sm:h-10 sm:w-10" />
      <div className="w-full min-w-0 text-center">
        <div className="truncate text-sm font-bold sm:text-base" title={name}>
          {name}
        </div>
        <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${badge}`}>
          {OUTCOME_LABEL[outcome]}
        </span>
      </div>
      <dl className="grid w-full grid-cols-3 divide-x divide-line border-t border-line pt-3 text-center">
        {[
          { label: 'Won', value: stats.wins },
          { label: 'Lost', value: stats.losses },
          { label: 'Draw', value: stats.draws },
        ].map((item) => (
          <div key={item.label} className="px-1">
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{item.label}</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function RoundPanel({ result, roundNumber, player1, player2, stats, saving, error, onContinue, onStop }: RoundPanelProps) {
  const titleId = useId();
  const winnerName = result.winner === 'draw' ? null : result.winner === 'player1' ? player1 : player2;
  const accent = result.winner === 'draw' ? 'text-ink' : result.winner === 'player1' ? 'text-x-deep' : 'text-o-deep';

  return (
    <Modal labelledBy={titleId} placement="sheet" dismissible={false} onClose={onContinue} className="max-w-md p-5 sm:p-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Round {roundNumber} complete</p>
        <h2 id={titleId} className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${accent}`}>
          {winnerName ? `${winnerName} wins!` : 'It’s a draw!'}
        </h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4">
        <ResultColumn name={player1} mark="X" outcome={outcomeFor(result, 'player1')} stats={stats.player1} />
        <ResultColumn name={player2} mark="O" outcome={outcomeFor(result, 'player2')} stats={stats.player2} />
      </div>

      <p className="mt-5 text-center text-sm text-ink-soft">Play another round, or stop to save this session to your history.</p>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-x-tint px-4 py-3 text-sm text-x-deep">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <button type="button" className="btn-primary sm:flex-1" onClick={onContinue} disabled={saving} autoFocus>
          Continue
        </button>
        <button type="button" className="btn-secondary sm:flex-1" onClick={onStop} disabled={saving}>
          {saving ? 'Saving…' : error ? 'Retry save' : 'Stop'}
        </button>
      </div>
    </Modal>
  );
}
