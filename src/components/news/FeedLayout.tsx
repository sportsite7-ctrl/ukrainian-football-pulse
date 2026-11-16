import type { CategoryFilter } from "@/lib/news/types";
import { LatestNews } from "./LatestNews";
import { NewsFeed } from "./NewsFeed";

export function FeedLayout({ defaultCategory = "all" }: { defaultCategory?: CategoryFilter }) {
  return (
    <div className="container-page mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <NewsFeed defaultCategory={defaultCategory} />
      <LatestNews />
    </div>
  );
}
