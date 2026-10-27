import { CircleAlert, Dices, User } from 'lucide-react';
import type { Ref } from 'react';
import type { Mark } from '@/lib/types';
import { MAX_NAME_LENGTH } from '@/lib/players';
import MarkIcon from '../MarkIcon';

interface PlayerFieldProps {
  id: string;
  label: string;
  mark: Mark;
  hint: string;
  value: string;
  placeholder: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  onChange: (value: string) => void;
  onRandom: () => void;
}

export default function PlayerField({ id, label, mark, hint, value, placeholder, error, inputRef, onChange, onRandom }: PlayerFieldProps) {
  return (
    <div className={`rounded-3xl p-4 ${mark === 'X' ? 'bg-x-tint' : 'bg-o-tint'}`}>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-bold">
        <MarkIcon mark={mark} animate={false} className="h-7 w-7 shrink-0" />
        {label}
        <span className="ml-auto rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{hint}</span>
      </label>

      <div className="relative mt-3">
        <User aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          id={id}
          ref={inputRef}
          className={`input !bg-white pl-10 pr-12 ${error ? '!ring-2 !ring-x-deep' : ''}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={MAX_NAME_LENGTH + 5}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={onRandom}
          aria-label={`Random name for ${label}`}
          title="Random name"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-ink-soft transition hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
        >
          <Dices aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-x-deep">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
