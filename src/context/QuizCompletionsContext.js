import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { quizCompletions } from '../lib/supabase';
import { readQuizResult } from '../lib/quizzes';

const QuizCompletionsContext = createContext(null);

export function QuizCompletionsProvider({ userId, children }) {
  const location = useLocation();
  const [dbCompletions, setDbCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setDbCompletions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await quizCompletions.getByUser(userId);
    if (error) {
      console.error('Failed to load quiz completions:', error);
      setDbCompletions([]);
    } else {
      setDbCompletions(data || []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (location.state?.quizResult) {
      refresh();
    }
  }, [location.state?.quizResult, refresh]);

  const isCompleted = useCallback(
    (quizId) => {
      if (dbCompletions.some((entry) => entry.quiz_id === quizId)) return true;
      const local = readQuizResult(userId, quizId);
      return Boolean(local?.answers || local?.resultLabel);
    },
    [dbCompletions, userId]
  );

  const getResultLabel = useCallback(
    (quizId) => {
      const dbEntry = dbCompletions.find((entry) => entry.quiz_id === quizId);
      if (dbEntry) return dbEntry.result_label;
      return readQuizResult(userId, quizId)?.resultLabel || null;
    },
    [dbCompletions, userId]
  );

  const value = {
    dbCompletions,
    loading,
    isCompleted,
    getResultLabel,
    refresh,
  };

  return (
    <QuizCompletionsContext.Provider value={value}>
      {children}
    </QuizCompletionsContext.Provider>
  );
}

export function useQuizCompletions() {
  const ctx = useContext(QuizCompletionsContext);
  if (!ctx) {
    throw new Error('useQuizCompletions must be used within QuizCompletionsProvider');
  }
  return ctx;
}

/** Safe outside provider (e.g. landing preview). Falls back to localStorage only. */
export function useOptionalQuizCompletions() {
  return useContext(QuizCompletionsContext);
}
