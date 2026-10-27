import type { Mark } from '@/lib/types';
import MarkIcon from '../MarkIcon';

interface TurnIndicatorProps {
  label: string;
  mark?: Mark;
}

export default function TurnIndicator({ label, mark }: TurnIndicatorProps) {
  return (
    <div className="flex justify-center" aria-live="polite">
      <div className={`card inline-flex max-w-full items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold sm:text-base ${mark ? '' : 'text-ink-soft'}`}>
        {mark && <MarkIcon mark={mark} animate={false} className="h-6 w-6 shrink-0" />}
        <span className="truncate">{label}</span>
      </div>
    </div>
  );
}
