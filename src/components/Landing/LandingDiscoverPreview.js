import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import { Favorite, Close, LocationOn, Info, MoreHoriz } from '@mui/icons-material';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const DEMO_PROFILE = {
  id: 'demo',
  name: 'Emma Wilson',
  age: 29,
  bio: 'Coffee, hikes, and good conversation. Try swiping the card left or right.',
  distance: '2 mi away',
  photos: ['/images/users/emmaWilson.jpeg'],
  compatibility: 92,
};

const PreviewCard = ({ profile, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, -60, 0, 60, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const passOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 80) onSwipe('like');
    else if (info.offset.x < -80) onSwipe('pass');
  };

  return (
    <motion.div
      style={{
        x,
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
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <Card
        sx={{
          height: '100%',
          maxHeight: 420,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'grey.200',
          boxShadow: 3,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '38%',
            right: 12,
            opacity: likeOpacity,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              background: 'success.main',
              color: 'white',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '0.85rem',
              transform: 'rotate(12deg)',
            }}
          >
            LIKE
          </Box>
        </motion.div>
        <motion.div
          style={{
            position: 'absolute',
            top: '38%',
            left: 12,
            opacity: passOpacity,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              background: 'error.main',
              color: 'white',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '0.85rem',
              transform: 'rotate(-12deg)',
            }}
          >
            PASS
          </Box>
        </motion.div>

        <Box sx={{ position: 'relative', height: '62%' }}>
          <CardMedia
            component="img"
            height="100%"
            image={profile.photos[0]}
            alt={profile.name}
            sx={{ objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              right: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Chip
              label={`${profile.compatibility}% Match`}
              size="small"
              sx={{ backgroundColor: 'success.main', color: 'white', fontWeight: 600, fontSize: '0.7rem' }}
            />
            <IconButton size="small" sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.35)' }}>
              <MoreHoriz />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ p: 2, height: '38%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="h6" fontWeight="700" color="text.primary">
                {profile.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {profile.age}
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Info fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {profile.distance}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.45, flex: 1 }}>
            {profile.bio}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LandingDiscoverPreview = () => {
  const [passCount, setPassCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  const profile = useMemo(() => DEMO_PROFILE, []);

  const handleSwipe = (action) => {
    if (action === 'like') setLikeCount((c) => c + 1);
    if (action === 'pass') setPassCount((c) => c + 1);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'grey.200',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 0.5 }}>
        Discover
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Preview how matching works — drag the card or use the buttons.
      </Typography>

      <Box sx={{ position: 'relative', height: 400, mx: 'auto', maxWidth: 340, mb: 2 }}>
        <PreviewCard profile={profile} onSwipe={handleSwipe} />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
        <IconButton
          onClick={() => handleSwipe('pass')}
          sx={{
            width: 52,
            height: 52,
            backgroundColor: 'error.light',
            color: 'error.main',
            border: '2px solid',
            borderColor: 'error.main',
            '&:hover': { backgroundColor: 'error.main', color: 'white' },
          }}
        >
          <Close />
        </IconButton>
        <IconButton
          onClick={() => handleSwipe('like')}
          sx={{
            width: 52,
            height: 52,
            backgroundColor: 'success.light',
            color: 'success.main',
            border: '2px solid',
            borderColor: 'success.main',
            '&:hover': { backgroundColor: 'success.main', color: 'white' },
          }}
        >
          <Favorite />
        </IconButton>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Demo swipes: {likeCount} likes · {passCount} passes
      </Typography>
    </Paper>
  );
};

export default LandingDiscoverPreview;
