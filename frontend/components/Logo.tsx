export default function Logo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect width="48" height="48" rx="14" className="fill-ink" />
      <path d="M11 11 L21 21 M21 11 L11 21" stroke="#FF7A95" strokeWidth="4" strokeLinecap="round" />
      <circle cx="33" cy="33" r="6" stroke="#3EE0C8" strokeWidth="4" />
    </svg>
  );
}
