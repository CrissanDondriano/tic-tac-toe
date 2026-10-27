'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, createSession, loadSession, type SessionState } from '@/lib/session';
import Game from '../game/Game';
import NewGameBackdrop from './NewGameBackdrop';
import NewGameModal from './NewGameModal';

export default function GameFlow() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [resumable, setResumable] = useState<SessionState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResumable(loadSession());
    setReady(true);
  }, []);

  if (session) return <Game initial={session} />;

  const start = (player1: string, player2: string) => {
    clearSession();
    setSession(createSession(player1, player2));
  };

  const resume = () => {
    if (resumable) setSession(resumable);
  };

  const discard = () => {
    clearSession();
    setResumable(null);
  };

  return (
    <>
      <NewGameBackdrop />
      {ready && <NewGameModal resumable={resumable} onStart={start} onResume={resume} onDiscard={discard} onClose={() => router.push('/')} />}
    </>
  );
}
