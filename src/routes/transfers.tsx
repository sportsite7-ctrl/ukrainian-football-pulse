import { createFileRoute } from "@tanstack/react-router";

import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

const SITE_URL = "https://ukrainian-football-pulse.vercel.app";
const SOCIAL_IMAGE = `${SITE_URL}/og-sport-pulse.png`;

export const Route = createFileRoute("/transfers")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Футбольні трансфери — SPORT PULSE" },
      { name: "description", content: "Трансферні новини футболу українською: підписання, чутки та переговори провідних клубів." },
      { property: "og:title", content: "Футбольні трансфери — SPORT PULSE" },
      { property: "og:description", content: "Трансферні новини футболу українською: підписання, чутки та переговори провідних клубів." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/transfers` },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SPORT PULSE — трансферні новини" },
      { property: "og:locale", content: "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Футбольні трансфери — SPORT PULSE" },
      { name: "twitter:description", content: "Трансферні новини футболу українською." },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/transfers` }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Трансфери" subtitle="Підписання, чутки та переговори провідних клубів" />
      <FeedLayout defaultCategory="transfers" />
    </>
  );
}
