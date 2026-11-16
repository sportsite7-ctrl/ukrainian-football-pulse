import { queryOptions } from "@tanstack/react-query";

export interface Fixture {
  id: string;
  home: string;
  away: string;
  date: string;
  competition: string;
  round?: string;
  score?: [number, number];
  status: "scheduled" | "finished";
}

interface RawMatch {
  round?: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: { ft?: [number, number]; ht?: [number, number] } | [number, number];
}

interface RawLeague {
  name: string;
  matches: RawMatch[];
}

const LEAGUES = [
  { id: "epl", label: "Англійська Прем'єр-ліга", url: "https://raw.githubusercontent.com/openfootball/football.json/master/2026-27/en.1.json" },
  { id: "laliga", label: "Іспанська Ла Ліга", url: "https://raw.githubusercontent.com/openfootball/football.json/master/2026-27/es.1.json" },
  { id: "bundesliga", label: "Німецька Бундесліга", url: "https://raw.githubusercontent.com/openfootball/football.json/master/2026-27/de.1.json" },
  { id: "seriea", label: "Італійська Серія А", url: "https://raw.githubusercontent.com/openfootball/football.json/master/2026-27/it.1.json" },
  { id: "ligue1", label: "Французька Ліга 1", url: "https://raw.githubusercontent.com/openfootball/football.json/master/2026-27/fr.1.json" },
] as const;

function getScore(score: RawMatch["score"]): [number, number] | undefined {
  if (Array.isArray(score) && score.length === 2) return [Number(score[0]), Number(score[1])];
  if (score && !Array.isArray(score) && score.ft?.length === 2) {
    return [Number(score.ft[0]), Number(score.ft[1])];
  }
  return undefined;
}

async function fetchLeague(league: (typeof LEAGUES)[number]): Promise<Fixture[]> {
  const response = await fetch(league.url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${league.label}: HTTP ${response.status}`);
  const data = (await response.json()) as RawLeague;
  if (!Array.isArray(data.matches)) throw new Error(`Невідомий формат даних: ${league.label}`);

  return data.matches.map((match, index) => {
    const score = getScore(match.score);
    return {
      id: `${league.id}-${match.date}-${index}`,
      home: match.team1,
      away: match.team2,
      date: match.date,
      competition: league.label,
      ...(match.round ? { round: match.round } : {}),
      ...(score ? { score } : {}),
      status: score ? "finished" : "scheduled",
    };
  });
}

export async function fetchFixtures(): Promise<Fixture[]> {
  const results = await Promise.allSettled(LEAGUES.map(fetchLeague));
  const fixtures = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  if (!fixtures.length) throw new Error("Календар матчів тимчасово недоступний");
  return fixtures.sort((a, b) => a.date.localeCompare(b.date));
}

export const fixturesQueryOptions = () =>
  queryOptions({
    queryKey: ["football", "fixtures"],
    queryFn: fetchFixtures,
    staleTime: 30 * 60_000,
  });
