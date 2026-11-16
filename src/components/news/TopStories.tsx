import { pickTopStories } from "@/lib/news/filter";
import type { NewsArticle } from "@/lib/news/types";
import { NewsCard } from "./NewsCard";

export function TopStories({ articles }: { articles: NewsArticle[] }) {
  const { featured, secondary } = pickTopStories(articles, 4);
  if (!featured) return null;

  return (
    <section aria-labelledby="top-stories" className="container-page">
      <h2 id="top-stories" className="sr-only">
        Головні новини
      </h2>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <NewsCard article={featured} variant="feature" priority className="lg:col-span-7" />
        <div className="min-w-0 lg:col-span-5">
          <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.06em]">Також у фокусі</h3>
          </div>
          <div className="grid divide-y md:grid-cols-2 md:gap-x-6 md:divide-y-0 lg:grid-cols-1 lg:divide-y">
            {secondary.map((a) => (
              <NewsCard key={a.id} article={a} variant="horizontal" className="md:border-b lg:border-b-0" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
