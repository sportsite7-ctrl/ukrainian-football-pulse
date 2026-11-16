import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { newsListQueryOptions } from "@/lib/news/api";
import { formatShortDate, formatTime } from "@/lib/news/format";

export function LatestNews() {
  const { data } = useSuspenseQuery(newsListQueryOptions());
  return (
    <aside aria-labelledby="latest-title" className="min-w-0 rounded-xl border bg-card p-5 lg:sticky lg:top-20">
      <h2 id="latest-title" className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.06em]">
        <span className="size-2 rounded-full bg-pitch animate-pulse-dot" aria-hidden="true" />
        Останні новини
      </h2>
      <ol className="mt-4 divide-y">
        {data.slice(0, 8).map((a) => (
          <li key={a.id} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3 py-3">
            <div className="text-[13px] leading-tight">
              <div className="font-bold text-primary">{formatTime(a.publishedAt)}</div>
              <div className="text-muted-foreground">{formatShortDate(a.publishedAt)}</div>
            </div>
            <div className="min-w-0">
              <Link to="/news/$id" params={{ id: a.id }} className="text-sm font-semibold leading-snug hover:text-primary">
                {a.title}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">{a.source.name}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
