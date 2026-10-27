import type { Cell, Mark, PlayerKey } from './types';

export type WinLine = readonly [number, number, number];
export const WIN_LINES: ReadonlyArray<WinLine> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const emptyBoard = (): Cell[] => Array<Cell>(9).fill(null);
export const markFor = (player: PlayerKey): Mark => (player === 'player1' ? 'X' : 'O');
export const otherPlayer = (player: PlayerKey): PlayerKey =>
  player === 'player1' ? 'player2' : 'player1';

export interface BoardEvaluation {
  winner: Mark | null;
  line: WinLine | null;
  isDraw: boolean;
}

export function evaluateBoard(
  board: readonly Cell[],
  lines: ReadonlyArray<WinLine> = WIN_LINES,
): BoardEvaluation {
  for (const line of lines) {
    const [a, b, c] = line;
    const value = board[a];
    if (value && value === board[b] && value === board[c]) {
      return { winner: value, line, isDraw: false };
    }
  }
  return { winner: null, line: null, isDraw: board.every((cell) => cell !== null) };
}