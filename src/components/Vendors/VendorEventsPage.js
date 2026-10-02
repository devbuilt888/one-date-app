import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack, Favorite, RocketLaunch, Storefront } from '@mui/icons-material';
import { useAuth } from '../../App';
import { profiles, vendorSponsoredEvents } from '../../lib/supabase';

const CATEGORIES = ['Dating', 'Social', 'Activity', 'Cultural', 'Outdoor'];

const VendorEventsPage = ({ preview = false }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(preview ? {
    business_name: 'Cafe Lumen',
    business_address: '120 Uptown Ave',
  } : null);
  const [profileLoading, setProfileLoading] = useState(!preview);
  const [businessForm, setBusinessForm] = useState({ businessName: '', businessAddress: '' });
  const [myEvents, setMyEvents] = useState(preview ? [{
    id: 'preview-event',
    title: 'Sunset mixer on the patio',
    status: 'pending',
    created_at: '2026-06-01T18:00:00.000Z',
  }] : []);
  const [form, setForm] = useState({
    title: preview ? 'Sunset mixer on the patio' : '',
    description: preview ? 'A small dating social with coffee and live acoustic music.' : '',
    location: preview ? '120 Uptown Ave' : '',
    category: 'Social',
    imageUrl: '',
    eventStartsAt: preview ? '2026-07-12T18:00' : '',
    eventEndsAt: preview ? '2026-07-12T21:00' : '',
    proposedActiveFrom: '',
    proposedActiveUntil: '',
    contactPhone: '',
    businessWebsite: preview ? 'https://cafelumen.example' : '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hasBusinessProfile = useMemo(
    () => Boolean(profile?.business_name?.trim() && profile?.business_address?.trim()),
    [profile]
  );

  useEffect(() => {
    if (preview || !isAuthenticated || !user?.id) {
      setProfileLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const [{ data: profileData }, { data: eventsData }] = await Promise.all([
        profiles.getById(user.id),
        vendorSponsoredEvents.getMine(),
      ]);

      if (cancelled) return;

      setProfile(profileData);
      setBusinessForm({
        businessName: profileData?.business_name || '',
        businessAddress: profileData?.business_address || '',
      });
      setForm((prev) => ({
        ...prev,
        location: profileData?.business_address || prev.location,
      }));
      setMyEvents(eventsData || []);
      setProfileLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [preview, isAuthenticated, user?.id]);

  if (!isAuthenticated && !preview) {
    return <Navigate to="/vendors/signup" replace />;
  }

  if (profileLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#0F1020', color: '#fff' }}>
        Loading…
      </Box>
    );
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const toIsoOrNull = (value) => (value ? new Date(value).toISOString() : null);

  const handleSaveBusinessProfile = async (event) => {
    event.preventDefault();
    setError('');
    setSavingProfile(true);

    try {
      if (!businessForm.businessName.trim() || !businessForm.businessAddress.trim()) {
        throw new Error('Business name and address are required');
      }

      const { data, error: saveError } = await profiles.upsert({
        id: user.id,
        is_business: true,
        business_name: businessForm.businessName.trim(),
        business_address: businessForm.businessAddress.trim(),
        display_name: profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0],
      });

      if (saveError) throw saveError;
      setProfile(data?.[0] || { ...profile, ...businessForm });
      setSuccess('Business profile saved. You can now create a sponsored event.');
    } catch (err) {
      setError(err.message || 'Could not save business profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitEvent = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (!hasBusinessProfile) {
        throw new Error('Complete your business profile before creating an event');
      }

      const { data, error: submitError } = await vendorSponsoredEvents.submitApplication({
        businessName: profile.business_name,
        contactName: profile.display_name || user.user_metadata?.display_name || 'Business contact',
        contactEmail: user.email,
        contactPhone: form.contactPhone.trim() || null,
        businessWebsite: form.businessWebsite.trim() || null,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim() || null,
        eventStartsAt: toIsoOrNull(form.eventStartsAt),
        eventEndsAt: toIsoOrNull(form.eventEndsAt),
        proposedActiveFrom: toIsoOrNull(form.proposedActiveFrom),
        proposedActiveUntil: toIsoOrNull(form.proposedActiveUntil),
        submittedByUserId: user.id,
      });

      if (submitError) throw submitError;

      setMyEvents((prev) => [data, ...prev]);
      setSuccess('Sponsored event submitted for review.');
      setForm((prev) => ({
        ...prev,
        title: '',
        description: '',
        imageUrl: '',
        eventStartsAt: '',
        eventEndsAt: '',
        proposedActiveFrom: '',
        proposedActiveUntil: '',
        contactPhone: '',
        businessWebsite: '',
      }));
    } catch (err) {
      setError(err.message || 'Could not submit event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 6,
        background:
          'radial-gradient(900px 500px at 85% -5%, rgba(139,92,246,0.35), transparent 55%), linear-gradient(180deg, #0A0B14 0%, #12132A 100%)',
      }}
    >
      <Box sx={{ py: 2, px: { xs: 2, sm: 3 }, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="md">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Avatar sx={{ bgcolor: 'rgba(236,72,153,0.18)', color: '#F472B6', width: 36, height: 36 }}>
                <Favorite fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={900} color="#fff">
                  Sponsor a dating event
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                  Business portal
                </Typography>
              </Box>
            </Stack>
            <Button component={RouterLink} to="/landing" startIcon={<ArrowBack />} sx={{ color: 'rgba(255,255,255,0.75)' }}>
              Back
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {!hasBusinessProfile ? (
          <Paper
            component="form"
            onSubmit={handleSaveBusinessProfile}
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 3,
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.12)',
              bgcolor: 'rgba(255,255,255,0.05)',
            }}
          >
            <Chip icon={<Storefront />} label="STEP 1 — BUSINESS PROFILE" sx={{ mb: 2, color: '#C4B5FD', borderColor: 'rgba(124,58,237,0.35)' }} variant="outlined" />
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
              Add your business details first
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', mb: 2 }}>
              You need a business name and address on file before you can create a sponsored event.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                label="Business name"
                value={businessForm.businessName}
                onChange={(e) => setBusinessForm((p) => ({ ...p, businessName: e.target.value }))}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.6)' } }}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              />
              <TextField
                required
                fullWidth
                multiline
                rows={2}
                label="Business address"
                value={businessForm.businessAddress}
                onChange={(e) => setBusinessForm((p) => ({ ...p, businessAddress: e.target.value }))}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.6)' } }}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }}
              />
            </Stack>
            <Button type="submit" variant="contained" disabled={savingProfile} sx={{ mt: 2, bgcolor: '#7C3AED', fontWeight: 800 }}>
              {savingProfile ? 'Saving…' : 'Save business profile'}
            </Button>
          </Paper>
        ) : (
          <>
            <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.04)' }}>
              <Typography variant="overline" sx={{ color: '#A78BFA', fontWeight: 800 }}>YOUR BUSINESS</Typography>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>{profile.business_name}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{profile.business_address}</Typography>
            </Paper>

            {myEvents.length > 0 && (
              <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.04)' }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, mb: 1.5 }}>
                  Your submissions
                </Typography>
                <Stack spacing={1.25}>
                  {myEvents.map((item) => (
                    <Box key={item.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>{item.title}</Typography>
                        <Chip size="small" label={item.status} color={item.status === 'active' ? 'success' : item.status === 'pending' ? 'warning' : 'default'} />
                      </Stack>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                        Submitted {new Date(item.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            <Paper
              component="form"
              onSubmit={handleSubmitEvent}
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.12)',
                bgcolor: 'rgba(255,255,255,0.05)',
              }}
            >
              <Chip icon={<RocketLaunch />} label="STEP 2 — CREATE EVENT" sx={{ mb: 2, color: '#C4B5FD', borderColor: 'rgba(124,58,237,0.35)' }} variant="outlined" />
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>
                Propose a sponsored dating event
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField required fullWidth label="Event title" value={form.title} onChange={handleChange('title')} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.6)' } }} sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField required fullWidth multiline rows={4} label="Event description" value={form.description} onChange={handleChange('description')} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.6)' } }} sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth label="Event location" value={form.location} onChange={handleChange('location')} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.6)' } }} sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Category</InputLabel>
                    <Select value={form.category} label="Category" onChange={handleChange('category')} sx={{ color: '#fff' }}>
                      {CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth type="datetime-local" label="Event starts" InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.6)' } }} value={form.eventStartsAt} onChange={handleChange('eventStartsAt')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="datetime-local" label="Event ends (optional)" InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.6)' } }} value={form.eventEndsAt} onChange={handleChange('eventEndsAt')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="datetime-local" label="In-app start" InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.6)' } }} value={form.proposedActiveFrom} onChange={handleChange('proposedActiveFrom')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="datetime-local" label="In-app end" InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.6)' } }} value={form.proposedActiveUntil} onChange={handleChange('proposedActiveUntil')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff' } }} />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" disabled={submitting} startIcon={<RocketLaunch />} sx={{ mt: 3, px: 4, py: 1.3, fontWeight: 900, bgcolor: '#7C3AED' }}>
                {submitting ? 'Submitting…' : 'Submit sponsored event'}
              </Button>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default VendorEventsPage;
