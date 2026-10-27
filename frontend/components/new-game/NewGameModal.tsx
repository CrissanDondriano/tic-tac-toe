'use client';

import { ArrowLeftRight, ArrowUpDown, Gamepad2, Play, X as CloseIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { hasErrors, randomName, validatePlayers, type FieldErrors } from '@/lib/players';
import type { SessionState } from '@/lib/session';
import Modal from '../ui/Modal';
import PlayerField from './PlayerField';
import ResumeNotice from './ResumeNotice';

interface NewGameModalProps {
  resumable: SessionState | null;
  onStart: (player1: string, player2: string) => void;
  onResume: () => void;
  onDiscard: () => void;
  onClose: () => void;
}

export default function NewGameModal({ resumable, onStart, onResume, onDiscard, onClose }: NewGameModalProps) {
  const [names, setNames] = useState({ player1: '', player2: '' });
  const [errors, setErrors] = useState<FieldErrors>({});

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia('(min-width: 640px)').matches) firstInput.current?.focus();
  }, []);

  const setName = (key: keyof FieldErrors, value: string) => {
    setNames((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const swapPlayers = () => {
    setNames(({ player1, player2 }) => ({ player1: player2, player2: player1 }));
    setErrors({});
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validatePlayers(names.player1, names.player2);
    setErrors(found);
    if (!hasErrors(found)) onStart(names.player1.trim(), names.player2.trim());
  };

  return (
    <Modal labelledBy={titleId} placement="sheet" closeOnBackdrop={false} onClose={onClose} className="max-w-3xl p-5 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-canvas text-brand">
          <Gamepad2 aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 id={titleId} className="text-2xl font-bold tracking-tight">
            New match
          </h1>
          <p className="mt-0.5 text-sm text-ink-soft">Enter both names. Player 1 is X and goes first.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 -mt-1 rounded-full p-2 text-ink-soft transition hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
        >
          <CloseIcon aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {resumable && <ResumeNotice session={resumable} onResume={onResume} onDiscard={onDiscard} />}

      <form onSubmit={submit} noValidate className="mt-5">
        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <PlayerField
            id={`${baseId}-p1`}
            label="Player 1"
            mark="X"
            hint="Goes first"
            value={names.player1}
            placeholder="e.g. Alex"
            error={errors.player1}
            inputRef={firstInput}
            onChange={(value) => setName('player1', value)}
            onRandom={() => setName('player1', randomName(names.player2))}
          />

          <button type="button" onClick={swapPlayers} aria-label="Swap players" title="Swap players" className="btn-secondary min-h-11 justify-self-center !px-3">
            <ArrowUpDown aria-hidden="true" className="h-5 w-5 sm:hidden" />
            <ArrowLeftRight aria-hidden="true" className="hidden h-5 w-5 sm:block" />
          </button>

          <PlayerField
            id={`${baseId}-p2`}
            label="Player 2"
            mark="O"
            hint="Second"
            value={names.player2}
            placeholder="e.g. Sam"
            error={errors.player2}
            onChange={(value) => setName('player2', value)}
            onRandom={() => setName('player2', randomName(names.player1))}
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary sm:min-w-40">
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
            Start
          </button>
        </div>
      </form>
    </Modal>
  );
}
