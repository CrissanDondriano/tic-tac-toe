import type { Metadata } from 'next';
import GameFlow from '@/components/new-game/GameFlow';

export const metadata: Metadata = { title: 'New game · Tic Tac Toe' };

export default function NewGamePage() {
  return <GameFlow />;
}
