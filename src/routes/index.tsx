import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { FeedLayout } from "@/components/news/FeedLayout";
import { TopStories } from "@/components/news/TopStories";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

const SITE_URL = "https://ukrainian-football-pulse.vercel.app";
const SOCIAL_IMAGE = `${SITE_URL}/og-sport-pulse.svg`;

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "SPORT PULSE — головне у футболі" },
      { name: "description", content: "Футбольні новини українською: трансфери, матчі, клуби, турніри, результати та огляди." },
      { property: "og:title", content: "SPORT PULSE — головне у футболі" },
      { property: "og:description", content: "Футбольні новини українською: трансфери, матчі, клуби, турніри, результати та огляди." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SPORT PULSE — футбольні новини українською" },
      { property: "og:locale", content: "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SPORT PULSE — головне у футболі" },
      { name: "twitter:description", content: "Футбольні новини українською: трансфери, матчі, клуби, турніри, результати та огляди." },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(newsListQueryOptions());
  return (
    <>
      <PageIntro eyebrow="Футбольні новини" title="Головне у футболі" subtitle="Останні новини світового футболу в одному місці" />
      <TopStories articles={data} />
      <FeedLayout />
    </>
  );
}
