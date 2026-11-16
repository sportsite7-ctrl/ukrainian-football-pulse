import type { NewsArticle, NewsFilters } from "./types";

export const DEFAULT_FILTERS: NewsFilters = { category: "all", club: null, tournament: null, query: "" };

const normalize = (value: string) =>
  value.toLocaleLowerCase("uk-UA").replace(/[«»"'’`]/g, "").replace(/\s+/g, " ").trim();

export function sortByNewest(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

/** Category + club + tournament filters, plus case-insensitive search in titles only. */
export function filterNews(articles: NewsArticle[], filters: NewsFilters): NewsArticle[] {
  const q = normalize(filters.query);
  return articles.filter(
    (a) =>
      (filters.category === "all" || a.category === filters.category) &&
      (!filters.club || a.clubs.includes(filters.club)) &&
      (!filters.tournament || a.tournaments.includes(filters.tournament)) &&
      (!q || normalize(a.title).includes(q)),
  );
}

/** Main story = editor's pick (or newest with a photo); then the next newest stories with photos. */
export function pickTopStories(articles: NewsArticle[], secondaryCount = 4) {
  const sorted = sortByNewest(articles);
  const featured =
    sorted.find((a) => a.isFeatured && a.imageUrl) ?? sorted.find((a) => a.imageUrl) ?? sorted[0];
  const secondary = sorted
    .filter((a) => a.id !== featured?.id && a.imageUrl)
    .slice(0, secondaryCount);
  return { featured, secondary };
}
