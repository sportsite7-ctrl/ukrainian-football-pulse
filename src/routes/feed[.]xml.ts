import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://ukrainian-football-pulse.vercel.app";
const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"]?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"];

interface FeedArticle {
  id: string;
  title: string;
  summary: string;
  published_at: string;
  source_url: string | null;
  source_name: string | null;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function getArticles(): Promise<FeedArticle[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/articles?select=id,title,summary,published_at,source_url,source_name&status=eq.published&order=published_at.desc&limit=50`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Accept: "application/json" }, cache: "no-store" },
  );
  if (!response.ok) throw new Error(`RSS query failed (${response.status})`);
  return (await response.json()) as FeedArticle[];
}

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        let articles: FeedArticle[] = [];
        try { articles = await getArticles(); } catch (error) { console.error("SPORT PULSE RSS feed failed.", error); }
        const items = articles.map((article) => {
          const url = `${SITE_URL}/news/${encodeURIComponent(article.id)}`;
          const source = article.source_url ? `<source url="${escapeXml(article.source_url)}">${escapeXml(article.source_name ?? "Source")}</source>` : "";
          return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(article.summary)}</description><pubDate>${new Date(article.published_at).toUTCString()}</pubDate>${source}</item>`;
        }).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>SPORT PULSE — футбольні новини</title><link>${SITE_URL}</link><description>Футбольні новини українською мовою</description><language>uk</language><ttl>30</ttl>${items}</channel></rss>`;
        return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" } });
      },
    },
  },
});
