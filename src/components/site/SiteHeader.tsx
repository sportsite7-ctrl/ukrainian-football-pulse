import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Logo } from "./Logo";
import { NAV_ITEMS } from "./nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="container-page flex h-14 items-center justify-between gap-4 md:h-16">
        <Logo />

        <nav aria-label="Основна навігація" className="hidden h-full items-center md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="relative flex h-full items-center px-3 text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-primary after:opacity-0 after:transition-opacity hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:opacity-100 lg:px-4 lg:after:inset-x-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Закрити меню" : "Відкрити меню"}
          className="grid size-10 shrink-0 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Мобільна навігація" className="border-t bg-card md:hidden">
          <ul className="container-page grid gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted data-[status=active]:bg-primary-soft data-[status=active]:text-primary-strong"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
