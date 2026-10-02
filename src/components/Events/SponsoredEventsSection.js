import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { LocationOn, Schedule, Storefront } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { vendorSponsoredEvents } from '../../lib/supabase';

const SponsoredEventCard = ({ event, compact = false }) => {
  const startsAt = new Date(event.event_starts_at);
  const dateStr = startsAt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = startsAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <Paper
      elevation={0}
      sx={{
        p: compact ? 2 : 2.5,
        height: '100%',
        borderRadius: 3,
        border: '1px solid rgba(124,58,237,0.25)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(236,72,153,0.06) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          px: 1,
          py: 0.25,
          borderRadius: 1,
          fontSize: '0.7rem',
          fontWeight: 800,
          bgcolor: '#7C3AED',
          color: '#fff',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        Sponsored
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: 'rgba(124,58,237,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Storefront sx={{ color: '#7C3AED' }} />
        </Box>
        <Box sx={{ minWidth: 0, pr: 6 }}>
          <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 800, letterSpacing: 0.5 }}>
            {event.business_name}
          </Typography>
          <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }} noWrap>
            {event.title}
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5,
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: compact ? 2 : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {event.description}
      </Typography>

      <Stack spacing={0.75}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {dateStr} · {timeStr}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {event.location}
          </Typography>
        </Stack>
      </Stack>

      {event.business_website && (
        <Button
          component="a"
          href={event.business_website}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{ mt: 1.5, fontWeight: 700 }}
        >
          Visit sponsor
        </Button>
      )}
    </Paper>
  );
};

const SponsoredEventsSection = ({ compact = false, showVendorLink = false, events: presetEvents = null }) => {
  const [events, setEvents] = useState(presetEvents || []);
  const [loaded, setLoaded] = useState(Boolean(presetEvents));

  useEffect(() => {
    if (presetEvents) return;
    let cancelled = false;

    const load = async () => {
      const { data, error } = await vendorSponsoredEvents.getActive();
      if (cancelled) return;
      if (!error && data?.length) {
        setEvents(data);
      }
      setLoaded(true);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [presetEvents]);

  if (!loaded || events.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: compact ? 2 : { xs: 2.5, sm: 3 },
        mb: 3,
        borderRadius: 3,
        border: '1px solid rgba(124,58,237,0.2)',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              mb: 1,
              px: 1.25,
              py: 0.35,
              borderRadius: 1,
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: 0.6,
              bgcolor: '#EEF2FF',
              color: '#6D28D9',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            LIVE SPONSOR DROP
          </Box>
          <Typography variant={compact ? 'h6' : 'h5'} fontWeight={800}>
            Vendor sponsored events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Partner-hosted experiences running right now on OneDate
          </Typography>
        </Box>
        {showVendorLink && (
          <Button component={RouterLink} to="/vendors/signup" variant="outlined" size="small">
            Become a sponsor
          </Button>
        )}
      </Stack>

      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={compact ? 12 : 4} key={event.id}>
            <SponsoredEventCard event={event} compact={compact} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SponsoredEventsSection;
