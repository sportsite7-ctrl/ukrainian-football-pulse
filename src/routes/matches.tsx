import { createFileRoute } from "@tanstack/react-router";

import { MatchCenter } from "@/components/matches/MatchCenter";
import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

export const Route = createFileRoute("/matches")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Матчі — SPORT PULSE" },
      { name: "description", content: "Огляди, анонси та результати футбольних матчів." },
      { property: "og:title", content: "Матчі — SPORT PULSE" },
      { property: "og:description", content: "Огляди, анонси та результати футбольних матчів." },
    ],
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
