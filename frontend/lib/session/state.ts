import type { Cell, PlayerKey, RoundRecord, RoundWinner } from '../types';

export interface RoundResult {
  winner: RoundWinner;
  line: number[] | null;
}

export interface SessionState {
  player1: string;
  player2: string;
  startedAt: string;
  rounds: RoundRecord[];
  board: Cell[];
  turn: PlayerKey;
  roundNumber: number;
  roundStarter: PlayerKey;
  lastMove?: number | null;
  status: 'playing' | 'roundOver';
  result: RoundResult | null;
}

export type SessionAction = { type: 'PLACE'; index: number } | { type: 'NEXT_ROUND' };