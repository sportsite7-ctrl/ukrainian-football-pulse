import { CalendarDays, CircleHelp, Trophy } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { newsListQueryOptions } from "@/lib/news/api";
import { formatShortDate } from "@/lib/news/format";

export function MatchCenter() {
  const { data } = useSuspenseQuery(newsListQueryOptions());
  const matchNews = data.filter((article) => article.category === "matches");
  const latest = matchNews[0];

  return (
    <section className="container-page space-y-8 pb-8">
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border bg-card p-5 sm:p-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarDays className="size-4" />
            МАТЧЕВИЙ ЦЕНТР
          </div>
          <h2 className="mt-3 font-display text-xl font-bold sm:text-2xl">Усе про головні футбольні поєдинки</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Анонси, огляди, підсумки та найважливіші події матчів провідних клубів і збірних.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-pitch-soft px-3 py-1.5 text-xs font-semibold text-pitch-ink">Огляди матчів</span>
            <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-strong">Результати</span>
            <span className="rounded-full bg-slate-soft px-3 py-1.5 text-xs font-semibold text-slate-ink">Збірні та клуби</span>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border bg-surface p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Матеріали про матчі</p>
            <p className="mt-2 font-display text-4xl font-bold tabular-nums">{matchNews.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">у стрічці SPORT PULSE</p>
          </div>
          {latest ? (
            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-muted-foreground">Останній матеріал · {formatShortDate(latest.publishedAt)}</p>
              <p className="mt-1 text-sm font-semibold leading-snug">{latest.title}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-dashed bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CircleHelp className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Календар матчів і турнірні рахунки</h3>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Розклад майбутніх поєдинків і точні результати потребують окремого перевіреного джерела даних.
              Зараз воно ще не підключене, тому ми не показуємо вигадані пари, дати чи рахунки.
              Після підключення футбольного API цей блок можна буде наповнювати автоматично.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
        <Trophy className="size-4 text-primary" />
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.06em]">Новини та огляди матчів</h3>
      </div>
    </section>
  );
}
