import { queryOptions } from "@tanstack/react-query";

import { DEMO_NEWS } from "./demo-data";
import { sortByNewest } from "./filter";
import type { ClubId, NewsArticle, NewsCategory, TournamentId } from "./types";

/**
 * Supabase public read client implemented with the PostgREST HTTP API.
 * Only the public/anon key belongs in VITE_* variables. Never put a service-role
 * key in frontend code or a VITE_* variable.
 */
interface NewsRow {
  id: string;
  title: string;
  summary: string;
  body: string[] | null;
  category: NewsCategory;
  clubs: ClubId[] | null;
  tournaments: TournamentId[] | null;
  published_at: string;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_featured: boolean | null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function mapNewsRow(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: Array.isArray(row.body) ? row.body : [],
    category: row.category,
    clubs: row.clubs ?? [],
    tournaments: row.tournaments ?? [],
    publishedAt: row.published_at,
    source: {
      name: row.source_name || "Джерело",
      url: row.source_url || "",
    },
    imageUrl: row.image_url,
    imageAlt: row.image_alt ?? undefined,
    isFeatured: row.is_featured ?? false,
  };
}

async function requestPublishedNews(query: string): Promise<NewsRow[]> {
  if (!hasSupabaseConfig || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase is not configured");
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/articles?${query}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase request failed (${response.status})`);
  }

  return (await response.json()) as NewsRow[];
}

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const rows = await requestPublishedNews(
      "select=id,title,summary,body,category,clubs,tournaments,published_at,source_name,source_url,image_url,image_alt,is_featured&status=eq.published&order=published_at.desc",
    );

    // Keep the existing preview useful until the first real articles are published.
    return rows.length > 0 ? rows.map(mapNewsRow) : sortByNewest(DEMO_NEWS);
  } catch (error) {
    console.warn("SPORT PULSE: using preview news because Supabase is unavailable.", error);
    return sortByNewest(DEMO_NEWS);
  }
}

export async function fetchNewsById(id: string): Promise<NewsArticle | null> {
  try {
    const rows = await requestPublishedNews(
      `select=id,title,summary,body,category,clubs,tournaments,published_at,source_name,source_url,image_url,image_alt,is_featured&status=eq.published&id=eq.${encodeURIComponent(id)}&limit=1`,
    );

    if (rows[0]) return mapNewsRow(rows[0]);
  } catch (error) {
    console.warn("SPORT PULSE: could not load the article from Supabase.", error);
  }

  return DEMO_NEWS.find((article) => article.id === id) ?? null;
}

export const newsKeys = {
  all: ["news"] as const,
  detail: (id: string) => ["news", "detail", id] as const,
};

export const newsListQueryOptions = () =>
  queryOptions({ queryKey: newsKeys.all, queryFn: fetchNews, staleTime: 60_000 });

export const newsArticleQueryOptions = (id: string) =>
  queryOptions({ queryKey: newsKeys.detail(id), queryFn: () => fetchNewsById(id), staleTime: 60_000 });
