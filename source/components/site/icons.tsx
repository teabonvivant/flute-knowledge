export function LineIcon({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-accent/70 font-sans text-sm font-bold text-primary ${className}`}
    >
      {label}
    </span>
  );
}
