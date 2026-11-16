import { CATEGORY_TABS } from "@/lib/news/taxonomy";
import type { CategoryFilter } from "@/lib/news/types";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
      <div role="tablist" aria-label="Категорії новин" className="flex w-max gap-2">
        {CATEGORY_TABS.map((tab) => {
          const active = tab.value === value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.value)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-primary",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
