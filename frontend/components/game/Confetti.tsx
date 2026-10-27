'use client';

import { useState } from 'react';

const COLORS = ['#F0436A', '#0E9F8E', '#5B3DF5', '#F5B82E', '#17133A'];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  color: string;
  round: boolean;
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.6,
    drift: Math.round((Math.random() - 0.5) * 240),
    size: 6 + Math.random() * 7,
    color: COLORS[i % COLORS.length],
    round: Math.random() > 0.5,
  }));
}

export default function Confetti({ count = 44 }: { count?: number }) {
  const [pieces] = useState(() => (prefersReducedMotion() ? [] : makePieces(count)));
  if (pieces.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="absolute top-0 block opacity-0"
          style={
            {
              left: `${piece.left}%`,
              width: piece.size,
              height: piece.round ? piece.size : piece.size * 1.6,
              borderRadius: piece.round ? '9999px' : '2px',
              backgroundColor: piece.color,
              '--drift': `${piece.drift}px`,
              animation: `confetti ${piece.duration}s ${piece.delay}s ease-in forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
