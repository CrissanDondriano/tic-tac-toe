'use client';

import { markFor } from '@/lib/game';
import type { Cell, PlayerKey } from '@/lib/types';
import StrikeLine from './StrikeLine';
import Tile from './Tile';

interface BoardProps {
  board: readonly Cell[];
  turn: PlayerKey;
  disabled: boolean;
  winLine: readonly number[] | null;
  lastMove?: number | null;
  onPlace: (index: number) => void;
}

export default function Board({ board, turn, disabled, winLine, lastMove = null, onPlace }: BoardProps) {
  const winMark = winLine ? board[winLine[0]] : null;
  const ghost = markFor(turn);

  return (
    <div className="card relative mx-auto w-full max-w-[32rem] p-4 sm:p-5">
      <div className="relative">
        <div role="group" aria-label="Tic Tac Toe board" className="grid grid-cols-3 gap-2 sm:gap-3">
          {board.map((cell, index) => (
            <Tile
              key={index}
              index={index}
              cell={cell}
              ghost={ghost}
              playable={!disabled && cell === null}
              isWin={winLine?.includes(index) ?? false}
              isLast={lastMove === index}
              onPlace={onPlace}
            />
          ))}
        </div>
        {winLine && winMark && <StrikeLine line={winLine} mark={winMark} />}
      </div>
    </div>
  );
}
