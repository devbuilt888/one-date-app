import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Add, Place, Schedule, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  PERSONAL_EVENT_TYPES,
  addPersonalEvent,
  consumeMonthlyEventTicket,
  ensureDemoPersonalEvents,
  getEventDisplayTitle,
  hasMonthlyEventTicket,
  labelForEventType,
  readPersonalEvents,
} from '../../lib/personalEvents';

const typeChipSx = {
  mb: 0.75,
  fontWeight: 600,
  bgcolor: 'grey.900',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.2)',
  '& .MuiChip-label': { color: '#ffffff' },
};

const selectFormSx = {
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.85)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'rgba(255,255,255,0.95)',
  },
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    bgcolor: 'secondary.main',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.35)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.55)' },
    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
  },
  '& .MuiSvgIcon-root': { color: '#ffffff' },
};

const eventBody = (ev) => (
  <>
    <Chip size="small" label={labelForEventType(ev.eventType)} sx={typeChipSx} />
    <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.3 }}>
      {getEventDisplayTitle(ev)}
    </Typography>
    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
      {ev.hostName}
    </Typography>
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
      <Place sx={{ fontSize: 16, color: 'text.secondary' }} />
      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
        {ev.approximateLocation}
      </Typography>
    </Stack>
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
      <Typography variant="caption" color="text.secondary">
        {new Date(ev.datetime).toLocaleString()}
      </Typography>
    </Stack>
    <Typography
      variant="body2"
      color="text.primary"
      sx={{
        mt: 1,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {ev.description}
    </Typography>
  </>
);

const EventCard = ({ ev, showApply, onApply }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 2,
      borderColor: 'grey.200',
      transition: 'box-shadow 0.2s',
      overflow: 'hidden',
      '&:hover': { boxShadow: 2 },
    }}
  >
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        p: 0,
        '&:last-child': { pb: 0 },
      }}
    >
      <Box
        sx={{
          flex: '1 1 70%',
          minWidth: 0,
          py: 1.5,
          pl: 1.5,
          pr: 1,
        }}
      >
        {eventBody(ev)}
      </Box>
      {showApply ? (
        <Box
          onClick={() => onApply(ev.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onApply(ev.id);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Apply to this event"
          sx={{
            flex: '0 0 30%',
            maxWidth: '30%',
            minHeight: 112,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'rgba(15, 23, 42, 0.02)',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.1)',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'secondary.main',
              outlineOffset: -2,
            },
          }}
        >
          <ChevronRight sx={{ color: 'secondary.main', fontSize: 36, opacity: 0.9 }} />
        </Box>
      ) : (
        <Box
          sx={{
            flex: '0 0 30%',
            maxWidth: '30%',
            minHeight: 112,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'rgba(15, 23, 42, 0.02)',
          }}
        >
          <Chip label="Your post" size="small" sx={{ fontWeight: 600 }} color="primary" variant="outlined" />
        </Box>
      )}
    </CardContent>
  </Card>
);

const PersonalEventsSection = ({ userId, displayName }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(() => readPersonalEvents());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    approximateLocation: '',
    eventType: 'restaurant',
    description: '',
    datetime: '',
  });

  const hasTicket = useMemo(() => hasMonthlyEventTicket(userId), [userId]);

  const refresh = useCallback(() => {
    ensureDemoPersonalEvents();
    setEvents(readPersonalEvents());
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const myEvents = useMemo(
    () => events.filter((e) => e.hostUserId && userId && e.hostUserId === userId),
    [events, userId]
  );

  const othersEvents = useMemo(
    () => events.filter((e) => e.hostUserId && e.hostUserId !== userId),
    [events, userId]
  );

  const handleCreate = () => {
    if (!hasTicket || !userId) return;
    if (!form.title.trim() || !form.approximateLocation.trim() || !form.description.trim() || !form.datetime) return;
    addPersonalEvent({
      hostUserId: userId,
      hostName: displayName || 'You',
      title: form.title.trim(),
      approximateLocation: form.approximateLocation.trim(),
      eventType: form.eventType,
      description: form.description.trim(),
      datetime: new Date(form.datetime).toISOString(),
    });
    consumeMonthlyEventTicket(userId);
    setOpen(false);
    setForm({
      title: '',
      approximateLocation: '',
      eventType: 'restaurant',
      description: '',
      datetime: '',
    });
    refresh();
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          border: '1px solid',
          borderColor: 'grey.200',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="700"
          color="text.primary"
          sx={{ mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          Personal events
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
          You get <strong>one event creation ticket per month</strong>. Post a date idea with a rough area and time —
          others can browse and apply (swipe) to join.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Tooltip
            title={
              hasTicket
                ? 'Create a personal event'
                : 'You have already used your monthly event ticket'
            }
          >
            <span>
              <IconButton
                onClick={() => hasTicket && setOpen(true)}
                disabled={!hasTicket || !userId}
                sx={{
                  width: 72,
                  height: 72,
                  border: '2px dashed',
                  borderColor: hasTicket ? 'secondary.main' : 'grey.300',
                  bgcolor: hasTicket ? 'rgba(99, 102, 241, 0.08)' : 'grey.50',
                  color: hasTicket ? 'secondary.main' : 'grey.400',
                  '&:hover': {
                    bgcolor: hasTicket ? 'rgba(99, 102, 241, 0.15)' : 'grey.50',
                  },
                }}
                aria-label="Create personal event"
              >
                <Add sx={{ fontSize: 40 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {hasTicket ? 'Ticket available' : 'No tickets left this month'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Resets monthly · {hasTicket ? 'Tap + to post' : 'Come back next month'}
            </Typography>
          </Box>
        </Box>

        {myEvents.length > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: 'text.secondary' }}>
              Your posts
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {myEvents.map((ev) => (
                <EventCard key={ev.id} ev={ev} showApply={false} onApply={() => {}} />
              ))}
            </Stack>
          </>
        )}

        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: 'text.secondary' }}>
          From the community
        </Typography>

        {othersEvents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No events yet. Be the first to post, or check back soon.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {othersEvents.map((ev) => (
              <EventCard
                key={ev.id}
                ev={ev}
                showApply
                onApply={(id) => navigate(`/personal-events/${id}/apply`)}
              />
            ))}
          </Stack>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create personal event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              placeholder="e.g. Coffee walk in the arts district"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Approximate location"
              placeholder="e.g. Midtown, within 15 min drive"
              value={form.approximateLocation}
              onChange={(e) => setForm((f) => ({ ...f, approximateLocation: e.target.value }))}
              fullWidth
              required
            />
            <FormControl fullWidth required sx={selectFormSx}>
              <InputLabel id="pe-type">Type of date</InputLabel>
              <Select
                labelId="pe-type"
                label="Type of date"
                value={form.eventType}
                onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 320 } },
                }}
              >
                {PERSONAL_EVENT_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              placeholder="What should people expect?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
              required
            />
            <TextField
              label="Date & time"
              type="datetime-local"
              value={form.datetime}
              onChange={(e) => setForm((f) => ({ ...f, datetime: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              !form.title.trim() ||
              !form.approximateLocation.trim() ||
              !form.description.trim() ||
              !form.datetime ||
              !hasTicket
            }
          >
            Post event
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PersonalEventsSection;
