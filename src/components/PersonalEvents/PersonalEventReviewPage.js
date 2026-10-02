import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { personalEventApplications } from '../../lib/supabase';
import {
  getEventDisplayTitle,
  getPersonalEventById,
  labelForEventType,
} from '../../lib/personalEvents';
import {
  buildPickerProfiles,
  profileFromDbRow,
} from '../../lib/personalEventProfiles';
import PersonalEventProfilePicker from './PersonalEventProfilePicker';

const PersonalEventReviewPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = useMemo(() => getPersonalEventById(eventId), [eventId]);

  const [loading, setLoading] = useState(true);
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [targetApplicantId, setTargetApplicantId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const setupRound = useCallback((applications) => {
    if (!applications.length) {
      setProfiles([]);
      setTargetApplicantId(null);
      return;
    }

    const featured = applications[Math.floor(Math.random() * applications.length)];
    const applicantProfile = profileFromDbRow(featured.applicant);
    setTargetApplicantId(applicantProfile.id);
    setProfiles(
      buildPickerProfiles([applicantProfile], 2, [user?.id, applicantProfile.id])
    );
  }, [user?.id]);

  useEffect(() => {
    if (!event || !user?.id) {
      setLoading(false);
      return;
    }

    if (event.hostUserId !== user.id) {
      setError('Only the event host can review applications.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const { data, error: loadError } = await personalEventApplications.getPendingForEvent(event.id);
      if (cancelled) return;

      if (loadError) {
        setError(loadError.message || 'Could not load applications.');
        setLoading(false);
        return;
      }

      setPendingApplicants(data || []);
      setupRound(data || []);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [event, user?.id, setupRound]);

  const handleSelect = async (profile) => {
    if (submitting || !targetApplicantId) return;

    if (profile.id !== targetApplicantId) {
      setResult({
        success: false,
        message: 'Wrong pick — that person did not apply (or was a decoy). Shuffle and try again.',
      });
      setupRound(pendingApplicants);
      return;
    }

    setSubmitting(true);
    setError('');
    const { error: matchError } = await personalEventApplications.matchApplicant(
      event.id,
      targetApplicantId,
      user.id
    );
    setSubmitting(false);

    if (matchError) {
      setError(matchError.message || 'Could not create match.');
      return;
    }

    const remaining = pendingApplicants.filter((row) => row.applicant_user_id !== targetApplicantId);
    setPendingApplicants(remaining);
    setResult({
      success: true,
      message: remaining.length
        ? `Matched with ${profile.displayName}! ${remaining.length} more applicant${remaining.length === 1 ? '' : 's'} waiting.`
        : `Matched with ${profile.displayName}! You're all set for this event.`,
    });

    if (remaining.length) {
      setupRound(remaining);
    } else {
      setProfiles([]);
    }
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
            Review applications
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {labelForEventType(event.eventType)}
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
            {getEventDisplayTitle(event)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {pendingApplicants.length} pending applicant{pendingApplicants.length === 1 ? '' : 's'}
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Typography textAlign="center" color="text.secondary">
            Loading applications…
          </Typography>
        ) : pendingApplicants.length === 0 && !result ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography fontWeight={700}>No applications yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              When someone applies, they&apos;ll be hidden among decoys for you to find.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
              Back to home
            </Button>
          </Paper>
        ) : (
          <>
            {result && (
              <Alert
                severity={result.success ? 'success' : 'warning'}
                sx={{ mb: 2 }}
                action={
                  result.success && pendingApplicants.length === 0 ? (
                    <Button color="inherit" size="small" onClick={() => navigate('/chats')}>
                      Open chats
                    </Button>
                  ) : null
                }
              >
                {result.message}
              </Alert>
            )}

            {profiles.length > 0 && (
              <PersonalEventProfilePicker
                title="Who do you want to take on this date?"
                subtitle="One of these three actually applied. The other two are decoys — choose carefully."
                profiles={profiles}
                onSelect={handleSelect}
                disabled={submitting}
              />
            )}

            {profiles.length > 0 && (
              <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Button
                  variant="text"
                  onClick={() => {
                    setResult(null);
                    setupRound(pendingApplicants);
                  }}
                  disabled={submitting}
                >
                  Shuffle lineup
                </Button>
              </Stack>
            )}

            {result?.success && pendingApplicants.length === 0 && (
              <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={() => navigate('/dashboard')}>
                  Back to home
                </Button>
              </Stack>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default PersonalEventReviewPage;
