import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../App';
import { personalEventApplications, profiles as profilesApi } from '../../lib/supabase';
import {
  dismissPersonalEvent,
  getEventDisplayTitle,
  getPersonalEventById,
  isPersistedPersonalEvent,
  isUuid,
  labelForEventType,
} from '../../lib/personalEvents';
import {
  buildPickerProfiles,
  hostProfileFromEvent,
  profileFromDbRow,
} from '../../lib/personalEventProfiles';
import PersonalEventProfilePicker from './PersonalEventProfilePicker';

function formatApplyError(applyError) {
  if (!applyError) return 'Could not submit your application.';
  const message = applyError.message || '';

  if (applyError.code === '23503') {
    return 'This event is not in the database yet. Ask the host to repost it, or try again in a moment.';
  }

  if (applyError.code === '22P02' || /invalid input syntax for type uuid/i.test(message)) {
    return 'This is a sample event and cannot receive real applications. Look for an event posted by another member.';
  }

  return message || 'Could not submit your application.';
}

const PersonalEventApplyPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = useMemo(() => getPersonalEventById(eventId), [eventId]);

  const [loading, setLoading] = useState(true);
  const [pickerProfiles, setPickerProfiles] = useState([]);
  const [targetHostId, setTargetHostId] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!event || !user?.id) {
      setLoading(false);
      return;
    }

    if (event.hostUserId === user.id) {
      setError('You cannot apply to your own event.');
      setLoading(false);
      return;
    }

    if (!isPersistedPersonalEvent(event)) {
      setError('This is a sample event and cannot receive applications. Look for an event posted by another member.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError('');
      const { applied } = await personalEventApplications.hasApplied(event.id);
      if (cancelled) return;

      if (applied) {
        setAlreadyApplied(true);
        setLoading(false);
        return;
      }

      let hostProfile = hostProfileFromEvent(event);
      if (isUuid(event.hostUserId)) {
        const { data: hostRow } = await profilesApi.getById(event.hostUserId);
        if (hostRow) {
          hostProfile = {
            ...profileFromDbRow(hostRow),
            id: event.hostUserId,
            isHost: true,
          };
        }
      }

      hostProfile.id = event.hostUserId;
      setTargetHostId(event.hostUserId);
      setPickerProfiles(
        buildPickerProfiles([hostProfile], 2, [user.id, event.hostUserId])
      );
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [event, user?.id]);

  const handleSelect = async (profile) => {
    if (submitting || alreadyApplied) return;

    if (profile.id !== targetHostId) {
      dismissPersonalEvent(user.id, event.id);
      navigate('/dashboard');
      return;
    }

    setSubmitting(true);
    setError('');
    const { error: applyError } = await personalEventApplications.apply(event.id);
    setSubmitting(false);

    if (applyError) {
      if (applyError.code === '23505') {
        setAlreadyApplied(true);
        setFinished(true);
        setFeedback({
          severity: 'success',
          message: 'You already applied to this event. The host will pick from the mystery lineup.',
        });
        return;
      }
      setError(formatApplyError(applyError));
      return;
    }

    setAlreadyApplied(true);
    setFinished(true);
    setFeedback({
      severity: 'success',
      message: 'Application sent! The host will see you mixed in with decoys and pick who they want to take.',
    });
  };

  if (!event) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Event not found.</Typography>
        <Button onClick={() => navigate('/dashboard')}>Back</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="md" sx={{ px: 2, pt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} size="small" aria-label="Back">
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            Apply to join
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {labelForEventType(event.eventType)}
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.35 }}>
            {getEventDisplayTitle(event)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Hosted by {event.hostName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {event.approximateLocation} · {new Date(event.datetime).toLocaleString()}
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {feedback && (
          <Alert severity={feedback.severity} sx={{ mb: 2 }}>
            {feedback.message}
          </Alert>
        )}

        {finished ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography fontWeight={700}>You&apos;re in the mix</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {feedback?.message}
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
              Back to home
            </Button>
          </Paper>
        ) : loading ? (
          <Typography textAlign="center" color="text.secondary">
            Loading mystery lineup…
          </Typography>
        ) : alreadyApplied ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography fontWeight={700}>You already applied</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The host will choose from a shuffled lineup that includes you.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
              Back to home
            </Button>
          </Paper>
        ) : (
          <PersonalEventProfilePicker
            title="Who do you want to go on this date with?"
            subtitle="One of these three is the real event host. Pick the person you'd actually want to join."
            profiles={pickerProfiles}
            onSelect={handleSelect}
            disabled={submitting}
          />
        )}
      </Container>
    </Box>
  );
};

export default PersonalEventApplyPage;
