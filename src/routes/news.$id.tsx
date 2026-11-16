import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { CategoryBadge } from "@/components/news/CategoryBadge";
import { LatestNews } from "@/components/news/LatestNews";
import { NewsMeta } from "@/components/news/NewsMeta";
import { newsArticleQueryOptions, newsListQueryOptions } from "@/lib/news/api";

export const Route = createFileRoute("/news/$id")({
  loader: async ({ context, params }) => {
    const [article] = await Promise.all([
      context.queryClient.ensureQueryData(newsArticleQueryOptions(params.id)),
      context.queryClient.ensureQueryData(newsListQueryOptions()),
    ]);
    if (!article) throw notFound();
    return { title: article.title, summary: article.summary };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — SPORT PULSE` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.summary },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Новину не знайдено — SPORT PULSE" }, { name: "robots", content: "noindex" }],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { id } = Route.useParams();
  const { data: article } = useSuspenseQuery(newsArticleQueryOptions(id));
  if (!article) return null;
  return (
    <div className="container-page mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <article className="min-w-0">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Усі новини
        </Link>
        <div className="mt-4"><CategoryBadge category={article.category} /></div>
        <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-balance sm:text-4xl">{article.title}</h1>
        <NewsMeta article={article} className="mt-4" />
        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.imageAlt ?? ""} width={1200} height={800} className="mt-6 aspect-[16/9] w-full rounded-xl object-cover" />
        )}
        <p className="mt-6 text-lg font-medium leading-relaxed">{article.summary}</p>
        <div className="mt-4 grid gap-4 text-base leading-relaxed text-foreground/90">
          {article.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <a href={article.source.url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm font-semibold text-primary hover:border-primary/40">
          Джерело: {article.source.name} <ExternalLink className="size-4" />
        </a>
      </article>
      <LatestNews />
    </div>
  );
}
