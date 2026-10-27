import { Minus } from 'lucide-react';
import type { RoundRecord } from '@/lib/types';
import MarkIcon from '../MarkIcon';

interface RoundHistoryProps {
  rounds: readonly RoundRecord[];
  player1: string;
  player2: string;
}

export default function RoundHistory({ rounds, player1, player2 }: RoundHistoryProps) {
  if (rounds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Round history">
      {rounds.map((round) => {
        const { winner } = round;
        const label =
          winner === 'draw' ? `Round ${round.number}: draw` : `Round ${round.number}: ${winner === 'player1' ? player1 : player2} won`;
        const tint = winner === 'player1' ? 'bg-x-tint' : winner === 'player2' ? 'bg-o-tint' : 'bg-white text-ink-soft';

        return (
          <span key={round.number} title={label} aria-label={label} className={`flex h-8 w-8 items-center justify-center rounded-full ${tint}`}>
            {winner === 'draw' ? (
              <Minus aria-hidden="true" className="h-4 w-4" />
            ) : (
              <MarkIcon mark={winner === 'player1' ? 'X' : 'O'} animate={false} className="h-4 w-4" />
            )}
          </span>
        );
      })}
      <span className="ml-1 text-xs text-ink-soft">Round history</span>
    </div>
  );
}
