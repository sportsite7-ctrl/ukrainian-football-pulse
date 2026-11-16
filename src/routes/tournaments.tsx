import { createFileRoute } from "@tanstack/react-router";

import { TournamentDirectory } from "@/components/tournaments/TournamentDirectory";
import { FeedLayout } from "@/components/news/FeedLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { newsListQueryOptions } from "@/lib/news/api";

export const Route = createFileRoute("/tournaments")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQueryOptions()),
  head: () => ({
    meta: [
      { title: "Турніри — SPORT PULSE" },
      { name: "description", content: "Ліга чемпіонів, Ліга Європи, чемпіонати світу та Європи, Ліга націй." },
      { property: "og:title", content: "Турніри — SPORT PULSE" },
      { property: "og:description", content: "Ліга чемпіонів, Ліга Європи, чемпіонати світу та Європи, Ліга націй." },
    ],
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
