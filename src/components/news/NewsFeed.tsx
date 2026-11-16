import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RefreshCw, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsListQueryOptions } from "@/lib/news/api";
import { DEFAULT_FILTERS, filterNews } from "@/lib/news/filter";
import { CLUBS, TOURNAMENTS } from "@/lib/news/taxonomy";
import type { CategoryFilter, ClubId, NewsFilters, TournamentId } from "@/lib/news/types";
import { CategoryTabs } from "./CategoryTabs";
import { NewsCard } from "./NewsCard";

const FIRST_PAGE = 9;
const STEP = 8;

const selectClass =
  "h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function NewsFeed({ defaultCategory = "all" }: { defaultCategory?: CategoryFilter }) {
  const { data, refetch } = useSuspenseQuery(newsListQueryOptions());
  const [filters, setFilters] = useState<NewsFilters>({ ...DEFAULT_FILTERS, category: defaultCategory });
  const [visible, setVisible] = useState(FIRST_PAGE);
  const [refreshing, setRefreshing] = useState(false);

  const update = (patch: Partial<NewsFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(FIRST_PAGE);
  };

  const results = filterNews(data, filters);
  const shown = results.slice(0, visible);

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), new Promise((r) => setTimeout(r, 600))]);
    setRefreshing(false);
  };

  return (
    <section aria-labelledby="feed-title" className="min-w-0">
      <div className="mb-4 flex items-end justify-between gap-3 border-b-2 border-foreground pb-2">
        <h2 id="feed-title" className="font-display text-sm font-bold uppercase tracking-[0.06em]">
          Стрічка новин
        </h2>
        <span className="text-[13px] text-muted-foreground">
          Показано {shown.length} з {results.length}
        </span>
      </div>

      <div className="grid gap-3">
        <CategoryTabs value={filters.category} onChange={(category) => update({ category })} />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder="Пошук за заголовком…"
              aria-label="Пошук новин за заголовком"
              className="h-10 rounded-lg bg-card pl-9 text-base sm:text-sm"
            />
          </div>
          <Button variant="outline" onClick={refresh} disabled={refreshing} className="h-10" aria-label="Оновити новини">
            <RefreshCw className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Оновити</span>
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            aria-label="Фільтр за клубом"
            className={selectClass}
            value={filters.club ?? ""}
            onChange={(e) => update({ club: (e.target.value || null) as ClubId | null })}
          >
            <option value="">Усі клуби</option>
            {CLUBS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            aria-label="Фільтр за турніром"
            className={selectClass}
            value={filters.tournament ?? ""}
            onChange={(e) => update({ tournament: (e.target.value || null) as TournamentId | null })}
          >
            <option value="">Усі турніри</option>
            {TOURNAMENTS.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-card p-8 text-center">
          <p className="font-semibold">Нічого не знайдено</p>
          <p className="mt-1 text-sm text-muted-foreground">Спробуйте змінити фільтри або пошуковий запит.</p>
          <Button variant="outline" className="mt-4" onClick={() => update({ ...DEFAULT_FILTERS })}>
            <X /> Скинути фільтри
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {shown.map((a, i) => (
            <NewsCard key={a.id} article={a} variant={i === 0 ? "wide" : "default"} className={i === 0 ? "sm:col-span-2" : ""} />
          ))}
        </div>
      )}

      {results.length > visible && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="h-11 w-full sm:w-auto sm:px-8" onClick={() => setVisible((v) => v + STEP)}>
            Завантажити ще
          </Button>
        </div>
      )}
    </section>
  );
}
