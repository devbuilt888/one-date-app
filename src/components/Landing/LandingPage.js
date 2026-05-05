import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useAuth } from '../../App';
import DashboardHeroDoorBlock from '../Dashboard/DashboardHeroDoorBlock';
import { quizDefinitions, readQuizResult } from '../../lib/quizzes';
import LandingDiscoverPreview from './LandingDiscoverPreview';
import FunQuizCard from '../Quiz/FunQuizCard';
import { SeasonRuntimeProvider } from '../../context/SeasonRuntimeContext';
import FunQuizzesSeasonHeader from '../Quiz/FunQuizzesSeasonHeader';

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuizCardClick = (quizId) => {
    if (isAuthenticated) {
      navigate(`/quizzes/${quizId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <SeasonRuntimeProvider>
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 6 }}>
      {!isAuthenticated && (
        <Paper
          elevation={0}
          square
          sx={{
            borderBottom: '1px solid',
            borderColor: 'grey.200',
            backgroundColor: 'background.paper',
            py: 1.5,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              maxWidth: 'lg',
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Favorite sx={{ color: 'secondary.main' }} />
              <Typography variant="h6" fontWeight="700" color="text.primary">
                OneDate
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={RouterLink} to="/login" variant="outlined" size="small">
                Sign in
              </Button>
              <Button component={RouterLink} to="/signup" variant="contained" size="small">
                Get started
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            mb: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography
            variant="h3"
            fontWeight="700"
            color="text.primary"
            sx={{ mb: 2, fontSize: { xs: '1.75rem', sm: '2.35rem', md: '2.75rem' } }}
          >
            Dating, events, and personality — in one place
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.7 }}>
            OneDate helps you discover people nearby, join themed seasonal moments, and learn more about yourself
            through quick quizzes. Below is a walkthrough of how the home experience works once you are signed in.
          </Typography>
        </Paper>

        <DashboardHeroDoorBlock mode="landing" user={user} />

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ mb: 1.5 }}>
            How the seasonal door works
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
            Each featured door represents a timed event. A countdown runs until the event date and time — while it is
            counting down, the door shows as <strong>Soon</strong>. When the countdown reaches zero, the door moves to{' '}
            <strong>Locked</strong> until you complete a short set of assigned quizzes. After those quizzes are done,
            the door becomes <strong>Open</strong>: tap it to trigger the reveal animation and jump into matching for
            that moment.
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ mb: 1.5 }}>
            Extra swipes from quizzes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Beyond the door requirements, you can complete additional fun quizzes to earn bonus swipes —{' '}
            <strong>one extra swipe per quiz</strong> you finish — so exploring your personality also helps you stay
            active in Discover.
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 3,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <FunQuizzesSeasonHeader
            subtitle={
              isAuthenticated
                ? 'Tap a quiz to start. Completing quizzes can add bonus swipes.'
                : 'Sign in to take quizzes and save your results.'
            }
          />

          <Grid container spacing={2}>
            {quizDefinitions.map((quiz) => {
              const statusVariant = !isAuthenticated
                ? 'sign_in'
                : readQuizResult(user?.id, quiz.id)?.answers
                  ? 'completed'
                  : 'not_started';
              return (
                <Grid item xs={12} sm={6} md={3} key={quiz.id}>
                  <FunQuizCard quiz={quiz} onClick={() => handleQuizCardClick(quiz.id)} statusVariant={statusVariant} />
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        <LandingDiscoverPreview />

        {!isAuthenticated && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button component={RouterLink} to="/signup" variant="contained" size="large" sx={{ px: 4 }}>
              Create an account
            </Button>
            <Button component={RouterLink} to="/login" variant="text" size="large" sx={{ ml: 2 }}>
              I already have an account
            </Button>
          </Box>
        )}
      </Container>
    </Box>
    </SeasonRuntimeProvider>
  );
};

export default LandingPage;
