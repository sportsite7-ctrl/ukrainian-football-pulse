import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageIntro({ eyebrow, title, subtitle, children }: PageIntroProps) {
  return (
    <section className="container-page pt-8 pb-6 sm:pt-12 sm:pb-8">
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          <span className="size-2 rounded-full bg-pitch animate-pulse-dot" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-[1.75rem] font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>
      )}
      {children}
    </section>
  );
}
