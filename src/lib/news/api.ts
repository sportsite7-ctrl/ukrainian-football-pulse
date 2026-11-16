import { queryOptions } from "@tanstack/react-query";

import { DEMO_NEWS } from "./demo-data";
import { sortByNewest } from "./filter";
import type { ClubId, NewsArticle, NewsCategory, TournamentId } from "./types";

/**
 * News data access. The only place that knows where news comes from.
 * Today: bundled demo data. Later: swap the bodies of fetchNews/fetchNewsById for a
 * database query, e.g.
 *   const { data } = await supabase.from("news").select("*").order("published_at", { ascending: false });
 *   return (data ?? []).map(mapNewsRow);
 */

/** Expected row shape of a future `news` table (snake_case). */
export interface NewsRow {
  id: string;
  title: string;
  summary: string;
  body: string[] | null;
  category: NewsCategory;
  clubs: ClubId[] | null;
  tournaments: TournamentId[] | null;
  published_at: string;
  source_name: string;
  source_url: string;
  image_url: string | null;
  image_alt: string | null;
  is_featured: boolean | null;
}

export function mapNewsRow(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: row.body ?? [],
    category: row.category,
    clubs: row.clubs ?? [],
    tournaments: row.tournaments ?? [],
    publishedAt: row.published_at,
    source: { name: row.source_name, url: row.source_url },
    imageUrl: row.image_url,
    imageAlt: row.image_alt ?? undefined,
    isFeatured: row.is_featured ?? false,
  };
}

export async function fetchNews(): Promise<NewsArticle[]> {
  return sortByNewest(DEMO_NEWS);
}

export async function fetchNewsById(id: string): Promise<NewsArticle | null> {
  return DEMO_NEWS.find((a) => a.id === id) ?? null;
}

export const newsKeys = {
  all: ["news"] as const,
  detail: (id: string) => ["news", "detail", id] as const,
};

export const newsListQueryOptions = () =>
  queryOptions({ queryKey: newsKeys.all, queryFn: fetchNews, staleTime: 60_000 });

export const newsArticleQueryOptions = (id: string) =>
  queryOptions({ queryKey: newsKeys.detail(id), queryFn: () => fetchNewsById(id), staleTime: 60_000 });
