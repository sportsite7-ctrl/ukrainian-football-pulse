import { cva } from "class-variance-authority";

import { CATEGORY_LABELS } from "@/lib/news/taxonomy";
import type { NewsCategory } from "@/lib/news/types";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-[0.06em]",
  {
    variants: {
      tone: {
        transfers: "bg-flare-soft text-flare-ink",
        matches: "bg-pitch-soft text-pitch-ink",
        tournaments: "bg-primary-soft text-primary-strong",
        players: "bg-sky-soft text-sky-ink",
        coaches: "bg-slate-soft text-slate-ink",
      },
    },
  },
);

/** Solid accent used as a stripe on photo-less cards. */
export const categoryBar = cva("", {
  variants: {
    tone: {
      transfers: "bg-flare",
      matches: "bg-pitch",
      tournaments: "bg-primary",
      players: "bg-sky",
      coaches: "bg-slate-ink",
    },
  },
});

export function CategoryBadge({ category, className }: { category: NewsCategory; className?: string }) {
  return <span className={cn(badge({ tone: category }), className)}>{CATEGORY_LABELS[category]}</span>;
}
