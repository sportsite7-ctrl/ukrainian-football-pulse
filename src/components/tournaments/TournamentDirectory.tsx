import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe2, Trophy } from "lucide-react";

import { TOURNAMENTS } from "@/lib/news/taxonomy";

const tournamentMeta: Record<string, { region: string; format: string }> = {
  ucl: { region: "Європа · клуби", format: "Клубний турнір" },
  uel: { region: "Європа · клуби", format: "Клубний турнір" },
  "world-cup": { region: "Світ · збірні", format: "Міжнародний турнір" },
  euro: { region: "Європа · збірні", format: "Міжнародний турнір" },
  "nations-league": { region: "Європа · збірні", format: "Турнір збірних" },
};

export function TournamentDirectory() {
  return (
    <section className="container-page pb-8">
      <div className="mb-5 flex items-end justify-between gap-3 border-b-2 border-foreground pb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">Турнірний гід</p>
          <h2 className="mt-1 font-display text-lg font-bold sm:text-xl">Головні футбольні змагання</h2>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">{TOURNAMENTS.length} турнірів</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOURNAMENTS.map((tournament, index) => {
          const meta = tournamentMeta[tournament.id];
          return (
            <article key={tournament.id} className="group flex min-w-0 flex-col rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-strong">
                  {index < 2 ? <Trophy className="size-6" /> : <Globe2 className="size-6" />}
                </div>
                <span className="rounded-full bg-slate-soft px-2.5 py-1 text-[11px] font-semibold text-slate-ink">{meta.format}</span>
              </div>
              <h3 className="mt-5 font-display text-base font-bold leading-snug">{tournament.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tournament.description}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
                <span className="text-xs font-medium text-muted-foreground">{meta.region}</span>
                <Link to="/news/" className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-strong">
                  Новини <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
