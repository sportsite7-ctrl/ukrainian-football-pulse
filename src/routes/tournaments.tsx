import { createFileRoute } from "@tanstack/react-router";

import { TournamentDirectory } from "@/components/tournaments/TournamentDirectory";
import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

const SITE_URL = "https://ukrainian-football-pulse.vercel.app";
const SOCIAL_IMAGE = `${SITE_URL}/og-sport-pulse.png`;

export const Route = createFileRoute("/tournaments")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Футбольні турніри — SPORT PULSE" },
      { name: "description", content: "Новини футбольних турнірів: Ліга чемпіонів, Ліга Європи, чемпіонати та міжнародні змагання." },
      { property: "og:title", content: "Футбольні турніри — SPORT PULSE" },
      { property: "og:description", content: "Новини футбольних турнірів: Ліга чемпіонів, Ліга Європи, чемпіонати та міжнародні змагання." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/tournaments` },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SPORT PULSE — футбольні турніри" },
      { property: "og:locale", content: "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Футбольні турніри — SPORT PULSE" },
      { name: "twitter:description", content: "Новини футбольних турнірів українською." },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/tournaments` }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Турніри" subtitle="Ліга чемпіонів, Ліга Європи, ЧС, Євро та Ліга націй" />
      <TournamentDirectory />
      <FeedLayout defaultCategory="tournaments" />
    </>
  );
}
