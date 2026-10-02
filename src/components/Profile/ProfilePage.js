import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  Edit,
  Save,
  Close,
  LocationOn,
  AutoAwesome,
  PhotoCamera,
} from '@mui/icons-material';
import { useAuth } from '../../App';
import { profiles, quizCompletions } from '../../lib/supabase';
import { getCurrentLocation } from '../../utils/geolocation';
import { getProfileQuizResults } from '../../lib/quizReport';
import ImageUpload from './ImageUpload';
import CreateProfilePrompt from './CreateProfilePrompt';

const EMPTY_PROFILE = {
  display_name: '',
  age: '',
  bio: '',
  location: '',
  work: '',
  education: '',
  interests: [],
  gender: '',
  preferences_gender: [],
  photo_urls: [],
  height: '',
  exercise: '',
  drinking: '',
  smoking: '',
  children: '',
  lat: null,
  lng: null,
  geohash: '',
};

const SectionCard = ({ title, subtitle, children, action, compact = false }) => (
  <Box
    sx={{
      p: compact ? { xs: 2, md: 1.75 } : { xs: 2.5, sm: 3 },
      borderRadius: 3,
      border: '1px solid rgba(15, 23, 42, 0.08)',
      bgcolor: '#fff',
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.04)',
      height: compact ? '100%' : 'auto',
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ mb: compact ? 1.25 : 2.5 }}
    >
      <Box>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', letterSpacing: 1.2, fontWeight: 700, fontSize: '0.68rem' }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
    {children}
  </Box>
);

const FieldLabel = ({ children }) => (
  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: 'block', letterSpacing: 0.5 }}>
    {children}
  </Typography>
);

const PREVIEW_PROFILE = {
  display_name: 'Maya Chen',
  age: 26,
  bio: 'Coffee walks, new restaurants, and long conversations.',
  location: 'Uptown',
  work: 'Product designer',
  education: 'State University',
  interests: ['Coffee', 'Cooking', 'Live music'],
  gender: 'female',
  preferences_gender: ['male'],
  photo_urls: ['/images/users/sarahJohnson.jpeg'],
  height: "5'6\"",
  exercise: 'Often',
  drinking: 'Socially',
  smoking: 'Never',
  children: 'Someday',
  lat: null,
  lng: null,
  geohash: '',
};

const ProfilePage = ({ preview = false }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(!preview);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasProfile, setHasProfile] = useState(preview);
  const [profileData, setProfileData] = useState(preview ? PREVIEW_PROFILE : EMPTY_PROFILE);
  const [savedSnapshot, setSavedSnapshot] = useState(preview ? PREVIEW_PROFILE : EMPTY_PROFILE);
  const [newInterest, setNewInterest] = useState('');
  const [quizResults, setQuizResults] = useState([]);

  const loadQuizResults = useCallback(async (userId) => {
    if (!userId) return;
    const { data } = await quizCompletions.getByUser(userId);
    setQuizResults(getProfileQuizResults(userId, data || []));
  }, []);

  useEffect(() => {
    if (preview) return;
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await profiles.getById(user.id);

        if (fetchError?.code === 'PGRST116') {
          setHasProfile(false);
          setProfileData({
            ...EMPTY_PROFILE,
            display_name: user?.user_metadata?.display_name || user?.email?.split('@')[0] || '',
          });
        } else if (fetchError) {
          setError('Failed to load profile data');
        } else if (data) {
          setHasProfile(true);
          const loaded = {
            display_name: data.display_name || '',
            age: data.age || '',
            bio: data.bio || '',
            location: data.location || '',
            work: data.work || '',
            education: data.education || '',
            interests: data.interests || [],
            gender: data.gender || '',
            preferences_gender: data.preferences_gender || [],
            photo_urls: data.photo_urls || [],
            height: data.height || '',
            exercise: data.exercise || '',
            drinking: data.drinking || '',
            smoking: data.smoking || '',
            children: data.children || '',
            lat: data.lat,
            lng: data.lng,
            geohash: data.geohash || '',
          };
          setProfileData(loaded);
          setSavedSnapshot(loaded);
        }

        await loadQuizResults(user.id);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [preview, user, loadQuizResults]);

  const handleChange = (field) => (event) => {
    setProfileData({ ...profileData, [field]: event.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      let locationData = { lat: profileData.lat, lng: profileData.lng, geohash: profileData.geohash };

      if (!profileData.lat || !profileData.lng) {
        try {
          const location = await getCurrentLocation();
          locationData = {
            lat: location.lat,
            lng: location.lng,
            geohash: location.geohash,
          };
        } catch (locError) {
          console.warn('Could not get location:', locError);
        }
      }

      const profileToSave = {
        id: user.id,
        display_name: profileData.display_name || null,
        age: profileData.age ? parseInt(profileData.age, 10) : null,
        bio: profileData.bio || null,
        location: profileData.location || null,
        work: profileData.work || null,
        education: profileData.education || null,
        interests: profileData.interests || [],
        gender: profileData.gender || null,
        preferences_gender: Array.isArray(profileData.preferences_gender)
          ? profileData.preferences_gender
          : profileData.preferences_gender
            ? [profileData.preferences_gender]
            : [],
        photo_urls: profileData.photo_urls || [],
        ...locationData,
        updated_at: new Date().toISOString(),
      };

      const { error: saveError } = await profiles.upsert(profileToSave);

      if (saveError) {
        setError(`Failed to save profile: ${saveError.message}`);
        return;
      }

      const merged = { ...profileData, ...locationData };
      setProfileData(merged);
      setSavedSnapshot(merged);
      setSuccess('Profile saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(`Failed to save profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(savedSnapshot);
    setIsEditing(false);
    setError('');
  };

  const handleInterestAdd = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const handleInterestRemove = (interestToRemove) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter((interest) => interest !== interestToRemove),
    });
  };

  const handlePhotosUpdate = (newPhotos) => {
    setProfileData({ ...profileData, photo_urls: newPhotos });
  };

  const completeness = useMemo(() => {
    const fields = [
      profileData.display_name,
      profileData.age,
      profileData.bio,
      profileData.location,
      profileData.work,
      profileData.gender,
      profileData.photo_urls?.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profileData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasProfile) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="sm">
          <CreateProfilePrompt onCreateProfile={() => { setHasProfile(true); setIsEditing(true); }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: { xs: 8, md: 3 } }}>
      {/* Hero — shorter on desktop */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 5, md: 3 },
          pb: { xs: 8, md: 4.5 },
          background: 'linear-gradient(135deg, #0F172A 0%, #312E81 45%, #6366F1 100%)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(circle at 80% 0%, rgba(244,114,182,0.18) 0%, transparent 40%)',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={2}>
            <Box>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>
                Your profile
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#fff" sx={{ fontSize: { xs: '2rem', md: '2rem' } }}>
                {profileData.display_name || 'Unnamed'}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                {profileData.age && (
                  <Chip label={`${profileData.age} years old`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
                )}
                {profileData.location && (
                  <Chip icon={<LocationOn sx={{ color: '#fff !important' }} />} label={profileData.location} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
                )}
                <Chip label={`${completeness}% complete`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{ bgcolor: '#fff', color: '#0F172A', '&:hover': { bgcolor: '#F1F5F9' } }}
                >
                  Edit profile
                </Button>
              ) : (
                <>
                  <Button variant="outlined" startIcon={<Close />} onClick={handleCancel} sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ bgcolor: '#fff', color: '#0F172A' }}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: -7, md: -4 }, position: 'relative', zIndex: 2, px: { xs: 2, md: 3 } }}>
        {(error || success) && (
          <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2, borderRadius: 3 }}>
            {error || success}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 1.5 },
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr',
              md: 'repeat(12, minmax(0, 1fr))',
            },
            alignItems: 'start',
          }}
        >
          {/* Photos — left rail, spans rows 1–2 beside details/about + personality */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / 6', lg: '1 / 5' }, gridRow: { md: '1 / 3' }, height: { md: '100%' } }}>
            <SectionCard title="Photos" compact>
              {isEditing ? (
                <ImageUpload
                  userId={user?.id}
                  currentPhotos={profileData.photo_urls}
                  onPhotosUpdate={handlePhotosUpdate}
                  maxPhotos={6}
                />
              ) : (
                <Box>
                  {profileData.photo_urls?.length > 0 ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: { xs: 1.25, md: 1.5 },
                      }}
                    >
                      {profileData.photo_urls.map((photo, index) => (
                        <Box
                          key={photo}
                          component="img"
                          src={photo}
                          alt={`Profile ${index + 1}`}
                          sx={{
                            width: '100%',
                            aspectRatio: '3/4',
                            objectFit: 'cover',
                            borderRadius: 2.5,
                            border: index === 0 ? '3px solid #6366F1' : '1px solid rgba(15,23,42,0.08)',
                            gridColumn: index === 0 ? 'span 2' : 'span 1',
                            minHeight: index === 0 ? { xs: 200, md: 280, lg: 320 } : { xs: 100, md: 140, lg: 160 },
                            maxHeight: index === 0 ? { xs: 280, md: 360, lg: 400 } : { xs: 160, md: 200, lg: 220 },
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        py: 6,
                        textAlign: 'center',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'grey.200',
                        bgcolor: 'grey.50',
                        minHeight: { md: 280, lg: 320 },
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No photos yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </SectionCard>
          </Box>

          {/* Details + About — stacked on right, row 1 */}
          <Box
            sx={{
              gridColumn: { xs: '1 / -1', md: '6 / -1', lg: '5 / -1' },
              gridRow: { md: '1' },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, md: 1.5 },
            }}
          >
            <SectionCard title="Details" compact>
              <Grid container spacing={1.5}>
                {[
                  { label: 'Display name', field: 'display_name', type: 'text' },
                  { label: 'Age', field: 'age', type: 'number' },
                  { label: 'Location', field: 'location', type: 'text' },
                  { label: 'Height', field: 'height', type: 'text' },
                  { label: 'Work', field: 'work', type: 'text' },
                  { label: 'Education', field: 'education', type: 'text' },
                ].map(({ label, field, type }) => (
                  <Grid item xs={12} sm={6} lg={4} key={field}>
                    <FieldLabel>{label}</FieldLabel>
                    <TextField
                      fullWidth
                      size="small"
                      type={type}
                      value={profileData[field]}
                      onChange={handleChange(field)}
                      disabled={!isEditing}
                    />
                  </Grid>
                ))}
              </Grid>
            </SectionCard>

            <SectionCard title="About" compact>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  value={profileData.bio}
                  onChange={handleChange('bio')}
                  placeholder="Tell people what makes you, you…"
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {profileData.bio || 'Add a bio to stand out.'}
                </Typography>
              )}
            </SectionCard>
          </Box>

          {/* Personality — row 2 right */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: '6 / -1', lg: '5 / -1' }, gridRow: { md: '2' } }}>
            <SectionCard title="Personality" subtitle="Quiz results" action={<AutoAwesome color="primary" fontSize="small" />} compact>
              {quizResults.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Complete fun quizzes on your dashboard to build your personality profile.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      md: 'repeat(2, minmax(0, 1fr))',
                      lg: 'repeat(3, minmax(0, 1fr))',
                      xl: 'repeat(4, minmax(0, 1fr))',
                    },
                    gap: 1.25,
                  }}
                >
                  {quizResults.map((result) => (
                    <Box
                      key={result.quizId}
                      sx={{
                        position: 'relative',
                        p: 1.5,
                        borderRadius: 2.5,
                        background: result.gradient || 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        minHeight: 96,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.42) 100%)',
                          borderRadius: 2.5,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          textShadow: '0 1px 4px rgba(0,0,0,0.45)',
                        }}
                      >
                        {result.badge}
                      </Typography>
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            lineHeight: 1.2,
                            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                          }}
                        >
                          {result.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            mt: 0.25,
                            lineHeight: 1.2,
                            textShadow: '0 1px 4px rgba(0,0,0,0.55)',
                          }}
                        >
                          {result.resultLabel}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </SectionCard>
          </Box>

          {/* Interests — row 3 left */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / 6', lg: '1 / 5' }, gridRow: { md: '3' } }}>
            <SectionCard title="Interests" compact>
              {isEditing && (
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInterestAdd()}
                  />
                  <Button variant="outlined" size="small" onClick={handleInterestAdd} disabled={!newInterest.trim()}>
                    Add
                  </Button>
                </Stack>
              )}
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {profileData.interests.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">No interests yet.</Typography>
                ) : (
                  profileData.interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      size="small"
                      onDelete={isEditing ? () => handleInterestRemove(interest) : undefined}
                      sx={{ fontWeight: 600, bgcolor: '#EEF2FF', color: '#4338CA', height: 26 }}
                    />
                  ))
                )}
              </Stack>
            </SectionCard>
          </Box>

          {/* Lifestyle + Dating — row 3 right */}
          <Box
            sx={{
              gridColumn: { xs: '1 / -1', md: '6 / -1', lg: '5 / -1' },
              gridRow: { md: '3' },
              display: 'grid',
              gap: { xs: 2, md: 1.5 },
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <SectionCard title="Lifestyle" compact>
              <Grid container spacing={1.5}>
                {[
                  { label: 'Exercise', field: 'exercise', options: ['Never', 'Rarely', 'Sometimes', 'Regularly', 'Daily'] },
                  { label: 'Drinking', field: 'drinking', options: ['Never', 'Rarely', 'Socially', 'Regularly'] },
                  { label: 'Smoking', field: 'smoking', options: ['Never', 'Socially', 'Regularly'] },
                  { label: 'Children', field: 'children', options: ["Don't want", 'Want someday', 'Have and want more', "Have and don't want more"] },
                ].map(({ label, field, options }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <FieldLabel>{label}</FieldLabel>
                    <FormControl fullWidth size="small" disabled={!isEditing}>
                      <Select value={profileData[field] || ''} onChange={handleChange(field)} displayEmpty>
                        <MenuItem value="" disabled>Select</MenuItem>
                        {options.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </SectionCard>

            <SectionCard title="Dating preferences" compact>
              <Stack spacing={1.5}>
                <Box>
                  <FieldLabel>I am</FieldLabel>
                  <FormControl fullWidth size="small" disabled={!isEditing}>
                    <Select value={profileData.gender || ''} onChange={handleChange('gender')} displayEmpty>
                      <MenuItem value="" disabled>Select</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="non-binary">Non-binary</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FieldLabel>Interested in</FieldLabel>
                  <FormControl fullWidth size="small" disabled={!isEditing}>
                    <Select
                      value={profileData.preferences_gender?.[0] || ''}
                      onChange={(e) => setProfileData({ ...profileData, preferences_gender: [e.target.value] })}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="everyone">Everyone</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </SectionCard>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
