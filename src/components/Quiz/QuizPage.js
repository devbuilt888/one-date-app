import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Container, Box, Typography, Chip, Stack, Paper, Button } from '@mui/material';
import { AutoAwesome, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../App';
import ReusableQuiz from './ReusableQuiz';
import { getQuizDefinition, saveQuizResult, readQuizResult } from '../../lib/quizzes';
import { incrementSwipes } from '../../lib/swipes';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedResult, setCompletedResult] = useState(null);
  const [bonusState, setBonusState] = useState(null);

  const quiz = useMemo(() => getQuizDefinition(quizId), [quizId]);
  const existingResult = useMemo(() => {
    if (!quizId) return null;
    return readQuizResult(user?.id, quizId);
  }, [quizId, user]);

  if (!quiz) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleComplete = async (answers) => {
    const result = saveQuizResult(user?.id, quiz.id, answers);
    setCompletedResult(result);

    if (user?.id) {
      const { remaining } = incrementSwipes(user.id, 1);
      setBonusState({
        swipeBonus: true,
        swipeRemaining: remaining,
        quizResult: result?.resultLabel,
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard', { replace: true, state: bonusState || undefined });
  };

  if (completedResult) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            textAlign: 'center',
            background: quiz.gradient
              ? `${quiz.gradient}`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
          }}
        >
          <Chip
            icon={<AutoAwesome sx={{ color: '#fff !important' }} />}
            label="Quiz complete"
            sx={{
              mb: 2,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              fontWeight: 600,
            }}
          />

          <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 2 }}>
            {quiz.badge}
          </Typography>

          <Typography variant="h4" fontWeight={800} sx={{ mt: 1, mb: 1 }}>
            {quiz.title}
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
            {quiz.completionMessage}
          </Typography>

          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.95)',
              color: 'text.primary',
              borderRadius: 2,
              py: 3,
              px: 2,
              mb: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your result
            </Typography>
            <Typography variant="h3" fontWeight={800} color="primary.main">
              {completedResult.resultLabel}
            </Typography>
          </Box>

          {bonusState?.swipeBonus && (
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.95 }}>
              +1 bonus swipe unlocked · {bonusState.swipeRemaining} swipes remaining
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<ArrowBack />}
            onClick={handleBackToDashboard}
            sx={{
              bgcolor: '#fff',
              color: 'grey.900',
              fontWeight: 600,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Chip label={quiz.badge} variant="outlined" />
          {existingResult && (
            <Chip
              label={existingResult.resultLabel ? `Last result: ${existingResult.resultLabel}` : 'Completed before'}
              color="success"
              variant="outlined"
            />
          )}
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
        submitLabel="Calculating your result..."
      />
    </Container>
  );
};

export default QuizPage;
