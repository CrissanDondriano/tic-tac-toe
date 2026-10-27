import type { Mark } from '@/lib/types';
import MarkIcon from '../MarkIcon';

export default function MiniBoard({ board }: { board: ReadonlyArray<Mark | ''> }) {
  return (
    <div
      className="grid h-14 w-14 shrink-0 grid-cols-3 overflow-hidden rounded-xl bg-canvas"
      role="img"
      aria-label={`Final board: ${board.map((c) => c || '-').join(' ')}`}
    >
      {board.map((cell, index) => (
        <span key={index} className="flex items-center justify-center p-[3px]">
          {cell && <MarkIcon mark={cell} animate={false} className="h-full w-full" />}
        </span>
      ))}
    </div>
  );
}
