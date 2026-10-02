import React, { useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';
import { quizDefinitions } from '../../lib/quizzes';
import DashboardHeroDoorBlock from './DashboardHeroDoorBlock';
import FunQuizCard from '../Quiz/FunQuizCard';
import { SeasonRuntimeProvider, useSeasonRuntime } from '../../context/SeasonRuntimeContext';
import { QuizCompletionsProvider, useQuizCompletions } from '../../context/QuizCompletionsContext';
import FunQuizzesSeasonHeader from '../Quiz/FunQuizzesSeasonHeader';
import PersonalEventsSection from './PersonalEventsSection';
import SponsoredEventsSection from '../Events/SponsoredEventsSection';

const FunQuizzesGrid = ({ user }) => {
  const navigate = useNavigate();
  const { isCompleted } = useQuizCompletions();
  const { formattedSeasonClock, seasonLabel } = useSeasonRuntime();

  const incompleteQuizzes = useMemo(
    () => quizDefinitions.filter((quiz) => !isCompleted(quiz.id)),
    [isCompleted]
  );

  const completedCount = quizDefinitions.length - incompleteQuizzes.length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        border: '1px solid',
        borderColor: 'grey.200',
        mb: 3,
      }}
    >
      <FunQuizzesSeasonHeader subtitle="Discover more about yourself with these personality quizzes" />

      {incompleteQuizzes.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 3, sm: 4 },
            px: 2,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'grey.300',
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            All quizzes completed!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You finished {completedCount} quiz{completedCount === 1 ? '' : 'es'} this season.
            New quizzes will appear when the season rolls.
          </Typography>
          <Typography
            variant="body1"
            fontWeight={700}
            sx={{
              fontFamily: 'monospace',
              letterSpacing: 1,
              color: 'primary.main',
            }}
          >
            {seasonLabel} · {formattedSeasonClock}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Until new quizzes unlock
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {incompleteQuizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={3} key={quiz.id}>
              <FunQuizCard
                quiz={quiz}
                onClick={() => navigate(`/quizzes/${quiz.id}`)}
                statusVariant="not_started"
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <SeasonRuntimeProvider>
      <QuizCompletionsProvider userId={user?.id}>
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 4 }}>
          <Container maxWidth="lg" sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
            <DashboardHeroDoorBlock mode="dashboard" user={user} />

            <SponsoredEventsSection compact />

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <FunQuizzesGrid user={user} />
              </Grid>

              <Grid item xs={12}>
                <PersonalEventsSection
                  userId={user?.id}
                  displayName={
                    user?.user_metadata?.display_name ||
                    user?.email?.split('@')[0] ||
                    'You'
                  }
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </QuizCompletionsProvider>
    </SeasonRuntimeProvider>
  );
};

export default Dashboard;
