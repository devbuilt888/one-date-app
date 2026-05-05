import { quizDefinitions, QUIZ_STORAGE_PREFIX } from './quizzes';
import { DOOR_OPTIONS } from './doorOptions';

export const SEASON_STORAGE_KEY = 'onedate:seasonRuntime:v1';

/** Default season length (HH:MM:SS). Change for production (e.g. 7 days). */
export const SEASON_DURATION_MS = 10 * 60 * 1000; // 00:10:00

/** Random door on each page load / season roll (not persisted — only quiz requirements + timer are saved). */
export function pickRandomDoorImage() {
  const i = Math.floor(Math.random() * DOOR_OPTIONS.length);
  return DOOR_OPTIONS[i].image;
}

function pickRequiredQuizIds() {
  const shuffled = [...quizDefinitions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((q) => q.id);
}

export function clearAllQuizResults() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const k = localStorage.key(i);
    if (k && k.startsWith(`${QUIZ_STORAGE_PREFIX}:`)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

/**
 * @returns {{ endsAt: number, season: number, part: number, requiredQuizIds: string[] } | null}
 */
export function loadSeasonState() {
  try {
    const raw = localStorage.getItem(SEASON_STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (
      !s ||
      typeof s.endsAt !== 'number' ||
      typeof s.season !== 'number' ||
      typeof s.part !== 'number' ||
      !Array.isArray(s.requiredQuizIds)
    ) {
      return null;
    }
    return {
      endsAt: s.endsAt,
      season: s.season,
      part: s.part,
      requiredQuizIds: s.requiredQuizIds,
    };
  } catch {
    return null;
  }
}

export function saveSeasonState(state) {
  localStorage.setItem(SEASON_STORAGE_KEY, JSON.stringify(state));
}

/**
 * Clears all quiz answers, picks new required quizzes, starts a new countdown window.
 * Door image is chosen in the UI layer (random per load / per roll).
 * @param {object | null | undefined} previous
 */
export function rollNewSeason(previous) {
  clearAllQuizResults();
  const now = Date.now();
  const season = previous?.season ?? 1;
  const part = previous ? previous.part + 1 : 1;
  const next = {
    endsAt: now + SEASON_DURATION_MS,
    season,
    part,
    requiredQuizIds: pickRequiredQuizIds(),
  };
  saveSeasonState(next);
  return next;
}

export function ensureSeasonState() {
  const s = loadSeasonState();
  const now = Date.now();
  if (!s) return rollNewSeason(null);
  if (now >= s.endsAt) return rollNewSeason(s);
  return s;
}

/** @param {number} ms */
export function formatSeasonHmsClock(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)} : ${pad(m)} : ${pad(sec)}`;
}

export function getSeasonLabel(state) {
  if (!state) return 'Season 1 Part 1';
  return `Season ${state.season} Part ${state.part}`;
}
