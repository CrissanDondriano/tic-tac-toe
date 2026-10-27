import { Check, X } from 'lucide-react';

export default function SavedBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="status" className="mt-6 flex animate-rise items-center gap-3 rounded-2xl bg-o-tint px-4 py-3 font-semibold text-ink">
      <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-o-deep" />
      <span className="min-w-0 flex-1 text-sm">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="rounded-full p-1.5 text-ink-soft transition hover:bg-white/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
