const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function RulesCard({ starter }: { starter: string }) {
  return (
    <section className="card flex flex-col gap-3 p-5 sm:p-6" aria-labelledby="rules-title">
      <h2 id="rules-title" className="text-lg font-bold">
        Rules at a glance
      </h2>
      <p className="text-sm leading-relaxed text-ink-soft">
        {starter} started this round, and the other player starts the next one. Three in a row wins: any of 3 rows, 3 columns or 2 diagonals.
      </p>
      <div className="hidden items-center gap-5 sm:flex">
        <div className="grid grid-cols-3 gap-1" aria-hidden="true">
          {KEYS.map((key) => (
            <kbd key={key} className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas font-sans text-xs font-semibold">
              {key}
            </kbd>
          ))}
        </div>
        <p className="max-w-[15rem] text-sm text-ink-soft">Press 1 to 9 to place a mark, from top left to bottom right.</p>
      </div>
    </section>
  );
}
