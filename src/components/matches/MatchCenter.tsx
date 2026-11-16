import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, RefreshCw, Trophy } from "lucide-react";

import { fixturesQueryOptions } from "@/lib/news/fixtures";
import { useSuspenseQuery } from "@tanstack/react-query";
import { newsListQueryOptions } from "@/lib/news/api";
import { formatShortDate } from "@/lib/news/format";

const LEAGUE_FILTERS = [
  "Усі ліги",
  "Англійська Прем'єр-ліга",
  "Іспанська Ла Ліга",
  "Німецька Бундесліга",
  "Італійська Серія А",
  "Французька Ліга 1",
];

function formatMatchDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function MatchCenter() {
  const { data: news } = useSuspenseQuery(newsListQueryOptions());
  const matchNews = news.filter((article) => article.category === "matches");
  const latest = matchNews[0];
  const [league, setLeague] = useState("Усі ліги");
  const [tab, setTab] = useState<"upcoming" | "results">("upcoming");
  const { data: fixtures, isLoading, isError, error, refetch, isFetching } = useQuery(fixturesQueryOptions());

  const visible = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const selected = (fixtures ?? []).filter((item) => league === "Усі ліги" || item.competition === league);
    return tab === "upcoming"
      ? selected.filter((item) => item.date >= today && !item.score).slice(0, 24)
      : selected.filter((item) => item.score).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 24);
  }, [fixtures, league, tab]);

  return (
    <section className="container-page space-y-8 pb-8">
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border bg-card p-5 sm:p-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarDays className="size-4" />
            МАТЧЕВИЙ ЦЕНТР
          </div>
          <h2 className="mt-3 font-display text-xl font-bold sm:text-2xl">Календар і результати провідних ліг</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Матчі, рахунки та новини п'яти головних європейських чемпіонатів в одному місці.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-pitch-soft px-3 py-1.5 text-xs font-semibold text-pitch-ink">АПЛ</span>
            <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-strong">Ла Ліга</span>
            <span className="rounded-full bg-slate-soft px-3 py-1.5 text-xs font-semibold text-slate-ink">Бундесліга · Серія А · Ліга 1</span>
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

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.06em]">Календар матчів</h3>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Оновити
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["upcoming", "results"] as const).map((value) => (
            <button key={value} type="button" onClick={() => setTab(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === value ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground hover:text-foreground"}`}>
              {value === "upcoming" ? "Найближчі матчі" : "Результати"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {LEAGUE_FILTERS.map((value) => (
            <button key={value} type="button" onClick={() => setLeague(value)}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold ${league === value ? "border-primary bg-primary-soft text-primary-strong" : "bg-card text-muted-foreground"}`}>
              {value}
            </button>
          ))}
        </div>

        {isLoading ? <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Завантажуємо календар матчів…</p> : null}
        {isError ? (
          <div className="rounded-xl border border-dashed bg-card p-5 text-sm">
            <p className="font-semibold">Не вдалося завантажити календар</p>
            <p className="mt-1 text-muted-foreground">{error instanceof Error ? error.message : "Джерело тимчасово недоступне."}</p>
            <button type="button" onClick={() => void refetch()} className="mt-3 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Спробувати ще раз</button>
          </div>
        ) : null}
        {!isLoading && !isError && visible.length === 0 ? (
          <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            {tab === "upcoming" ? "У цій лізі наразі немає матчів у доступному календарі." : "Результатів для вибраної ліги поки немає."}
          </p>
        ) : null}
        {visible.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {visible.map((match) => (
              <article key={match.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{match.competition}</span>
                  <span>{formatMatchDate(match.date)}</span>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <p className="text-sm font-semibold leading-snug">{match.home}</p>
                  <div className="min-w-12 rounded-lg bg-surface px-3 py-2 text-center font-display text-lg font-bold tabular-nums">
                    {match.score ? `${match.score[0]} : ${match.score[1]}` : "— : —"}
                  </div>
                  <p className="text-right text-sm font-semibold leading-snug">{match.away}</p>
                </div>
                <div className="mt-3 border-t pt-2 text-xs text-muted-foreground">{match.round || (match.score ? "Завершено" : "Заплановано")}</div>
              </article>
            ))}
          </div>
        ) : null}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Дані календаря: OpenFootball / football.json. Це відкритий набір розкладів і результатів; оновлення залежить від внесення даних до джерела. Час початку матчів не показуємо, оскільки джерело не гарантує єдину часову зону.
        </p>
      </div>
    </section>
  );
}
