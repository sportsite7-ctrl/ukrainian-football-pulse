import { createFileRoute } from "@tanstack/react-router";

import { MatchCenter } from "@/components/matches/MatchCenter";
import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

const SITE_URL = "https://ukrainian-football-pulse.vercel.app";
const SOCIAL_IMAGE = `${SITE_URL}/og-sport-pulse.svg`;

export const Route = createFileRoute("/matches")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Футбольні матчі — SPORT PULSE" },
      { name: "description", content: "Анонси, результати, огляди та новини головних футбольних матчів." },
      { property: "og:title", content: "Футбольні матчі — SPORT PULSE" },
      { property: "og:description", content: "Анонси, результати, огляди та новини головних футбольних матчів." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/matches` },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SPORT PULSE — матчі та результати" },
      { property: "og:locale", content: "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Футбольні матчі — SPORT PULSE" },
      { name: "twitter:description", content: "Анонси, результати та огляди футбольних матчів." },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/matches` }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Матчі" subtitle="Огляди, анонси та результати головних поєдинків" />
      <MatchCenter />
      <FeedLayout defaultCategory="matches" />
    </>
  );
}
