import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { formatPublished } from "@/lib/news/format";
import type { NewsArticle } from "@/lib/news/types";
import { cn } from "@/lib/utils";

export function NewsMeta({ article, className }: { article: NewsArticle; className?: string }) {
  return (
    <p className={cn("flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-muted-foreground", className)}>
      <span className="font-semibold text-foreground/80">{article.source.name}</span>
      <span aria-hidden="true" className="text-border">●</span>
      <time dateTime={article.publishedAt}>{formatPublished(article.publishedAt)}</time>
    </p>
  );
}

export function ReadMore({ id, className }: { id: string; className?: string }) {
  return (
    <Link
      to="/news/$id"
      params={{ id }}
      className={cn(
        "group/rm inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-strong",
        className,
      )}
    >
      Читати більше
      <ArrowRight className="size-4 transition-transform group-hover/rm:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
