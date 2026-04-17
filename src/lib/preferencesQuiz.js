export const PREFERENCES_STORAGE_PREFIX = 'onedate:preferencesQuiz';

export const getPreferencesStorageKey = (userId) => {
  if (!userId) return `${PREFERENCES_STORAGE_PREFIX}:guest`;
  return `${PREFERENCES_STORAGE_PREFIX}:${userId}`;
};

export const readPreferencesQuizAnswers = (userId) => {
  try {
    const key = getPreferencesStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read preferences quiz answers:', error);
    return null;
  }
};

export const savePreferencesQuizAnswers = (userId, answers) => {
  try {
    const key = getPreferencesStorageKey(userId);
    const payload = {
      answers,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to save preferences quiz answers:', error);
  }
};

export const hasCompletedPreferencesQuiz = (userId) => {
  const data = readPreferencesQuizAnswers(userId);
  return Boolean(data?.answers);
};
