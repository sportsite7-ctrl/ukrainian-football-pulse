import { createFileRoute } from "@tanstack/react-router";

import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

const SITE_URL = "https://ukrainian-football-pulse.vercel.app";
const SOCIAL_IMAGE = `${SITE_URL}/og-sport-pulse.png`;

export const Route = createFileRoute("/news/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Усі новини футболу — SPORT PULSE" },
      { name: "description", content: "Повна стрічка футбольних новин українською: трансфери, матчі, турніри, гравці й тренери." },
      { property: "og:title", content: "Усі новини футболу — SPORT PULSE" },
      { property: "og:description", content: "Повна стрічка футбольних новин українською: трансфери, матчі, турніри, гравці й тренери." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/news` },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SPORT PULSE — футбольні новини" },
      { property: "og:locale", content: "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Усі новини футболу — SPORT PULSE" },
      { name: "twitter:description", content: "Повна стрічка футбольних новин українською." },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/news` }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Усі новини" subtitle="Повна стрічка новин європейського та світового футболу" />
      <FeedLayout defaultCategory="all" />
    </>
  );
}
