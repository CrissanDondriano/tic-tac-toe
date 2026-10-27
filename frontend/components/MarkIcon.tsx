import type { Mark } from '@/lib/types';

interface MarkIconProps {
  mark: Mark;
  className?: string;
  animate?: boolean;
  onDark?: boolean;
}

const TONE = {
  X: { light: 'text-x', dark: 'text-x-bright' },
  O: { light: 'text-o', dark: 'text-o-bright' },
} as const;

export default function MarkIcon({ mark, className = '', animate = true, onDark = false }: MarkIconProps) {
  const stroke = animate ? 'draw-stroke' : '';
  const tone = TONE[mark][onDark ? 'dark' : 'light'];

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={13}
      strokeLinecap="round"
      aria-hidden="true"
      className={`${tone} ${className}`}
    >
      {mark === 'X' ? (
        <>
          <path d="M24 24 L76 76" pathLength={1} className={stroke} />
          <path d="M76 24 L24 76" pathLength={1} className={stroke} style={animate ? { animationDelay: '0.12s' } : undefined} />
        </>
      ) : (
        <circle cx="50" cy="50" r="28" pathLength={1} className={stroke} />
      )}
    </svg>
  );
}
