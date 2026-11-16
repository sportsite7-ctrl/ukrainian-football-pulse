import { createFileRoute } from "@tanstack/react-router";

import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

export const Route = createFileRoute("/news/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Усі новини футболу — SPORT PULSE" },
      { name: "description", content: "Повна стрічка футбольних новин: трансфери, матчі, турніри, гравці й тренери." },
      { property: "og:title", content: "Усі новини футболу — SPORT PULSE" },
      { property: "og:description", content: "Повна стрічка футбольних новин: трансфери, матчі, турніри, гравці й тренери." },
    ],
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
