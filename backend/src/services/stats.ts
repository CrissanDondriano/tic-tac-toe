export type PlayerKey = 'player1' | 'player2';
export type RoundWinner = PlayerKey | 'draw';

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
}

export interface SessionSummary {
  stats: Record<PlayerKey, PlayerStats>;
  winner: RoundWinner;
}

export function summarizeRounds(rounds: ReadonlyArray<{ winner: RoundWinner }>): SessionSummary {
  const stats: Record<PlayerKey, PlayerStats> = {
    player1: { wins: 0, losses: 0, draws: 0 },
    player2: { wins: 0, losses: 0, draws: 0 },
  };

  for (const { winner } of rounds) {
    if (winner === 'draw') {
      stats.player1.draws += 1;
      stats.player2.draws += 1;
    } else {
      const loser: PlayerKey = winner === 'player1' ? 'player2' : 'player1';
      stats[winner].wins += 1;
      stats[loser].losses += 1;
    }
  }

  let winner: RoundWinner = 'draw';
  if (stats.player1.wins > stats.player2.wins) winner = 'player1';
  else if (stats.player2.wins > stats.player1.wins) winner = 'player2';

  return { stats, winner };
}
