import { emptyBoard, evaluateBoard, markFor, otherPlayer } from '../game';
import type { RoundRecord, RoundWinner } from '../types';
import type { SessionAction, SessionState } from './state';

export function createSession(player1: string, player2: string): SessionState {
  return {
    player1,
    player2,
    startedAt: new Date().toISOString(),
    rounds: [],
    board: emptyBoard(),
    turn: 'player1',
    roundNumber: 1,
    roundStarter: 'player1',
    lastMove: null,
    status: 'playing',
    result: null,
  };
}

function placeMark(state: SessionState, index: number): SessionState {
  const inRange = Number.isInteger(index) && index >= 0 && index < state.board.length;
  if (state.status !== 'playing' || !inRange || state.board[index] !== null) return state;

  const board = [...state.board];
  board[index] = markFor(state.turn);

  const { winner, line, isDraw } = evaluateBoard(board);
  if (!winner && !isDraw) {
    return { ...state, board, lastMove: index, turn: otherPlayer(state.turn) };
  }

  const roundWinner: RoundWinner = winner ? state.turn : 'draw';
  const round: RoundRecord = {
    number: state.roundNumber,
    winner: roundWinner,
    startingPlayer: state.roundStarter,
    moves: board.filter((cell) => cell !== null).length,
    board: board.map((cell) => cell ?? ''),
  };

  return {
    ...state,
    board,
    lastMove: index,
    status: 'roundOver',
    result: { winner: roundWinner, line: line ? [...line] : null },
    rounds: [...state.rounds, round],
  };
}

function nextRound(state: SessionState): SessionState {
  if (state.status !== 'roundOver') return state;
  const roundStarter = otherPlayer(state.roundStarter);
  return {
    ...state,
    roundNumber: state.roundNumber + 1,
    roundStarter,
    turn: roundStarter,
    board: emptyBoard(),
    lastMove: null,
    status: 'playing',
    result: null,
  };
}

const handlers: { [K in SessionAction['type']]: (state: SessionState, action: Extract<SessionAction, { type: K }>) => SessionState } = {
  PLACE: (state, action) => placeMark(state, action.index),
  NEXT_ROUND: (state) => nextRound(state),
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  const handler = handlers[action.type] as (s: SessionState, a: SessionAction) => SessionState;
  return handler ? handler(state, action) : state;
}