import Link from 'next/link';
import MarkIcon from '../MarkIcon';

const HERO_CELLS: Array<'X' | 'O' | null> = ['X', null, 'O', null, 'X', null, 'O', null, 'X'];

export default function Hero() {
  return (
    <section className="card-dark grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto] lg:p-14">
      <div className="flex flex-col items-start gap-5">
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Three in a row.
          <br />
          Bragging rights forever.
        </h1>
        <p className="max-w-md leading-relaxed text-white/70">
          Play as many rounds as you like, keep score, and save every session to your history.
        </p>
        <Link href="/new" className="btn-primary w-full sm:w-auto">
          Start new game
        </Link>
      </div>

      <div aria-hidden="true" className="grid w-36 grid-cols-3 gap-2 justify-self-start rounded-3xl bg-ink-raised/60 p-3 sm:w-44 md:justify-self-end">
        {HERO_CELLS.map((cell, index) => (
          <div key={index} className="flex aspect-square items-center justify-center rounded-xl bg-ink-raised p-[18%]">
            {cell && <MarkIcon mark={cell} animate={false} onDark className="h-full w-full" />}
          </div>
        ))}
      </div>
    </section>
  );
}
