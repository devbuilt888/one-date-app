import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  AccessTime,
  AutoAwesome,
  Bolt,
  Favorite,
  Groups2,
  LocalFireDepartment,
  LockOpen,
  RocketLaunch,
  Verified,
  Storefront,
} from '@mui/icons-material';
import { useAuth } from '../../App';

/** Edit this date to change every countdown on the page */
const LAUNCH_TARGET_ISO = '2026-07-05T23:59:00-04:00';

const getCountdownParts = (targetIso) => {
  const msLeft = new Date(targetIso).getTime() - Date.now();
  const clamped = Math.max(msLeft, 0);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, msLeft: clamped };
};

const CountdownPill = ({ label, value, large = false }) => (
  <Paper
    elevation={0}
    sx={{
      py: large ? 1.8 : 1.2,
      px: large ? 2 : 1.6,
      minWidth: large ? 96 : 76,
      textAlign: 'center',
      borderRadius: 2.5,
      border: '1px solid rgba(255,255,255,0.18)',
      bgcolor: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.2s ease, border-color 0.2s ease',
      '&:hover': { transform: 'translateY(-2px)', borderColor: 'rgba(167,139,250,0.5)' },
    }}
  >
    <Typography
      variant={large ? 'h4' : 'h5'}
      sx={{ color: '#fff', fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
    >
      {String(value).padStart(2, '0')}
    </Typography>
    <Typography
      variant="caption"
      sx={{ color: 'rgba(255,255,255,0.65)', letterSpacing: 1.2, fontWeight: 700, fontSize: '0.62rem' }}
    >
      {label}
    </Typography>
  </Paper>
);

const CountdownRow = ({ countdown, large = false }) => (
  <Stack direction="row" flexWrap="wrap" gap={1.2}>
    <CountdownPill label="DAYS" value={countdown.days} large={large} />
    <CountdownPill label="HRS" value={countdown.hours} large={large} />
    <CountdownPill label="MIN" value={countdown.minutes} large={large} />
    <CountdownPill label="SEC" value={countdown.seconds} large={large} />
  </Stack>
);

const FeatureCard = ({ icon, title, body, accent }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      height: '100%',
      borderRadius: 4,
      border: '1px solid rgba(255,255,255,0.1)',
      bgcolor: 'rgba(255,255,255,0.04)',
      transition: 'all 0.25s ease',
      '&:hover': {
        bgcolor: 'rgba(255,255,255,0.07)',
        borderColor: accent,
        transform: 'translateY(-4px)',
      },
    }}
  >
    <Avatar sx={{ bgcolor: `${accent}22`, color: accent, width: 44, height: 44, mb: 1.5 }}>{icon}</Avatar>
    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, mb: 0.75, fontSize: '1.05rem' }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>
      {body}
    </Typography>
  </Paper>
);

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const launchDate = useMemo(() => new Date(LAUNCH_TARGET_ISO), []);
  const countdown = useMemo(() => getCountdownParts(LAUNCH_TARGET_ISO), [nowTick]);

  const founderSpotsLeft = Math.max(1, Math.floor(countdown.days * 3.7 + countdown.hours * 0.4));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(900px 500px at 85% -5%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(700px 400px at 5% 15%, rgba(236,72,153,0.18), transparent 50%), radial-gradient(600px 350px at 50% 80%, rgba(34,211,238,0.1), transparent 55%), linear-gradient(180deg, #0A0B14 0%, #0F1020 40%, #12132A 100%)',
      }}
    >
      {/* Sticky nav */}
      <Box
        sx={{
          py: 1.5,
          px: { xs: 2, sm: 3.5 },
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          bgcolor: 'rgba(8, 9, 18, 0.82)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ bgcolor: 'rgba(236,72,153,0.18)', color: '#F472B6', width: 36, height: 36 }}>
              <Favorite fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="900" color="#fff" lineHeight={1.1}>
                OneDate
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                prelaunch beta
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={`${countdown.days}d ${countdown.hours}h left`}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                color: '#FDE68A',
                bgcolor: 'rgba(251,191,36,0.12)',
                border: '1px solid rgba(251,191,36,0.35)',
                fontWeight: 700,
              }}
            />
            {!isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/tour"
                  variant="text"
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.85)', display: { xs: 'none', md: 'inline-flex' }, fontWeight: 700 }}
                >
                  Tour
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Sign in
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: '#7C3AED',
                    fontWeight: 800,
                    boxShadow: '0 0 24px rgba(124,58,237,0.45)',
                    '&:hover': { bgcolor: '#6D28D9' },
                  }}
                >
                  Claim founder spot
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                size="small"
                sx={{ bgcolor: '#7C3AED', fontWeight: 800, '&:hover': { bgcolor: '#6D28D9' } }}
              >
                Dashboard
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 }, pb: 2, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip
              icon={<LocalFireDepartment sx={{ color: '#FBBF24 !important' }} />}
              label="FOUNDER DROP — 30 DAYS TO LAUNCH"
              sx={{
                mb: 2.5,
                fontWeight: 800,
                fontSize: '0.72rem',
                letterSpacing: 0.8,
                color: '#FDE68A',
                bgcolor: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.35)',
              }}
            />

            <Typography
              variant="h2"
              sx={{
                color: '#fff',
                fontWeight: 900,
                lineHeight: 1.05,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                mb: 2,
              }}
            >
              Date smarter.
              <br />
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #A78BFA, #22D3EE, #F472B6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Swipe unlimited.
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: 'rgba(255,255,255,0.78)', fontWeight: 400, lineHeight: 1.65, mb: 3, maxWidth: 540 }}
            >
              OneDate is the personality-first dating app for people who hate boring bios. Match by vibe, unlock
              seasonal events, and get in early as a founder user with{' '}
              <Box component="span" sx={{ color: '#A78BFA', fontWeight: 700 }}>
                unlimited swaps forever
              </Box>
              .
            </Typography>

            {!isAuthenticated ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunch />}
                  sx={{
                    px: 3.5,
                    py: 1.4,
                    fontWeight: 800,
                    fontSize: '1rem',
                    bgcolor: '#7C3AED',
                    boxShadow: '0 8px 32px rgba(124,58,237,0.5)',
                    '&:hover': { bgcolor: '#6D28D9', boxShadow: '0 12px 40px rgba(124,58,237,0.6)' },
                  }}
                >
                  Become a founder user
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ px: 3, color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  I have early access
                </Button>
                <Button
                  component={RouterLink}
                  to="/vendors/signup"
                  variant="text"
                  size="large"
                  sx={{ px: 2, color: '#C4B5FD', fontWeight: 700, textAlign: 'left' }}
                >
                  I'm a business wanting to sponsor a dating event
                </Button>
              </Stack>
            ) : (
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                size="large"
                startIcon={<RocketLaunch />}
                sx={{ mb: 3, px: 3.5, bgcolor: '#7C3AED', fontWeight: 800, '&:hover': { bgcolor: '#6D28D9' } }}
              >
                Go to my dashboard
              </Button>
            )}

            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Chip icon={<Verified />} label="Founder badge" size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }} variant="outlined" />
              <Chip icon={<Bolt />} label="Unlimited swipes" size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }} variant="outlined" />
              <Chip icon={<Groups2 />} label={`~${founderSpotsLeft} spots left`} size="small" sx={{ color: '#FDE68A', borderColor: 'rgba(251,191,36,0.4)' }} variant="outlined" />
            </Stack>
          </Grid>

          {/* Hero countdown card — phone-app style */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 5,
                border: '1px solid rgba(255,255,255,0.12)',
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)',
                },
              }}
            >
              <Typography variant="overline" sx={{ color: '#A78BFA', letterSpacing: 2, fontWeight: 800 }}>
                LAUNCH COUNTDOWN
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2.5 }}>
                Founder perks lock in when this hits zero
              </Typography>

              <CountdownRow countdown={countdown} large />

              <Box
                sx={{
                  mt: 2.5,
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.35)',
                }}
              >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', display: 'block', mb: 0.5 }}>
                  Final countdown moment
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>
                  {launchDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {' · '}
                  {launchDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Dual countdown strip */}
      <Box sx={{ py: 3, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)', height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AccessTime sx={{ color: '#A78BFA', fontSize: 18 }} />
                  <Typography variant="overline" sx={{ color: '#C4B5FD', fontWeight: 800, letterSpacing: 1 }}>
                    FOUNDERS CLOCK
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                  {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                  Until unlimited swaps unlock for founder users
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)', height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <LockOpen sx={{ color: '#22D3EE', fontSize: 18 }} />
                  <Typography variant="overline" sx={{ color: '#67E8F9', fontWeight: 800, letterSpacing: 1 }}>
                    SEASON DROP
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                  {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                  Until the first event door opens for matching
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)', height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AutoAwesome sx={{ color: '#F472B6', fontSize: 18 }} />
                  <Typography variant="overline" sx={{ color: '#F9A8D4', fontWeight: 800, letterSpacing: 1 }}>
                    EARLY ACCESS
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                  {countdown.days} days · {countdown.hours} hrs
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                  Left to join before public launch pricing kicks in
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          sx={{ color: '#fff', fontWeight: 900, textAlign: 'center', mb: 1, fontSize: { xs: '1.6rem', md: '2rem' } }}
        >
          Not another swipe app.
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center', mb: 4, maxWidth: 520, mx: 'auto' }}
        >
          Built for Gen Z energy — real personality, real events, zero cringe.
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<AutoAwesome />}
              title="Quiz your vibe"
              body="Fun personality quizzes reveal who you actually are — and who you're compatible with."
              accent="#A78BFA"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<LockOpen />}
              title="Seasonal doors"
              body="Timed event drops unlock matching waves. FOMO, but make it romantic."
              accent="#22D3EE"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<Groups2 />}
              title="Real micro-events"
              body="Coffee runs, rooftop hangs, game nights — meet IRL through curated moments."
              accent="#F472B6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<Bolt />}
              title="Unlimited swaps"
              body="Founder users never hit a swipe wall. Ever. That's the whole point of getting in early."
              accent="#FBBF24"
            />
          </Grid>
        </Grid>
      </Container>

      {/* Founder CTA block with live countdown */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(236,72,153,0.12) 50%, rgba(34,211,238,0.08) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
          <Chip
            label="LIMITED FOUNDER TIER"
            sx={{ mb: 2, color: '#FDE68A', bgcolor: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', fontWeight: 800 }}
          />
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, mb: 1.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Your unlimited-swipe era starts in
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CountdownRow countdown={countdown} large />
          </Box>

          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
            Join before{' '}
            <Box component="span" sx={{ color: '#A78BFA', fontWeight: 700 }}>
              {launchDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </Box>{' '}
            to lock founder status: unlimited swaps, priority matching, and a permanent badge on your profile.
          </Typography>

          {!isAuthenticated && (
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              startIcon={<RocketLaunch />}
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 900,
                fontSize: '1.05rem',
                bgcolor: '#fff',
                color: '#6D28D9',
                boxShadow: '0 8px 40px rgba(255,255,255,0.15)',
                '&:hover': { bgcolor: '#F3F4F6' },
              }}
            >
              Claim my founder spot — it's free
            </Button>
          )}
        </Container>
      </Box>

      {/* Business / vendor CTA */}
      <Container maxWidth="md" sx={{ pb: 6, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
            bgcolor: 'rgba(255,255,255,0.04)',
            textAlign: 'center',
          }}
        >
          <Storefront sx={{ color: '#A78BFA', fontSize: 36, mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
            Are you a business or venue?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, maxWidth: 480, mx: 'auto' }}>
            Register a sponsored event and get in front of OneDate users during your live campaign window.
          </Typography>
          <Button
            component={RouterLink}
            to="/vendors/signup"
            variant="outlined"
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)', fontWeight: 700, px: 3 }}
          >
            I'm a business wanting to sponsor a dating event
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>
          OneDate · Prelaunch beta · Countdown target: {LAUNCH_TARGET_ISO}
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
