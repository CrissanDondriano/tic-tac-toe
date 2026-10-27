import { otherPlayer } from '../game';
import type { RoundRecord, SessionStats } from '../types';

export function computeStats(rounds: readonly RoundRecord[]): SessionStats {
  const stats: SessionStats = {
    player1: { wins: 0, losses: 0, draws: 0 },
    player2: { wins: 0, losses: 0, draws: 0 },
  };

  for (const round of rounds) {
    if (round.winner === 'draw') {
      stats.player1.draws += 1;
      stats.player2.draws += 1;
    } else {
      stats[round.winner].wins += 1;
      stats[otherPlayer(round.winner)].losses += 1;
    }
  }
  return stats;
}