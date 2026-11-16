export const NAV_ITEMS = [
  { to: "/", label: "Головна", exact: true },
  { to: "/news", label: "Усі новини", exact: false },
  { to: "/transfers", label: "Трансфери", exact: false },
  { to: "/matches", label: "Матчі", exact: false },
  { to: "/tournaments", label: "Турніри", exact: false },
] as const;
