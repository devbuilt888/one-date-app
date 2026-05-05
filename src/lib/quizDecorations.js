import { supabase } from './supabase';

const BUCKET = 'quiz-decorations';

/** Quiz id → object filename in `quiz-decorations` (root of bucket). */
const QUIZ_DECORATION_FILES = {
  'hogwarts-house': 'hogwarts.png',
  'ideal-vacation': 'vacation.png',
  'twilight-character': 'twilight.png',
  'love-language': 'language.png',
  'disney-princess': 'princess.png',
  'star-wars': 'starwars.png',
  'marvel-hero': 'marvel.png',
  'dating-style': 'date.png',
};

/**
 * @param {string} quizId
 * @returns {string | null} Public Storage URL, or null when this quiz has no decoration yet.
 */
export function getQuizDecorationPublicUrl(quizId) {
  const file = QUIZ_DECORATION_FILES[quizId];
  if (!file) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(file);
  return data?.publicUrl ?? null;
}
