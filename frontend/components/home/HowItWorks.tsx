const STEPS = [
  { color: 'text-x-deep', text: 'Name both players. Player 1 is X and goes first.' },
  { color: 'text-o-deep', text: 'Take turns: tap a square or press 1 to 9.' },
  { color: 'text-ink', text: 'Three in a row wins. A full board with no line is a draw.' },
  { color: 'text-ink', text: 'Continue starts a new round. Stop saves the session to your history.' },
];

export default function HowItWorks() {
  return (
    <section className="card p-5 sm:p-6" aria-labelledby="how-title">
      <h2 id="how-title" className="text-lg font-bold">
        How it works
      </h2>
      <ol className="mt-3 flex flex-col gap-3">
        {STEPS.map((step, index) => (
          <li key={step.text} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
            <span className={`w-4 shrink-0 font-bold ${step.color}`}>{index + 1}.</span>
            {step.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
