/**
 * Domain types for SPORT PULSE news.
 * Shape mirrors a future `news` table (see mapNewsRow in ./api.ts), so the UI
 * stays unchanged when the demo data is swapped for a real database.
 */
export const NEWS_CATEGORIES = ["transfers", "matches", "tournaments", "players", "coaches"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type CategoryFilter = NewsCategory | "all";

export type ClubId =
  | "real-madrid"
  | "barcelona"
  | "man-city"
  | "liverpool"
  | "arsenal"
  | "man-utd"
  | "bayern"
  | "psg"
  | "inter"
  | "juventus";

export type TournamentId = "ucl" | "uel" | "world-cup" | "euro" | "nations-league";

export interface NewsSource {
  name: string;
  url: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  /** 2–3 sentence lead shown on cards. */
  summary: string;
  /** Article body paragraphs. */
  body: string[];
  category: NewsCategory;
  clubs: ClubId[];
  tournaments: TournamentId[];
  /** ISO 8601 timestamp (UTC). */
  publishedAt: string;
  source: NewsSource;
  imageUrl: string | null;
  imageAlt?: string | undefined;
  /** Editor's pick for the main slot on the home page. */
  isFeatured?: boolean;
}

export interface NewsFilters {
  category: CategoryFilter;
  club: ClubId | null;
  tournament: TournamentId | null;
  query: string;
}
