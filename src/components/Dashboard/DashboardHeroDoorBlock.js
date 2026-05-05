import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { quizDefinitions, readQuizResult } from '../../lib/quizzes';
import { DOOR_OPTIONS } from '../../lib/doorOptions';
import { readOrInitializeSwipeState } from '../../lib/swipes';
import { useSeasonRuntime } from '../../context/SeasonRuntimeContext';

const DOOR_UNLOCK_SECONDS = 60;

const formatCountdown = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
};

const DashboardHeroDoorBlock = ({ mode = 'dashboard', user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = mode === 'landing';
  const { doorImage: selectedDoorImage, requiredQuizIds, snapshot } = useSeasonRuntime();

  const [doorPhase, setDoorPhase] = useState('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(DOOR_UNLOCK_SECONDS);
  const [remainingSwipes, setRemainingSwipes] = useState(0);
  const [showSwipeBonus, setShowSwipeBonus] = useState(false);

  const doorAnimationTimersRef = useRef([]);

  useEffect(() => {
    setRemainingSeconds(DOOR_UNLOCK_SECONDS);
    setDoorPhase('idle');
    doorAnimationTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    doorAnimationTimersRef.current = [];
  }, [snapshot.season, snapshot.part, snapshot.endsAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLanding || !user?.id) return;

    const syncSwipes = () => {
      const { remaining } = readOrInitializeSwipeState(user.id);
      setRemainingSwipes(remaining);
    };

    syncSwipes();
    const swipeTimer = setInterval(syncSwipes, 1000);
    return () => clearInterval(swipeTimer);
  }, [user?.id, isLanding]);

  useEffect(() => {
    if (isLanding || !user?.id) return;
    const st = location.state;
    if (!st?.swipeBonus) return;

    if (typeof st.swipeRemaining === 'number') {
      setRemainingSwipes(st.swipeRemaining);
    }
    setShowSwipeBonus(true);
    navigate(location.pathname, { replace: true, state: {} });
    const timer = setTimeout(() => setShowSwipeBonus(false), 1300);
    return () => clearTimeout(timer);
  }, [location.state, isLanding, user?.id, navigate, location.pathname]);

  useEffect(() => {
    if (isLanding || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {}
    );
  }, [isLanding]);

  useEffect(() => {
    return () => {
      doorAnimationTimersRef.current.forEach((timerId) => clearTimeout(timerId));
      doorAnimationTimersRef.current = [];
    };
  }, []);

  const selectedDoorName = DOOR_OPTIONS.find((door) => door.image === selectedDoorImage)?.name || 'Seasonal Door';

  const requiredQuizzes = useMemo(
    () => quizDefinitions.filter((quiz) => requiredQuizIds.includes(quiz.id)),
    [requiredQuizIds]
  );

  const quizCompletionMap = useMemo(() => {
    const map = {};
    requiredQuizzes.forEach((quiz) => {
      map[quiz.id] = Boolean(readQuizResult(user?.id, quiz.id)?.answers);
    });
    return map;
  }, [requiredQuizzes, user?.id]);

  const completedQuizCount = useMemo(
    () => requiredQuizzes.filter((quiz) => quizCompletionMap[quiz.id]).length,
    [requiredQuizzes, quizCompletionMap]
  );

  const areRequirementsMet = completedQuizCount === requiredQuizzes.length && requiredQuizzes.length > 0;
  const doorStatus = remainingSeconds > 0 ? 'Soon' : areRequirementsMet ? 'Open' : 'Locked';

  const handleDoorClick = () => {
    if (isLanding) return;
    if (doorPhase !== 'idle' || doorStatus !== 'Open') return;
    setDoorPhase('charging');

    const surgeTimer = setTimeout(() => setDoorPhase('surge'), 1300);
    const fadeTimer = setTimeout(() => setDoorPhase('fading'), 1800);
    const goneTimer = setTimeout(() => {
      setDoorPhase('gone');
      navigate('/matching');
    }, 2600);

    doorAnimationTimersRef.current = [surgeTimer, fadeTimer, goneTimer];
  };

  const welcomeTitle =
    user?.user_metadata?.display_name || user?.email
      ? `Welcome back, ${user.user_metadata?.display_name || user.email}! 👋`
      : 'Welcome to OneDate 👋';

  const subline = isLanding
    ? 'Sign in to track your daily swipes and unlock the full experience.'
    : `Swipes available today: ${remainingSwipes}`;

  const quizNavigate = (quizId) => {
    if (user?.id) {
      navigate(`/quizzes/${quizId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: 3,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'grey.200',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            fontWeight="700"
            color="text.primary"
            sx={{
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {welcomeTitle}
          </Typography>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              mb: 1,
              minHeight: showSwipeBonus && !isLanding ? 36 : 'auto',
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                pr: showSwipeBonus && !isLanding ? 4 : 0,
              }}
            >
              {subline}
            </Typography>
            {!isLanding && showSwipeBonus && (
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  left: '100%',
                  top: '50%',
                  ml: 0.75,
                  mt: '-0.65em',
                  color: 'success.main',
                  fontWeight: 800,
                  fontSize: '1rem',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  animation: 'swipeBonusPop 1.15s ease-out forwards',
                  '@keyframes swipeBonusPop': {
                    '0%': {
                      transform: 'translate(0, 0) scale(1)',
                      opacity: 1,
                    },
                    '100%': {
                      transform: 'translate(8px, -14px) scale(1.85)',
                      opacity: 0,
                    },
                  },
                }}
              >
                +1
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            opacity: 0.1,
          }}
        />
      </Paper>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'center',
            my: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2, md: 2.5 },
              border: '1px solid',
              borderColor: 'grey.200',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              minHeight: { xs: 240, sm: 300, md: 340 },
              my: 0,
              background:
                'radial-gradient(circle at center, rgba(99, 102, 241, 0.10) 0%, rgba(15, 23, 42, 0.02) 38%, transparent 72%)',
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {doorPhase !== 'gone' && (
                <Box
                  onClick={handleDoorClick}
                  sx={{
                    position: 'relative',
                    width: { xs: 250, sm: 320, md: 380 },
                    ml: { xs: 1, sm: 4, md: 8 },
                    cursor:
                      !isLanding && doorStatus === 'Open' && doorPhase === 'idle' ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transformOrigin: 'center bottom',
                    transform:
                      doorPhase === 'charging'
                        ? 'scale(1.02)'
                        : doorPhase === 'surge'
                          ? 'scale(1.08)'
                          : 'scale(1)',
                    opacity: doorPhase === 'fading' ? 0 : 1,
                    transition: 'opacity 0.8s ease, transform 0.35s ease',
                    animation:
                      doorPhase === 'charging'
                        ? 'doorCharge 1.3s ease-in-out'
                        : doorPhase === 'surge'
                          ? 'doorSurge 0.35s ease-out'
                          : 'none',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '-20px',
                      borderRadius: '20px',
                      background:
                        'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(129,140,248,0.12) 36%, rgba(129,140,248,0) 72%)',
                      filter: 'blur(6px)',
                      opacity: doorPhase === 'idle' ? 0.55 : 0.95,
                      transition: 'opacity 0.3s ease',
                      animation:
                        doorPhase === 'charging'
                          ? 'chargePulse 0.35s ease-in-out infinite'
                          : doorPhase === 'surge'
                            ? 'shockwave 0.45s ease-out'
                            : 'none',
                      zIndex: 0,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: '-34px',
                      borderRadius: '50%',
                      border: '2px solid rgba(196,181,253,0.85)',
                      transform: 'scale(0.2)',
                      opacity: doorPhase === 'surge' ? 1 : 0,
                      animation: doorPhase === 'surge' ? 'ringBurst 0.55s ease-out forwards' : 'none',
                      zIndex: 0,
                    },
                    '@keyframes chargePulse': {
                      '0%': { transform: 'scale(1)', opacity: 0.75 },
                      '50%': { transform: 'scale(1.08)', opacity: 1 },
                      '100%': { transform: 'scale(1)', opacity: 0.75 },
                    },
                    '@keyframes doorCharge': {
                      '0%': { filter: 'brightness(1)' },
                      '60%': { filter: 'brightness(1.25)' },
                      '100%': { filter: 'brightness(1.1)' },
                    },
                    '@keyframes doorSurge': {
                      '0%': { transform: 'scale(1.02)' },
                      '45%': { transform: 'scale(1.12)' },
                      '100%': { transform: 'scale(1.05)' },
                    },
                    '@keyframes shockwave': {
                      '0%': { transform: 'scale(0.8)', opacity: 1 },
                      '100%': { transform: 'scale(1.65)', opacity: 0 },
                    },
                    '@keyframes ringBurst': {
                      '0%': { transform: 'scale(0.2)', opacity: 1 },
                      '100%': { transform: 'scale(1.5)', opacity: 0 },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={selectedDoorImage}
                    alt="Featured event door"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      position: 'relative',
                      zIndex: 1,
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 1.5,
                      fontWeight: 700,
                      color: 'text.primary',
                      textAlign: 'center',
                    }}
                  >
                    {selectedDoorName}
                  </Typography>
                  <Chip
                    label={doorStatus}
                    size="small"
                    sx={{
                      mt: 1,
                      fontWeight: 700,
                      color: 'white',
                      backgroundColor:
                        doorStatus === 'Open'
                          ? 'success.main'
                          : doorStatus === 'Locked'
                            ? 'warning.main'
                            : 'info.main',
                    }}
                  />
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: { xs: '1rem', sm: '1.15rem' },
                      fontFamily: 'monospace',
                      letterSpacing: 1.2,
                      color: 'text.secondary',
                    }}
                  >
                    {formatCountdown(remainingSeconds)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Paper
              elevation={0}
              sx={{
                width: { xs: '100%', md: 330 },
                p: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
                Door Requirements
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Complete these quizzes to unlock the door ({completedQuizCount}/{requiredQuizzes.length}).
              </Typography>

              <Stack spacing={1}>
                {requiredQuizzes.map((quiz) => {
                  const completed = quizCompletionMap[quiz.id];
                  return (
                    <Box
                      key={quiz.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        p: 1,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {quiz.title}
                      </Typography>
                      {completed ? (
                        <Chip label="Done" color="success" size="small" />
                      ) : (
                        <Button size="small" variant="outlined" onClick={() => quizNavigate(quiz.id)}>
                          Start
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardHeroDoorBlock;
