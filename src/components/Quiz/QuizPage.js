import React, { useMemo } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Container, Box, Typography, Chip, Stack } from '@mui/material';
import { useAuth } from '../../App';
import ReusableQuiz from './ReusableQuiz';
import { getQuizDefinition, saveQuizResult, readQuizResult } from '../../lib/quizzes';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const quiz = useMemo(() => getQuizDefinition(quizId), [quizId]);
  const existingResult = useMemo(() => {
    if (!quizId) return null;
    return readQuizResult(user?.id, quizId);
  }, [quizId, user]);

  if (!quiz) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleComplete = async (answers) => {
    saveQuizResult(user?.id, quiz.id, answers);
    navigate('/dashboard', { replace: true });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Chip label={quiz.badge} variant="outlined" />
          {existingResult && <Chip label="Completed before" color="success" variant="outlined" />}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {quiz.completionMessage}
        </Typography>
      </Box>

      <ReusableQuiz
        title={quiz.title}
        description={quiz.subtitle}
        questions={quiz.questions}
        onComplete={handleComplete}
        submitLabel="Saving your quiz answers..."
      />
    </Container>
  );
};

export default QuizPage;
