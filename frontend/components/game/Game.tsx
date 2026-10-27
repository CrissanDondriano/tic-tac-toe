'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { useKeyboardPlacement } from '@/hooks/useKeyboardPlacement';
import { useSaveSession } from '@/hooks/useSaveSession';
import { useSessionPersistence } from '@/hooks/useSessionPersistence';
import { setFlash } from '@/lib/flash';
import { markFor } from '@/lib/game';
import { computeStats, sessionReducer, type SessionState } from '@/lib/session';
import Header from '../Header';
import ConfirmDialog from '../ui/ConfirmDialog';
import Board from './Board';
import RoundHistory from './RoundHistory';
import RoundPanel from './RoundPanel';
import RulesCard from './RulesCard';
import ScoreBoard from './ScoreBoard';
import TurnIndicator from './TurnIndicator';

const Confetti = dynamic(() => import('./Confetti'), { ssr: false });

export default function Game({ initial }: { initial: SessionState }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(sessionReducer, initial);
  const [confirmQuit, setConfirmQuit] = useState(false);

  const { discard } = useSessionPersistence(state);
  const { saving, error: saveError, save } = useSaveSession();

  const placeMark = useCallback((index: number) => dispatch({ type: 'PLACE', index }), []);
  const roundOver = state.status === 'roundOver' && state.result !== null;
  useKeyboardPlacement(placeMark, !confirmQuit && !roundOver);

  const stats = useMemo(() => computeStats(state.rounds), [state.rounds]);
  const names = { player1: state.player1, player2: state.player2 };
  const hasProgress = state.rounds.length > 0 || state.board.some((cell) => cell !== null);

  const leave = () => {
    discard();
    router.push('/');
  };

  const handleStop = async () => {
    if (!(await save(state))) return;
    setFlash(`Session saved. ${state.player1} vs ${state.player2} is now in your history.`);
    leave();
  };

  return (
    <>
      <Header>
        <button type="button" className="btn-secondary min-h-11 px-5" onClick={() => (hasProgress ? setConfirmQuit(true) : leave())}>
          Quit
        </button>
      </Header>

      <main className="page grid gap-5 pb-[max(2rem,env(safe-area-inset-bottom))] lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:items-start lg:gap-x-10">
        <div className="lg:col-start-2 lg:row-start-1">
          <ScoreBoard
            player1={state.player1}
            player2={state.player2}
            stats={stats}
            roundNumber={state.roundNumber}
            activePlayer={roundOver ? null : state.turn}
          />
        </div>

        <section className="flex flex-col gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <TurnIndicator
            label={roundOver ? 'Round over' : `${names[state.turn]}’s turn`}
            mark={roundOver ? undefined : markFor(state.turn)}
          />
          <Board
            board={state.board}
            turn={state.turn}
            disabled={roundOver}
            winLine={state.result?.line ?? null}
            lastMove={state.lastMove ?? null}
            onPlace={placeMark}
          />
        </section>

        <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-2">
          <RoundHistory rounds={state.rounds} player1={state.player1} player2={state.player2} />
          <RulesCard starter={names[state.roundStarter]} />
        </div>
      </main>

      {roundOver && state.result && (
        <RoundPanel
          result={state.result}
          roundNumber={state.roundNumber}
          player1={state.player1}
          player2={state.player2}
          stats={stats}
          saving={saving}
          error={saveError}
          onContinue={() => dispatch({ type: 'NEXT_ROUND' })}
          onStop={handleStop}
        />
      )}

      {roundOver && state.result?.winner !== 'draw' && <Confetti key={state.roundNumber} />}

      <ConfirmDialog
        open={confirmQuit}
        title="Quit without saving?"
        message="Your results for this session will be discarded and won’t appear in the game history."
        confirmLabel="Quit game"
        cancelLabel="Keep playing"
        onConfirm={leave}
        onCancel={() => setConfirmQuit(false)}
      />
    </>
  );
}
