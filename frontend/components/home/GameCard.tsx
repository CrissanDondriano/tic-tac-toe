'use client';

import { memo, useId, useState } from 'react';
import { formatDate, formatDuration, plural } from '@/lib/format';
import type { SavedGame } from '@/lib/types';
import MarkIcon from '../MarkIcon';
import MiniBoard from '../game/MiniBoard';
import ConfirmDialog from '../ui/ConfirmDialog';

interface GameCardProps {
  game: SavedGame;
  onDelete: (id: string) => Promise<void>;
}

function PlayerRow({ name, mark }: { name: string; mark: 'X' | 'O' }) {
  return (
    <div className="flex min-w-0 items-center gap-2 font-semibold">
      <MarkIcon mark={mark} animate={false} className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate" title={name}>
        {name}
      </span>
    </div>
  );
}

function GameCard({ game, onDelete }: GameCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const detailsId = useId();

  const { player1, player2, stats } = game;
  const names = { player1, player2 };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(game.id);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Could not delete this game.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <article className="card animate-rise overflow-hidden">
      <div className="grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:p-6">
        <div className="flex min-w-0 flex-col gap-1.5">
          <PlayerRow name={player1} mark="X" />
          <PlayerRow name={player2} mark="O" />
        </div>

        <div className="text-3xl font-bold tabular-nums sm:text-4xl" aria-label={`${stats.player1.wins} to ${stats.player2.wins}`}>
          <span className={game.winner === 'player1' ? 'text-x-deep' : ''}>{stats.player1.wins}</span>
          <span className="mx-2 text-ink-soft/50">–</span>
          <span className={game.winner === 'player2' ? 'text-o-deep' : ''}>{stats.player2.wins}</span>
        </div>

        <div className="text-sm text-ink-soft sm:text-right">
          <p>{formatDate(game.endedAt)}</p>
          <p className="mt-0.5">
            {plural(game.totalRounds, 'round')} · {plural(stats.player1.draws, 'draw')} · {formatDuration(game.durationSeconds)}
          </p>
        </div>
      </div>

      {deleteError && (
        <p role="alert" className="mx-5 mb-3 rounded-2xl bg-x-tint px-4 py-3 text-sm text-x-deep sm:mx-6">
          {deleteError}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-line/70 px-5 py-3 sm:px-6">
        <button
          type="button"
          className="rounded-lg py-1 text-sm font-semibold text-brand transition hover:text-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Hide rounds' : 'View rounds'}
        </button>
        <button
          type="button"
          className="rounded-lg py-1 text-sm text-ink-soft transition hover:text-x-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-x/40"
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </button>
      </div>

      {expanded && (
        <div id={detailsId} className="border-t border-line/70 bg-canvas/60 p-5 sm:p-6">
          <ul className="flex flex-col gap-4">
            {game.rounds.map((round) => (
              <li key={round.number} className="flex items-center gap-4">
                <MiniBoard board={round.board} />
                <div className="min-w-0 text-sm">
                  <div className="font-semibold">
                    Round {round.number} · {round.winner === 'draw' ? 'Draw' : `${names[round.winner]} won`}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-soft">
                    {names[round.startingPlayer]} started · {plural(round.moves, 'move')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this game?"
        message={`${player1} vs ${player2} (${plural(game.totalRounds, 'round')}) will be removed from your history. This can’t be undone.`}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </article>
  );
}

export default memo(GameCard);
