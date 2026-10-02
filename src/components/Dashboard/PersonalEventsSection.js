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
  Badge,
} from '@mui/material';
import { Add, ChevronLeft, ChevronRight, NotificationsActive, Place, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { personalEventsDb, personalEventApplications } from '../../lib/supabase';
import {
  PERSONAL_EVENT_TYPES,
  addPersonalEvent,
  consumeMonthlyEventTicket,
  getEventDisplayTitle,
  hasMonthlyEventTicket,
  isPersistedPersonalEvent,
  labelForEventType,
  mapDbPersonalEvent,
  readDismissedPersonalEventIds,
  readPersonalEvents,
  writePersonalEvents,
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

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pad2(value) {
  return String(value).padStart(2, '0');
}

function toDateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? '00' : '30';
  const key = `${pad2(hours)}:${minutes}`;
  const labelDate = new Date(2000, 0, 1, hours, Number(minutes));
  return {
    value: key,
    label: labelDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
  };
});

const EventBookingCalendar = ({ value, onChange, readOnly = false }) => {
  const selectedDate = value ? value.slice(0, 10) : '';
  const selectedTime = value?.includes('T') ? value.slice(11, 16) : '19:00';
  const [visibleMonth, setVisibleMonth] = useState(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split('-').map(Number);
      return new Date(year, month - 1, 1);
    }
    return startOfMonth(new Date());
  });

  const todayKey = toDateKey(new Date());
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const chooseDate = (day) => {
    const key = toDateKey(new Date(year, month, day));
    if (key < todayKey) return;
    onChange(`${key}T${selectedTime || '19:00'}`);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Pick a date
      </Typography>
      <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, p: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <IconButton
            size="small"
            aria-label="Previous month"
            onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
          >
            <ChevronLeft />
          </IconButton>
          <Typography fontWeight={700}>
            {MONTHS[month]} {year}
          </Typography>
          <IconButton
            size="small"
            aria-label="Next month"
            onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
          >
            <ChevronRight />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 0.5,
          }}
        >
          {WEEKDAYS.map((label) => (
            <Typography
              key={label}
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ fontWeight: 700, py: 0.5 }}
            >
              {label}
            </Typography>
          ))}
          {cells.map((day, index) => {
            if (!day) {
              return <Box key={`empty-${index}`} sx={{ height: 36 }} />;
            }
            const key = toDateKey(new Date(year, month, day));
            const isPast = key < todayKey;
            const selected = key === selectedDate;
            return (
              <Button
                key={key}
                disabled={readOnly || isPast}
                onClick={() => chooseDate(day)}
                sx={{
                  minWidth: 0,
                  height: 36,
                  p: 0,
                  borderRadius: 1,
                  fontWeight: selected ? 800 : 500,
                  color: selected ? '#fff' : 'text.primary',
                  bgcolor: selected ? 'secondary.main' : 'transparent',
                  border: key === todayKey && !selected ? '1px solid' : '1px solid transparent',
                  borderColor: 'secondary.main',
                  '&:hover': {
                    bgcolor: selected ? 'secondary.dark' : 'rgba(99, 102, 241, 0.12)',
                  },
                }}
              >
                {day}
              </Button>
            );
          })}
        </Box>
      </Box>
      <FormControl fullWidth sx={{ mt: 2 }} disabled={readOnly || !selectedDate}>
        <InputLabel id="pe-time">Time</InputLabel>
        <Select
          labelId="pe-time"
          label="Time"
          value={selectedDate ? selectedTime : ''}
          onChange={(e) => onChange(`${selectedDate}T${e.target.value}`)}
        >
          {TIME_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        {selectedDate
          ? `Selected ${new Date(
              Number(selectedDate.slice(0, 4)),
              Number(selectedDate.slice(5, 7)) - 1,
              Number(selectedDate.slice(8, 10)),
              Number(selectedTime.slice(0, 2)),
              Number(selectedTime.slice(3, 5))
            ).toLocaleString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}`
          : 'Choose a date on the calendar, then a time.'}
      </Typography>
    </Box>
  );
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

const sidePanelSx = {
  flex: '0 0 30%',
  maxWidth: '30%',
  minHeight: 112,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.75,
  borderLeft: '1px solid',
  borderColor: 'grey.200',
  bgcolor: 'rgba(15, 23, 42, 0.02)',
  p: 1,
};

const EventCard = ({ ev, isOwnPost = false, applicationCount = 0, onApply, onReview }) => {
  const hasApplicants = applicationCount > 0;

  const renderSidePanel = () => {
    if (isOwnPost) {
      if (hasApplicants) {
        return (
          <Tooltip title={`${applicationCount} applicant${applicationCount === 1 ? '' : 's'} — review picks`}>
            <Box
              onClick={() => onReview(ev.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onReview(ev.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Review ${applicationCount} applicant${applicationCount === 1 ? '' : 's'}`}
              sx={{
                ...sidePanelSx,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'secondary.main',
                  outlineOffset: -2,
                },
              }}
            >
              <Badge badgeContent={applicationCount} color="secondary">
                <NotificationsActive sx={{ fontSize: 32, color: 'secondary.main' }} />
              </Badge>
              <Typography variant="caption" fontWeight={700} color="secondary.main">
                Review picks
              </Typography>
            </Box>
          </Tooltip>
        );
      }

      return (
        <Box sx={{ ...sidePanelSx, pointerEvents: 'none', userSelect: 'none' }}>
          <Chip
            component="span"
            label="Your post"
            size="small"
            sx={{ fontWeight: 600 }}
            color="primary"
            variant="outlined"
          />
        </Box>
      );
    }

    return (
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
          ...sidePanelSx,
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'secondary.main',
            outlineOffset: -2,
          },
        }}
      >
        <ChevronRight sx={{ color: 'secondary.main', fontSize: 36, opacity: 0.9 }} />
      </Box>
    );
  };

  return (
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
      {renderSidePanel()}
    </CardContent>
  </Card>
  );
};

const PersonalEventsSection = ({ userId, displayName, previewComposer = false }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(() => readPersonalEvents());
  const [applicationCounts, setApplicationCounts] = useState({});
  const [open, setOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(() => readDismissedPersonalEventIds(userId));
  const [form, setForm] = useState({
    title: previewComposer ? 'Coffee at a new coffee shop' : '',
    approximateLocation: previewComposer ? 'Uptown' : '',
    eventType: 'restaurant',
    description: previewComposer ? 'Looking for someone who likes trying new spots.' : '',
    datetime: previewComposer ? '2026-06-20T15:56' : '',
  });

  const hasTicket = useMemo(() => hasMonthlyEventTicket(userId), [userId]);

  const refresh = useCallback(async () => {
    const { data, error } = await personalEventsDb.getAll();
    if (error || !data?.length) {
      const persistedOnly = readPersonalEvents().filter(isPersistedPersonalEvent);
      writePersonalEvents(persistedOnly);
      setEvents(persistedOnly);
    } else {
      const mapped = data.map(mapDbPersonalEvent);
      writePersonalEvents(mapped);
      setEvents(mapped);
    }

    if (userId) {
      const { data: counts } = await personalEventApplications.getPendingCountsForHost(userId);
      setApplicationCounts(counts || {});
    }
  }, [userId]);

  React.useEffect(() => {
    setDismissedIds(readDismissedPersonalEventIds(userId));
    refresh();
  }, [refresh, userId]);

  const myEvents = useMemo(
    () => events.filter((e) => e.hostUserId && userId && e.hostUserId === userId),
    [events, userId]
  );

  const othersEvents = useMemo(
    () => events.filter(
      (e) => e.hostUserId
        && e.hostUserId !== userId
        && isPersistedPersonalEvent(e)
        && !dismissedIds.includes(e.id)
    ),
    [events, userId, dismissedIds]
  );

  const handleCreate = async () => {
    if (!hasTicket || !userId) return;
    if (!form.title.trim() || !form.approximateLocation.trim() || !form.description.trim() || !form.datetime) return;

    await addPersonalEvent({
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
    await refresh();
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
          You get <strong>one event creation ticket per month</strong>. Post a date idea — applicants pick you from
          a mystery lineup of three profiles, and you&apos;ll review applicants the same way.
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
                <EventCard
                  key={ev.id}
                  ev={ev}
                  isOwnPost
                  applicationCount={applicationCounts[ev.id] || 0}
                  onReview={(id) => navigate(`/personal-events/${id}/review`)}
                />
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
                onApply={(id) => navigate(`/personal-events/${id}/apply`)}
              />
            ))}
          </Stack>
        )}
      </Paper>

      {previewComposer && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mt: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Create personal event
          </Typography>
          <Stack spacing={2}>
            <TextField label="Title" value={form.title} disabled fullWidth />
            <TextField label="Approximate location" value={form.approximateLocation} disabled fullWidth />
            <FormControl fullWidth disabled sx={selectFormSx}>
              <InputLabel id="pe-type-preview">Type of date</InputLabel>
              <Select labelId="pe-type-preview" label="Type of date" value={form.eventType}>
                {PERSONAL_EVENT_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Description" value={form.description} disabled fullWidth multiline minRows={3} />
            <EventBookingCalendar value={form.datetime} onChange={() => {}} readOnly />
          </Stack>
        </Paper>
      )}

      <Dialog open={open && !previewComposer} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
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
            <EventBookingCalendar
              value={form.datetime}
              onChange={(datetime) => setForm((f) => ({ ...f, datetime }))}
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
