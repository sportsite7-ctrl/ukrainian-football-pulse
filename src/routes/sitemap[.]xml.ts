import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://ukrainian-football-pulse.vercel.app";
const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"]?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"];
const STATIC_PATHS = ["/", "/news", "/transfers", "/matches", "/tournaments"];

interface SitemapArticle {
  id: string;
  published_at: string | null;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function getPublishedArticles(): Promise<SitemapArticle[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  const articles: SitemapArticle[] = [];
  const pageSize = 1000;

  for (let offset = 0; ; offset += pageSize) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=id,published_at&status=eq.published&order=published_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: "application/json",
          Range: `${offset}-${offset + pageSize - 1}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Supabase sitemap query failed (${response.status})`);
    }

    const page = (await response.json()) as SitemapArticle[];
    articles.push(...page);

    if (page.length < pageSize) break;
  }

  return articles;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = STATIC_PATHS.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`);

        try {
          const articles = await getPublishedArticles();
          for (const article of articles) {
            if (!article.id) continue;
            const loc = escapeXml(`${SITE_URL}/news/${encodeURIComponent(article.id)}`);
            const lastmod = article.published_at
              ? new Date(article.published_at).toISOString()
              : null;
            urls.push(
              lastmod
                ? `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
                : `  <url><loc>${loc}</loc></url>`,
            );
          }
        } catch (error) {
          console.error("SPORT PULSE: could not load articles for sitemap.", error);
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
          },
        });
      },
    },
  },
});
