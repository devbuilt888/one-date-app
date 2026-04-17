import React, { useMemo, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Chip,
} from '@mui/material';

const ReusableQuiz = ({
  title,
  description,
  questions = [],
  onComplete,
  submitLabel = 'Submitting...',
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  const progressValue = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return ((currentQuestionIndex + 1) / totalQuestions) * 100;
  }, [currentQuestionIndex, totalQuestions]);

  const handleOptionSelect = async (questionId, optionValue) => {
    if (!questionId || isSubmitting) return;

    const nextAnswers = { ...answers, [questionId]: optionValue };
    setAnswers(nextAnswers);

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(nextAnswers);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!totalQuestions) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            label={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            size="small"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            {Math.round(progressValue)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.100',
          }}
        />
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="h5"
          fontWeight="600"
          color="text.primary"
          sx={{ fontSize: { xs: '1.15rem', sm: '1.35rem' } }}
        >
          {currentQuestion.question}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {currentQuestion.options.map((option) => (
          <Grid item xs={12} sm={6} key={option.value}>
            <Card
              sx={{
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <CardActionArea
                disabled={isSubmitting}
                onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                sx={{ height: '100%', alignItems: 'stretch' }}
              >
                <CardContent sx={{ p: 2.2 }}>
                  <Typography variant="subtitle1" fontWeight="600" color="text.primary" sx={{ mb: 0.5 }}>
                    {option.label}
                  </Typography>
                  {option.description && (
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isSubmitting && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
          {submitLabel}
        </Typography>
      )}
    </Paper>
  );
};

export default ReusableQuiz;
