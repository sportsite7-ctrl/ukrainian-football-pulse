import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { FeedLayout } from "@/components/news/FeedLayout";
import { TopStories } from "@/components/news/TopStories";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "SPORT PULSE — головне у футболі" },
      { name: "description", content: "Останні новини світового футболу українською в одному місці." },
      { property: "og:title", content: "SPORT PULSE — головне у футболі" },
      { property: "og:description", content: "Останні новини світового футболу в одному місці." },
    ],
    links: [
      { rel: "canonical", href: "https://ukrainian-football-pulse.vercel.app/" },
    ],
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
