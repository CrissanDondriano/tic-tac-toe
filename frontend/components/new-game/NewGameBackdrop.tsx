import { emptyBoard } from '@/lib/game';
import type { SessionStats } from '@/lib/types';
import Header from '../Header';
import Board from '../game/Board';
import ScoreBoard from '../game/ScoreBoard';
import TurnIndicator from '../game/TurnIndicator';

const ZERO_STATS: SessionStats = {
  player1: { wins: 0, losses: 0, draws: 0 },
  player2: { wins: 0, losses: 0, draws: 0 },
};
const EMPTY_BOARD = emptyBoard();
const noop = () => undefined;

export default function NewGameBackdrop() {
  return (
    <>
      <Header />
      <main aria-hidden="true" className="pointer-events-none mx-auto flex w-full max-w-2xl select-none flex-col gap-5 px-4 pb-8 opacity-60 sm:px-6">
        <ScoreBoard player1="Player 1" player2="Player 2" stats={ZERO_STATS} roundNumber={1} activePlayer={null} />
        <TurnIndicator label="Waiting for players…" />
        <Board board={EMPTY_BOARD} turn="player1" disabled winLine={null} onPlace={noop} />
      </main>
    </>
  );
}
