import type { ClubId, NewsCategory, CategoryFilter, TournamentId } from "./types";

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  transfers: "Трансфери",
  matches: "Матчі",
  tournaments: "Турніри",
  players: "Гравці",
  coaches: "Тренери",
};

export const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Усі новини" },
  { value: "transfers", label: "Трансфери" },
  { value: "matches", label: "Матчі" },
  { value: "tournaments", label: "Турніри" },
  { value: "players", label: "Гравці" },
  { value: "coaches", label: "Тренери" },
];

export interface Club {
  id: ClubId;
  name: string;
  short: string;
  country: string;
}

export const CLUBS: Club[] = [
  { id: "real-madrid", name: "Реал Мадрид", short: "RMA", country: "Іспанія" },
  { id: "barcelona", name: "Барселона", short: "BAR", country: "Іспанія" },
  { id: "man-city", name: "Манчестер Сіті", short: "MCI", country: "Англія" },
  { id: "liverpool", name: "Ліверпуль", short: "LIV", country: "Англія" },
  { id: "arsenal", name: "Арсенал", short: "ARS", country: "Англія" },
  { id: "man-utd", name: "Манчестер Юнайтед", short: "MUN", country: "Англія" },
  { id: "bayern", name: "Баварія", short: "FCB", country: "Німеччина" },
  { id: "psg", name: "ПСЖ", short: "PSG", country: "Франція" },
  { id: "inter", name: "Інтер", short: "INT", country: "Італія" },
  { id: "juventus", name: "Ювентус", short: "JUV", country: "Італія" },
];

export interface Tournament {
  id: TournamentId;
  name: string;
  short: string;
  description: string;
  stage: string;
}

export const TOURNAMENTS: Tournament[] = [
  {
    id: "ucl",
    name: "Ліга чемпіонів УЄФА",
    short: "ЛЧ",
    description: "Головний клубний турнір Європи: 36 команд у загальній таблиці основного етапу.",
    stage: "Основний етап · 5-й тур",
  },
  {
    id: "uel",
    name: "Ліга Європи УЄФА",
    short: "ЛЄ",
    description: "Другий за статусом єврокубок із формулою основного етапу та плей-оф.",
    stage: "Основний етап · 5-й тур",
  },
  {
    id: "world-cup",
    name: "Чемпіонат світу FIFA",
    short: "ЧС",
    description: "Найбільший футбольний турнір планети. Новини про підсумки ЧС-2026 і шлях до 2030-го.",
    stage: "Між турнірами",
  },
  {
    id: "euro",
    name: "Чемпіонат Європи УЄФА",
    short: "Євро",
    description: "Континентальна першість збірних. Попереду — відбір на Євро-2028.",
    stage: "Підготовка до відбору",
  },
  {
    id: "nations-league",
    name: "Ліга націй УЄФА",
    short: "ЛН",
    description: "Турнір збірних із дивізіонами A–D, підсумковим «фіналом чотирьох» та плей-оф.",
    stage: "Груповий етап · фінальні тури",
  },
];

export const clubById = (id: ClubId) => CLUBS.find((c) => c.id === id);
export const tournamentById = (id: TournamentId) => TOURNAMENTS.find((t) => t.id === id);
