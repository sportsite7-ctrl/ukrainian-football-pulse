import { Link } from "@tanstack/react-router";

import type { NewsArticle } from "@/lib/news/types";
import { cn } from "@/lib/utils";
import { CategoryBadge, categoryBar } from "./CategoryBadge";
import { NewsMeta, ReadMore } from "./NewsMeta";

type Variant = "feature" | "default" | "wide" | "horizontal";

interface NewsCardProps {
  article: NewsArticle;
  variant?: Variant;
  className?: string | undefined;
  priority?: boolean | undefined;
}

function Thumb({
  article,
  className,
  priority,
  sizes,
}: {
  article: NewsArticle;
  className?: string | undefined;
  priority?: boolean | undefined;
  sizes?: string | undefined;
}) {
  if (!article.imageUrl) return null;
  return (
    <Link
      to="/news/$id"
      params={{ id: article.id }}
      tabIndex={-1}
      aria-hidden="true"
      className={cn("relative block overflow-hidden bg-muted", className)}
    >
      <img
        src={article.imageUrl}
        alt={article.imageAlt ?? ""}
        width={1200}
        height={800}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="img-zoom h-full w-full object-cover group-hover:scale-[1.03]"
      />
    </Link>
  );
}

function Title({ article, className }: { article: NewsArticle; className?: string }) {
  return (
    <Link
      to="/news/$id"
      params={{ id: article.id }}
      className={cn("break-words transition-colors hover:text-primary", className)}
    >
      {article.title}
    </Link>
  );
}

const cardShell =
  "group relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-shadow hover:shadow-card-hover";

export function NewsCard({ article, variant = "default", className, priority }: NewsCardProps) {
  if (variant === "feature") {
    return (
      <article className={cn(cardShell, "rounded-2xl", className)}>
        <Thumb article={article} priority={priority} className="aspect-[16/10] sm:aspect-[16/9]" />
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-7">
          <CategoryBadge category={article.category} />
          <h2 className="font-display text-xl font-semibold leading-[1.2] text-balance sm:text-[1.9rem]">
            <Title article={article} />
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{article.summary}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <NewsMeta article={article} />
            <ReadMore id={article.id} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className={cn("group flex min-w-0 gap-4 py-4", className)}>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <CategoryBadge category={article.category} />
          <h3 className="text-[15px] font-bold leading-snug sm:text-base">
            <Title article={article} className="line-clamp-3" />
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-1">
            <NewsMeta article={article} />
            <ReadMore id={article.id} className="text-[13px]" />
          </div>
        </div>
        <Thumb
          article={article}
          className="size-24 shrink-0 rounded-lg sm:h-28 sm:w-36"
          sizes="144px"
        />
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article className={cn(cardShell, article.imageUrl && "md:grid md:grid-cols-2", className)}>
        {article.imageUrl ? (
          <Thumb article={article} className="aspect-[16/10] md:aspect-auto md:h-full" />
        ) : (
          <span className={cn("h-1 w-full", categoryBar({ tone: article.category }))} aria-hidden="true" />
        )}
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <CategoryBadge category={article.category} />
          <h3 className="text-lg font-bold leading-snug text-balance sm:text-xl">
            <Title article={article} />
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{article.summary}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
            <NewsMeta article={article} />
            <ReadMore id={article.id} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn(cardShell, className)}>
      {article.imageUrl ? (
        <Thumb article={article} className="aspect-[16/10]" />
      ) : (
        <span className={cn("h-1 w-full", categoryBar({ tone: article.category }))} aria-hidden="true" />
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <CategoryBadge category={article.category} />
        <h3 className="text-[17px] font-bold leading-snug">
          <Title article={article} className="line-clamp-3" />
        </h3>
        <p className={cn("text-sm leading-relaxed text-muted-foreground", article.imageUrl ? "line-clamp-3" : "line-clamp-5")}>
          {article.summary}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <NewsMeta article={article} />
          <ReadMore id={article.id} />
        </div>
      </div>
    </article>
  );
}
