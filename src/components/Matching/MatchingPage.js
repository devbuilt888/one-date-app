import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  Button,
  Stack,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import {
  Favorite,
  Close,
  Refresh,
  LocationOn,
  Work,
  School,
  AutoAwesome,
  Star,
  Verified,
  Info,
  MoreHoriz,
} from '@mui/icons-material';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useAuth } from '../../App';
import { supabase, matching } from '../../lib/supabase';

const MatchingPage = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user?.id)
          .limit(50);

        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching profiles:', error);
          setProfiles([]);
          return;
        }

        const mapped = (data || []).map((p) => ({
          id: p.id,
          name: p.display_name || 'Unknown',
          age: p.age || 'N/A',
          bio: p.bio || '',
          location: p.location || '',
          work: p.work || '',
          education: p.education || '',
          interests: Array.isArray(p.interests) ? p.interests : [],
          photos: Array.isArray(p.photo_urls) && p.photo_urls.length > 0 ? p.photo_urls : ['/images/users/default-avatar.png'],
          distance: 'nearby',
          verified: true,
          compatibility: 90,
        }));

        setProfiles(mapped);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user?.id]);

  const currentProfile = useMemo(() => profiles[currentIndex], [profiles, currentIndex]);

  const CardComponent = ({ profile, index, onSwipe }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-300, 300], [-15, 15]);
    const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const passOpacity = useTransform(x, [-100, 0], [1, 0]);

    const handleDragEnd = (event, info) => {
      if (info.offset.x > 100) {
        onSwipe('like');
      } else if (info.offset.x < -100) {
        onSwipe('pass');
      }
    };

    return (
      <motion.div
        style={{
          x,
          y,
          rotate,
          opacity,
          position: 'absolute',
          width: '100%',
          height: '100%',
          cursor: 'grab',
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card
          sx={{
            height: '100%',
            maxHeight: 600,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            boxShadow: 3,
          }}
        >
          {/* Swipe Indicators */}
          <motion.div
            style={{
              position: 'absolute',
              top: '40%',
              right: 20,
              opacity: likeOpacity,
              zIndex: 10,
            }}
          >
            <Box
              sx={{
                background: 'success.main',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                transform: 'rotate(15deg)',
                border: '2px solid',
                borderColor: 'success.main',
                boxShadow: 2,
              }}
            >
              LIKE
            </Box>
          </motion.div>
          
          <motion.div
            style={{
              position: 'absolute',
              top: '40%',
              left: 20,
              opacity: passOpacity,
              zIndex: 10,
            }}
          >
            <Box
              sx={{
                background: 'error.main',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                transform: 'rotate(-15deg)',
                border: '2px solid',
                borderColor: 'error.main',
                boxShadow: 2,
              }}
            >
              PASS
            </Box>
          </motion.div>

          {/* Profile Image */}
          <Box sx={{ position: 'relative', height: '65%' }}>
            <CardMedia
              component="img"
              height="100%"
              image={profile.photos[0]}
              alt={profile.name}
              sx={{ objectFit: 'cover' }}
            />
            
            {/* Top gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '30%',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
              }}
            />

            {/* Top Row Icons */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Chip
                label={`${profile.compatibility}% Match`}
                size="small"
                sx={{
                  backgroundColor: 'success.main',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
              <IconButton size="small" sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <MoreHoriz />
              </IconButton>
            </Box>

            {/* Verification Badge */}
            {profile.verified && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 60,
                }}
              >
                <Badge
                  badgeContent={<Verified sx={{ fontSize: 16 }} />}
                  color="primary"
                />
              </Box>
            )}

            {/* Photo Indicators */}
            <Box
              sx={{
                position: 'absolute',
                top: 60,
                left: 16,
                right: 16,
                display: 'flex',
                gap: 0.5,
              }}
            >
              {profile.photos.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    flex: 1,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: idx === 0 ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {/* Profile Info */}
          <CardContent sx={{ p: 3, height: '35%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" fontWeight="700" color="text.primary">
                  {profile.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {profile.age}
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Info />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {profile.distance}
              </Typography>
            </Box>

            <Typography 
              variant="body2" 
              color="text.primary" 
              sx={{ 
                mb: 2, 
                lineHeight: 1.5,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {profile.bio}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Work sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {profile.work}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, overflow: 'hidden' }}>
              {profile.interests.slice(0, 3).map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 24,
                    borderColor: 'grey.300',
                  }}
                />
              ))}
              {profile.interests.length > 3 && (
                <Chip
                  label={`+${profile.interests.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 24,
                    borderColor: 'grey.300',
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const handleSwipe = async (action) => {
    if (action === 'like' && currentProfile) {
      try {
        const { data, error } = await matching.likeUser(currentProfile.id);
        if (error) {
          console.error('Error liking user:', error);
          return;
        }
        
        if (data?.matched) {
          setMatches([...matches, currentProfile]);
          setMatchedUser(currentProfile); // Store the matched user before updating index
          setShowMatch(true);
          setTimeout(() => {
            setShowMatch(false);
            setMatchedUser(null); // Clear matched user after notification
          }, 1500);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error liking user:', e);
      }
    }
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleButtonAction = (action) => {
    handleSwipe(action);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="body1" color="text.secondary">Loading profiles...</Typography>
      </Box>
    );
  }

  if (!currentProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="body1" color="text.secondary">No profiles to show. Try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pt: 2, pb: 12 }}>
      <Container maxWidth="sm">
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 1 }}>
            Discover
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find your perfect match
          </Typography>
        </Paper>

        {/* Card Stack Container */}
        <Box
          sx={{
            position: 'relative',
            height: 600,
            mx: 'auto',
            maxWidth: 400,
            mb: 4,
          }}
        >
          {profiles
            .slice(currentIndex, currentIndex + 3)
            .map((profile, index) => (
              <Box
                key={profile.id}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 3 - index,
                  transform: `scale(${1 - index * 0.05}) translateY(${index * 8}px)`,
                  opacity: 1 - index * 0.3,
                }}
              >
                {index === 0 ? (
                  <CardComponent
                    profile={profile}
                    index={currentIndex + index}
                    onSwipe={handleSwipe}
                  />
                ) : (
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      boxShadow: 1,
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="65%"
                      image={profile.photos[0]}
                      alt={profile.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="600">
                        {profile.name}, {profile.age}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            ))}
        </Box>

        {/* Action Buttons */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <IconButton
              onClick={() => handleButtonAction('pass')}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: 'error.light',
                color: 'error.main',
                border: '2px solid',
                borderColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Close fontSize="large" />
            </IconButton>

            <IconButton
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: 'warning.light',
                color: 'warning.main',
                border: '2px solid',
                borderColor: 'warning.main',
                '&:hover': {
                  backgroundColor: 'warning.main',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Refresh />
            </IconButton>

            <IconButton
              onClick={() => handleButtonAction('like')}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: 'success.light',
                color: 'success.main',
                border: '2px solid',
                borderColor: 'success.main',
                '&:hover': {
                  backgroundColor: 'success.main',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Favorite fontSize="large" />
            </IconButton>
          </Stack>
        </Paper>

        {/* Match Notification */}
        {showMatch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: 'success.main',
                color: 'white',
                borderRadius: 3,
                maxWidth: 300,
              }}
            >
              <AutoAwesome sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                It's a Match!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You and {matchedUser?.name || 'someone'} liked each other
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Start chatting now!
              </Typography>
            </Paper>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default MatchingPage; 