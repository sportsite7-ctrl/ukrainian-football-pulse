import type { TournamentId } from "./types";

/** Demo fixtures/results for the Matches page. Will come from the same data source as news later. */
export interface Fixture {
  id: string;
  home: string;
  away: string;
  kickoff: string; // ISO UTC
  tournament: TournamentId;
  score?: [number, number];
}

export const UPCOMING_FIXTURES: Fixture[] = [
  { id: "f1", home: "Інтер", away: "Баварія", kickoff: "2026-11-24T20:00:00Z", tournament: "ucl" },
  { id: "f2", home: "Реал Мадрид", away: "Ліверпуль", kickoff: "2026-11-24T20:00:00Z", tournament: "ucl" },
  { id: "f3", home: "Арсенал", away: "ПСЖ", kickoff: "2026-11-25T20:00:00Z", tournament: "ucl" },
  { id: "f4", home: "Манчестер Сіті", away: "Ювентус", kickoff: "2026-11-25T20:00:00Z", tournament: "ucl" },
  { id: "f5", home: "Рома", away: "Порту", kickoff: "2026-11-26T17:45:00Z", tournament: "uel" },
];

export const RECENT_RESULTS: Fixture[] = [
  { id: "r1", home: "Франція", away: "Італія", kickoff: "2026-11-15T19:45:00Z", tournament: "nations-league", score: [2, 1] },
  { id: "r2", home: "Німеччина", away: "Нідерланди", kickoff: "2026-11-15T19:45:00Z", tournament: "nations-league", score: [2, 2] },
  { id: "r3", home: "Англія", away: "Греція", kickoff: "2026-11-15T17:00:00Z", tournament: "nations-league", score: [3, 0] },
  { id: "r4", home: "Іспанія", away: "Данія", kickoff: "2026-11-14T19:45:00Z", tournament: "nations-league", score: [3, 0] },
];
