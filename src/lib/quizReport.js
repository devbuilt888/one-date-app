import { quizDefinitions, readQuizResult } from './quizzes';

const completionToMap = (completions = [], userId) => {
  const map = {};
  completions.forEach((entry) => {
    map[entry.quiz_id] = entry.result_label;
  });

  quizDefinitions.forEach((quiz) => {
    if (map[quiz.id]) return;
    const local = readQuizResult(userId, quiz.id);
    if (local?.resultLabel) {
      map[quiz.id] = local.resultLabel;
    }
  });

  return map;
};

export const buildQuizComparison = (
  currentUserId,
  matchedUserId,
  currentCompletions = [],
  matchedCompletions = []
) => {
  const currentMap = completionToMap(currentCompletions, currentUserId);
  const matchedMap = completionToMap(matchedCompletions, matchedUserId);

  const sharedQuizIds = quizDefinitions
    .map((quiz) => quiz.id)
    .filter((quizId) => currentMap[quizId] || matchedMap[quizId]);

  return sharedQuizIds.map((quizId) => {
    const quiz = quizDefinitions.find((q) => q.id === quizId);
    return {
      quizId,
      quizTitle: quiz?.title || quizId,
      badge: quiz?.badge || '',
      gradient: quiz?.gradient,
      currentResult: currentMap[quizId] || 'Not completed',
      matchedResult: matchedMap[quizId] || 'Not completed',
      bothCompleted: Boolean(currentMap[quizId] && matchedMap[quizId]),
      isMatch: currentMap[quizId] && matchedMap[quizId] && currentMap[quizId] === matchedMap[quizId],
    };
  });
};

export const getProfileQuizResults = (userId, dbCompletions = []) => {
  const map = completionToMap(dbCompletions, userId);

  return quizDefinitions
    .filter((quiz) => map[quiz.id])
    .map((quiz) => ({
      quizId: quiz.id,
      title: quiz.title,
      badge: quiz.badge,
      gradient: quiz.gradient,
      resultLabel: map[quiz.id],
    }));
};
