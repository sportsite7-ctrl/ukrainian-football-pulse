import { Link } from "@tanstack/react-router";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[9px] bg-primary text-primary-foreground ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="size-[62%]" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
        <path
          d="M2.5 12.5h4.2l2.1-4.6 3.4 9 2.4-6.2 1.5 1.8h5.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="SPORT PULSE — на головну">
      <LogoMark />
      <span className="truncate font-display text-[15px] font-bold tracking-tight sm:text-base">
        SPORT <span className="text-primary">PULSE</span>
      </span>
    </Link>
  );
}
