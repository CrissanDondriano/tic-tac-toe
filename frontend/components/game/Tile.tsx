'use client';

import { memo } from 'react';
import type { Cell, Mark } from '@/lib/types';
import MarkIcon from '../MarkIcon';

const ROWS = ['top', 'middle', 'bottom'];
const COLS = ['left', 'center', 'right'];

interface TileProps {
  index: number;
  cell: Cell;
  playable: boolean;
  isWin: boolean;
  isLast: boolean;
  ghost: Mark;
  onPlace: (index: number) => void;
}

function Tile({ index, cell, playable, isWin, isLast, ghost, onPlace }: TileProps) {
  const label = `${ROWS[Math.floor(index / 3)]} ${COLS[index % 3]}, ${cell ? `marked ${cell}` : 'empty'}`;

  const surface = isWin
    ? `${cell === 'X' ? 'bg-x-tint' : 'bg-o-tint'} win-tile`
    : isLast
      ? 'ring-4 ring-brand'
      : playable
        ? 'cursor-pointer hover:bg-line/60'
        : '';

  return (
    <button
      type="button"
      aria-label={label}
      disabled={!playable}
      onClick={() => onPlace(index)}
      className={`tile group p-[18%] focus-visible:z-10 disabled:cursor-default ${surface}`}
    >
      {cell === null && (
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-2 hidden text-[11px] font-semibold text-ink-soft/60 sm:block">
          {index + 1}
        </span>
      )}
      {cell ? (
        <MarkIcon mark={cell} className="h-full w-full animate-pop" />
      ) : playable ? (
        <MarkIcon
          mark={ghost}
          animate={false}
          className="h-full w-full opacity-0 transition-opacity group-hover:opacity-25 group-focus-visible:opacity-25"
        />
      ) : null}
    </button>
  );
}

export default memo(Tile);
