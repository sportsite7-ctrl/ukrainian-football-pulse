// Fixed time zone keeps server and browser output identical (no hydration mismatch).
const TIME_ZONE = "Europe/Kyiv";

const dayMonth = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", timeZone: TIME_ZONE });
const dayMonthShort = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short", timeZone: TIME_ZONE });
const time = new Intl.DateTimeFormat("uk-UA", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TIME_ZONE,
});
const weekdayDate = new Intl.DateTimeFormat("uk-UA", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: TIME_ZONE,
});

/** "16 листопада, 10:55" */
export function formatPublished(iso: string): string {
  const d = new Date(iso);
  return `${dayMonth.format(d)}, ${time.format(d)}`;
}

/** "10:55" */
export function formatTime(iso: string): string {
  return time.format(new Date(iso));
}

/** "16 лист." */
export function formatShortDate(iso: string): string {
  return dayMonthShort.format(new Date(iso));
}

/** "вт, 24 лист." */
export function formatWeekdayDate(iso: string): string {
  return weekdayDate.format(new Date(iso));
}
