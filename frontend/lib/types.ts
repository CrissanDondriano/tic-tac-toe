export type PlayerKey = 'player1' | 'player2';
export type RoundWinner = PlayerKey | 'draw';
export type Mark = 'X' | 'O';
export type Cell = Mark | null;
export type SessionStats = Record<PlayerKey, PlayerStats>;

export interface RoundRecord {
  number: number;
  winner: RoundWinner;
  startingPlayer: PlayerKey;
  moves: number;
  board: Array<Mark | ''>;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
}

export interface SavedGame {
  id: string;
  player1: string;
  player2: string;
  stats: SessionStats;
  rounds: RoundRecord[];
  totalRounds: number;
  winner: RoundWinner;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
}

export interface LeaderboardEntry {
  name: string;
  sessions: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface CreateGamePayload {
  player1: string;
  player2: string;
  startedAt: string;
  rounds: RoundRecord[];
}
