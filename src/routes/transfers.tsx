import { createFileRoute } from "@tanstack/react-router";

import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

export const Route = createFileRoute("/transfers")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Трансфери — SPORT PULSE" },
      { name: "description", content: "Трансферні новини та чутки провідних клубів Європи." },
      { property: "og:title", content: "Трансфери — SPORT PULSE" },
      { property: "og:description", content: "Трансферні новини та чутки провідних клубів Європи." },
    ],
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
