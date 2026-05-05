export const SWIPE_LIMIT = 30;
export const SWIPE_RESET_MS = 24 * 60 * 60 * 1000;

export const getSwipeStorageKey = (userId) => `onedate:swipes:${userId}`;

/**
 * Reads swipe balance from localStorage, applies daily reset when past resetAt,
 * and persists normalized state. Returns { remaining, resetAt }.
 */
export function readOrInitializeSwipeState(userId) {
  if (!userId) {
    return { remaining: SWIPE_LIMIT, resetAt: Date.now() + SWIPE_RESET_MS };
  }
  const key = getSwipeStorageKey(userId);
  const now = Date.now();
  const raw = localStorage.getItem(key);

  if (!raw) {
    const initial = { remaining: SWIPE_LIMIT, resetAt: now + SWIPE_RESET_MS };
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.remaining !== 'number' || typeof parsed.resetAt !== 'number') {
      throw new Error('Invalid swipe storage format');
    }
    if (now >= parsed.resetAt) {
      const reset = { remaining: SWIPE_LIMIT, resetAt: now + SWIPE_RESET_MS };
      localStorage.setItem(key, JSON.stringify(reset));
      return reset;
    }
    return { remaining: parsed.remaining, resetAt: parsed.resetAt };
  } catch {
    const fallback = { remaining: SWIPE_LIMIT, resetAt: now + SWIPE_RESET_MS };
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

export function writeSwipeState(userId, remaining, resetAt) {
  if (!userId) return;
  const key = getSwipeStorageKey(userId);
  localStorage.setItem(key, JSON.stringify({ remaining, resetAt }));
}

/** Adds delta to remaining swipes without changing the current reset window. */
export function incrementSwipes(userId, delta = 1) {
  const { remaining, resetAt } = readOrInitializeSwipeState(userId);
  const next = Math.max(0, remaining + delta);
  writeSwipeState(userId, next, resetAt);
  return { remaining: next, resetAt };
}
