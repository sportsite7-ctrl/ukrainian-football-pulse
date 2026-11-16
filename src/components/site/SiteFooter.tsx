import { Link } from "@tanstack/react-router";

import { TOURNAMENTS } from "@/lib/news/taxonomy";
import { LogoMark } from "./Logo";
import { NAV_ITEMS } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="container-page grid gap-10 py-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-base font-bold">
              SPORT <span className="text-primary">PULSE</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Українськомовний агрегатор новин великого європейського та світового футболу. Трансфери, матчі,
            турніри й головні історії з провідних спортивних видань — в одному місці.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Розділи</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-foreground transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Турніри</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {TOURNAMENTS.map((t) => (
              <li key={t.id}>
                <Link to="/tournaments" className="text-foreground transition-colors hover:text-primary">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SPORT PULSE. Усі права на матеріали належать їхнім джерелам.</p>
          <p>Зараз на сайті показано демонстраційні новини.</p>
        </div>
      </div>
    </footer>
  );
}
