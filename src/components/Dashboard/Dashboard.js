import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';
import { quizDefinitions, readQuizResult } from '../../lib/quizzes';
import DashboardHeroDoorBlock from './DashboardHeroDoorBlock';
import FunQuizCard from '../Quiz/FunQuizCard';
import { SeasonRuntimeProvider } from '../../context/SeasonRuntimeContext';
import FunQuizzesSeasonHeader from '../Quiz/FunQuizzesSeasonHeader';
import PersonalEventsSection from './PersonalEventsSection';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <SeasonRuntimeProvider>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth="lg" sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
          <DashboardHeroDoorBlock mode="dashboard" user={user} />

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Fun Quizzes Section */}
            <Grid item xs={12}>
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

                <Grid container spacing={2}>
                {quizDefinitions.map((quiz) => {
                  const completed = Boolean(readQuizResult(user?.id, quiz.id)?.answers);
                  return (
                    <Grid item xs={12} sm={6} md={3} key={quiz.id}>
                      <FunQuizCard
                        quiz={quiz}
                        onClick={() => navigate(`/quizzes/${quiz.id}`)}
                        statusVariant={completed ? 'completed' : 'not_started'}
                      />
                    </Grid>
                  );
                })}
                </Grid>
              </Paper>
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
    </SeasonRuntimeProvider>
  );
};

export default Dashboard;
