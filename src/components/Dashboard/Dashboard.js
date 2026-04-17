import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';
import AIChat from './AIChat';
import { quizDefinitions, readQuizResult } from '../../lib/quizzes';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const DOOR_UNLOCK_SECONDS = 60;
  const [showAIChat, setShowAIChat] = useState(false);
  const [isAIChatMinimized, setIsAIChatMinimized] = useState(false);
  const [doorPhase, setDoorPhase] = useState('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(DOOR_UNLOCK_SECONDS);
  const [remainingSwipes, setRemainingSwipes] = useState(0);
  const DOOR_OPTIONS = [
    { image: '/images/doors/chineseNewYearDoorOD.png', name: "Chinese New Year's Door" },
    { image: '/images/doors/fourthJulyDoorOD.png', name: 'Fourth of July Door' },
    { image: '/images/doors/christmasDoorOD.png', name: 'Christmas Door' },
    { image: '/images/doors/superBowlDoorOD.png', name: 'Super Bowl Door' },
    { image: '/images/doors/beachCleanupDoorOD.png', name: 'Beach Cleanup Door' },
    { image: '/images/doors/newYearsDoorOD.png', name: "New Year's Door" },
    { image: '/images/doors/fallSeasonDoorOD.png', name: 'Fall Season Door' },
    { image: '/images/doors/forestCleanupOD.png', name: 'Forest Cleanup Door' },
  ];
  const [selectedDoorImage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * DOOR_OPTIONS.length);
    return DOOR_OPTIONS[randomIndex].image;
  });
  const [requiredQuizIds] = useState(() => {
    const shuffled = [...quizDefinitions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((quiz) => quiz.id);
  });
  const doorAnimationTimersRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [DOOR_UNLOCK_SECONDS]);

  useEffect(() => {
    if (!user?.id) return;

    const swipeStorageKey = `onedate:swipes:${user.id}`;
    const SWIPE_LIMIT = 30;
    const SWIPE_RESET_MS = 24 * 60 * 60 * 1000;

    const syncSwipes = () => {
      const now = Date.now();
      const raw = localStorage.getItem(swipeStorageKey);

      if (!raw) {
        const initial = { remaining: SWIPE_LIMIT, resetAt: now + SWIPE_RESET_MS };
        localStorage.setItem(swipeStorageKey, JSON.stringify(initial));
        setRemainingSwipes(initial.remaining);
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.remaining !== 'number' || typeof parsed.resetAt !== 'number') {
          throw new Error('Invalid swipe format');
        }

        if (now >= parsed.resetAt) {
          const reset = { remaining: SWIPE_LIMIT, resetAt: now + SWIPE_RESET_MS };
          localStorage.setItem(swipeStorageKey, JSON.stringify(reset));
          setRemainingSwipes(reset.remaining);
          return;
        }

        setRemainingSwipes(parsed.remaining);
      } catch {
        const fallback = { remaining: SWIPE_LIMIT, resetAt: now + SWIPE_RESET_MS };
        localStorage.setItem(swipeStorageKey, JSON.stringify(fallback));
        setRemainingSwipes(fallback.remaining);
      }
    };

    syncSwipes();
    const swipeTimer = setInterval(syncSwipes, 1000);
    return () => clearInterval(swipeTimer);
  }, [user?.id]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {}
    );
  }, []);

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

  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
  };

  const handleDoorClick = () => {
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

  const handleCloseAIChat = () => {
    setShowAIChat(false);
  };

  const handleToggleAIChatMinimize = () => {
    setIsAIChatMinimized(!isAIChatMinimized);
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
        {/* Welcome Section */}
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
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Welcome back, {user?.user_metadata?.display_name || user?.email}! 👋
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Swipes available today: {remainingSwipes}
            </Typography>
          </Box>
          
          {/* Decorative elements */}
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
          {/* Featured Door Event */}
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
                    cursor: doorStatus === 'Open' && doorPhase === 'idle' ? 'pointer' : 'not-allowed',
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
                          <Button size="small" variant="outlined" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
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
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight="700" 
                    color="text.primary" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    Fun Quizzes
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Discover more about yourself with these personality quizzes
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {quizDefinitions.map((quiz) => (
                  <Grid item xs={12} sm={6} md={3} key={quiz.id}>
                    <Card
                      onClick={() => navigate(`/quizzes/${quiz.id}`)}
                      sx={{
                        height: 155,
                        background: quiz.gradient,
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                            {quiz.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                            {quiz.subtitle}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {quiz.badge}
                          </Typography>
                          <ArrowForward sx={{ fontSize: 16 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* AI Chat Component */}
        {showAIChat && (
          <AIChat
            isMinimized={isAIChatMinimized}
            onToggleMinimize={handleToggleAIChatMinimize}
            onClose={handleCloseAIChat}
          />
        )}
      </Container>
    </Box>
  );
};

export default Dashboard; 