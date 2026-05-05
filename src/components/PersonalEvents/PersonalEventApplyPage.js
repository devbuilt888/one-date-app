import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import { ArrowBack, Close, Favorite } from '@mui/icons-material';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { getPersonalEventById, getEventDisplayTitle, labelForEventType } from '../../lib/personalEvents';

const SEED_APPLICANTS = [
  {
    id: 'a1',
    name: 'Riley',
    age: 27,
    bio: 'Foodie, weekend hikes, and good playlists.',
    photos: ['/images/users/emmaWilson.jpeg'],
  },
  {
    id: 'a2',
    name: 'Casey',
    age: 29,
    bio: 'Coffee first, plans later. Love trying new spots.',
    photos: ['/images/users/sarahJohnson.jpeg'],
  },
  {
    id: 'a3',
    name: 'Morgan',
    age: 26,
    bio: 'Charity runs and trivia nights.',
    photos: ['/images/users/avaDavis.jpeg'],
  },
];

const SwipeCard = ({ profile, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 80) onSwipe('like');
    else if (info.offset.x < -80) onSwipe('pass');
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'grab',
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <Card
        sx={{
          height: '100%',
          maxHeight: 420,
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'grey.200',
          boxShadow: 4,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '38%',
            right: 16,
            opacity: likeOpacity,
            zIndex: 5,
          }}
        >
          <Box
            sx={{
              bgcolor: 'success.main',
              color: 'white',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              fontWeight: 700,
              transform: 'rotate(12deg)',
            }}
          >
            APPLY
          </Box>
        </motion.div>
        <motion.div
          style={{
            position: 'absolute',
            top: '38%',
            left: 16,
            opacity: passOpacity,
            zIndex: 5,
          }}
        >
          <Box
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              fontWeight: 700,
              transform: 'rotate(-12deg)',
            }}
          >
            PASS
          </Box>
        </motion.div>
        <Box sx={{ position: 'relative', height: '58%' }}>
          <CardMedia
            component="img"
            height="100%"
            image={profile.photos[0]}
            alt=""
            sx={{ objectFit: 'cover' }}
          />
          <Chip
            label="Interested"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'secondary.main',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="h6" fontWeight={700}>
            {profile.name}, {profile.age}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.4 }}>
            {profile.bio}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PersonalEventApplyPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = useMemo(() => getPersonalEventById(eventId), [eventId]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const current = SEED_APPLICANTS[index];

  const handleSwipe = (action) => {
    if (index >= SEED_APPLICANTS.length - 1) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
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
      <Box sx={{ px: 2, pt: 2, maxWidth: 480, mx: 'auto' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} size="small" aria-label="Back">
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            Apply to join
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {labelForEventType(event.eventType)}
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.35 }}>
            {getEventDisplayTitle(event)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            {event.hostName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {event.approximateLocation}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {new Date(event.datetime).toLocaleString()}
          </Typography>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Swipe to apply or pass on people who want to join this event.
        </Typography>

        {done ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography fontWeight={600}>You&apos;re all caught up</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              We&apos;ll notify hosts when there is a mutual match.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
              Back to home
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ position: 'relative', height: 440, mx: 'auto' }}>
              {current && <SwipeCard key={current.id} profile={current} onSwipe={handleSwipe} />}
            </Box>
            <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
              <IconButton
                onClick={() => handleSwipe('pass')}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'error.light',
                  color: 'error.main',
                  border: '2px solid',
                  borderColor: 'error.main',
                }}
              >
                <Close />
              </IconButton>
              <IconButton
                onClick={() => handleSwipe('like')}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'success.light',
                  color: 'success.main',
                  border: '2px solid',
                  borderColor: 'success.main',
                }}
              >
                <Favorite />
              </IconButton>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PersonalEventApplyPage;
