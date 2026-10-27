import type { Mark } from '@/lib/types';

const CENTERS = [46, 150, 254] as const;
const OVERSHOOT = 24;
const center = (index: number) => ({ x: CENTERS[index % 3], y: CENTERS[Math.floor(index / 3)] });

export default function StrikeLine({ line, mark }: { line: readonly number[]; mark: Mark }) {
  const start = center(line[0]);
  const end = center(line[2]);
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const ux = (end.x - start.x) / length;
  const uy = (end.y - start.y) / length;

  return (
    <svg viewBox="0 0 300 300" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <line
        x1={start.x - ux * OVERSHOOT}
        y1={start.y - uy * OVERSHOOT}
        x2={end.x + ux * OVERSHOOT}
        y2={end.y + uy * OVERSHOOT}
        stroke={mark === 'X' ? '#D42E58' : '#0E8070'}
        strokeWidth={8}
        strokeLinecap="round"
        pathLength={1}
        className="draw-stroke"
        style={{ animationDuration: '0.5s', animationDelay: '0.25s' }}
      />
    </svg>
  );
}
