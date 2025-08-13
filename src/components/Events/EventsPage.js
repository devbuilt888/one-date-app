import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Tab,
  Tabs,
  Avatar,
  AvatarGroup,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  Divider,
  Badge,
} from '@mui/material';
import {
  Event,
  LocationOn,
  Schedule,
  People,
  FavoriteBorder,
  Favorite,
  Share,
  CalendarToday,
  Close,
  Person,
  AttachMoney,
} from '@mui/icons-material';

const EventsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([1, 5]);
  const [likedEvents, setLikedEvents] = useState([2, 4]);

  const events = [
    {
      id: 1,
      title: 'Speed Dating Night',
      description: 'Meet multiple potential matches in one fun evening! Structured mini-dates with great conversation starters and a relaxed atmosphere.',
      date: 'Tonight',
      time: '8:00 PM',
      location: 'Downtown Cafe',
      address: '123 Main St, New York, NY',
      price: '$25',
      capacity: 30,
      attendees: 24,
      category: 'Dating',
      image: '/images/events/quickDate.png',
      attendeePhotos: ['/images/users/sarahJohnson.jpeg', '/images/users/emmaWilson.jpeg', '/images/users/oliviaBrown.jpeg'],
      ageRange: '25-35',
      host: 'OneDate Events',
      featured: true,
    },
    {
      id: 2,
      title: 'Wine Tasting & Mingling',
      description: 'Discover new wines while meeting new people in a relaxed, sophisticated atmosphere. Professional sommelier will guide you through premium selections.',
      date: 'Tomorrow',
      time: '7:00 PM',
      location: 'Vintage Cellars',
      address: '456 Wine St, Brooklyn, NY',
      price: '$40',
      capacity: 20,
      attendees: 16,
      category: 'Social',
      image: '/images/events/wineTasting.png',
      attendeePhotos: ['/images/users/avaDavis.jpeg', '/images/users/emmaWilson.jpeg'],
      ageRange: '28-40',
      host: 'Wine & Dine Co.',
      featured: false,
    },
    {
      id: 3,
      title: 'Cooking Class Date',
      description: 'Learn to make pasta from scratch while connecting with fellow food lovers. Perfect for breaking the ice and creating delicious memories!',
      date: 'This Saturday',
      time: '3:00 PM',
      location: 'Culinary Studio',
      address: '789 Chef Ave, Manhattan, NY',
      price: '$55',
      capacity: 16,
      attendees: 12,
      category: 'Activity',
      image: '/images/events/cookingClass.png',
      attendeePhotos: ['/images/users/sarahJohnson.jpeg', '/images/users/oliviaBrown.jpeg', '/images/users/avaDavis.jpeg'],
      ageRange: '24-38',
      host: 'Chef\'s Table',
      featured: true,
    },
    {
      id: 4,
      title: 'Rooftop Mixer',
      description: 'Enjoy stunning city views while meeting new people at this exclusive rooftop gathering. Live DJ and craft cocktails included.',
      date: 'Friday',
      time: '6:30 PM',
      location: 'Sky Lounge',
      address: '321 High St, Manhattan, NY',
      price: '$30',
      capacity: 40,
      attendees: 35,
      category: 'Social',
      image: '/images/events/rooftopMixer.png',
      attendeePhotos: ['/images/users/emmaWilson.jpeg', '/images/users/sarahJohnson.jpeg', '/images/users/oliviaBrown.jpeg', '/images/users/avaDavis.jpeg'],
      ageRange: '26-42',
      host: 'City Socials',
      featured: false,
    },
    {
      id: 5,
      title: 'Art Gallery Walk',
      description: 'Explore contemporary art while engaging in meaningful conversations with like-minded individuals. Expert curator will provide insights.',
      date: 'Sunday',
      time: '2:00 PM',
      location: 'Modern Art Museum',
      address: '654 Culture Blvd, Manhattan, NY',
      price: '$20',
      capacity: 25,
      attendees: 18,
      category: 'Cultural',
      image: '/images/events/artGallery.png',
      attendeePhotos: ['/images/users/oliviaBrown.jpeg', '/images/users/avaDavis.jpeg'],
      ageRange: '25-45',
      host: 'Art Lovers NYC',
      featured: false,
    },
    {
      id: 6,
      title: 'Hiking & Brunch',
      description: 'Start with a scenic hike and end with a delicious brunch. Perfect for outdoor enthusiasts and health-conscious singles!',
      date: 'Next Saturday',
      time: '9:00 AM',
      location: 'Central Park',
      address: 'Central Park, New York, NY',
      price: '$35',
      capacity: 20,
      attendees: 15,
      category: 'Outdoor',
      image: '/images/events/hikingPicnic.png',
      attendeePhotos: ['/images/users/sarahJohnson.jpeg', '/images/users/emmaWilson.jpeg', '/images/users/avaDavis.jpeg'],
      ageRange: '22-35',
      host: 'Adventure Dates',
      featured: true,
    },
  ];

  const categories = ['All', 'Dating', 'Social', 'Activity', 'Cultural', 'Outdoor'];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleJoinEvent = (eventId) => {
    if (joinedEvents.includes(eventId)) {
      setJoinedEvents(joinedEvents.filter(id => id !== eventId));
    } else {
      setJoinedEvents([...joinedEvents, eventId]);
    }
  };

  const handleLikeEvent = (eventId) => {
    if (likedEvents.includes(eventId)) {
      setLikedEvents(likedEvents.filter(id => id !== eventId));
    } else {
      setLikedEvents([...likedEvents, eventId]);
    }
  };

  const filteredEvents = currentTab === 0 
    ? events 
    : events.filter(event => event.category === categories[currentTab]);

  const EventCard = ({ event }) => {
    const isJoined = joinedEvents.includes(event.id);
    const isLiked = likedEvents.includes(event.id);
    const spotsLeft = event.capacity - event.attendees;

    return (
      <Card
        sx={{
          height: 480, // Fixed height for all cards
          width: '100%', // Fill the grid item completely
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
            borderColor: 'grey.300',
          },
          position: 'relative',
          // Force consistent sizing with CSS
          boxSizing: 'border-box',
          '@media (min-width: 768px)': {
            width: '100% !important',
            maxWidth: 'none !important',
            minWidth: 'auto !important',
          },
        }}
      >
        {/* Featured Badge */}
        {event.featured && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
            }}
          >
            <Chip
              label="Featured"
              size="small"
              sx={{
                backgroundColor: 'secondary.main',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        )}

        {/* Like Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleLikeEvent(event.id);
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          {isLiked ? (
            <Favorite sx={{ color: 'error.main' }} />
          ) : (
            <FavoriteBorder sx={{ color: 'text.secondary' }} />
          )}
        </IconButton>

        {/* Fixed height image container */}
        <Box 
          sx={{ 
            height: 200,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            image={event.image}
            alt={event.title}
          />
        </Box>
        
        {/* Content area with exact height */}
        <Box sx={{ 
          height: 280,
          p: 3, 
          display: 'flex', 
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          {/* Top section - Category and age */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 1,
            height: 24,
            flexShrink: 0,
          }}>
            <Chip
              label={event.category}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: 'secondary.main', 
                color: 'secondary.main',
                fontSize: '0.75rem',
              }}
            />
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              {event.ageRange}
            </Typography>
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            fontWeight="700" 
            color="text.primary" 
            sx={{ 
              mb: 1,
              height: 28,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              flexShrink: 0,
            }}
          >
            {event.title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              height: 42,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
              flexShrink: 0,
            }}
          >
            {event.description}
          </Typography>

          {/* Event details - fixed height section */}
          <Box sx={{ 
            mb: 2, 
            height: 72,
            flexShrink: 0,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {event.date} at {event.time}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {event.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.price}
              </Typography>
            </Box>
          </Box>

          {/* Attendees section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 2,
            height: 32,
            flexShrink: 0,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                {event.attendeePhotos.map((photo, index) => (
                  <Avatar key={index} src={photo} sx={{ border: '1px solid white' }} />
                ))}
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary">
                {event.attendees} going
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              color={spotsLeft <= 5 ? 'error.main' : 'text.secondary'}
              fontWeight="500"
            >
              {spotsLeft} spots left
            </Typography>
          </Box>

          {/* Buttons - fixed at bottom */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            height: 40,
            flexShrink: 0,
          }}>
            <Button
              fullWidth
              variant={isJoined ? "outlined" : "contained"}
              onClick={(e) => {
                e.stopPropagation();
                handleJoinEvent(event.id);
              }}
              size="small"
              sx={{ py: 1 }}
            >
              {isJoined ? 'Leave Event' : 'Join Event'}
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event);
              }}
              sx={{ minWidth: 80, px: 2 }}
            >
              Details
            </Button>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 12 }}>
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4, 
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="h3" fontWeight="700" color="text.primary" sx={{ mb: 1 }}>
            Discover Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find exciting events and meet like-minded people in your area
          </Typography>
        </Paper>

        {/* Category Tabs */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'none',
                minHeight: 48,
              },
            }}
          >
            {categories.map((category, index) => (
              <Tab key={category} label={category} />
            ))}
          </Tabs>
        </Paper>

        {/* Events Grid */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr', // 1 column on mobile
              sm: 'repeat(2, 1fr)', // 2 columns on tablet
              md: 'repeat(3, 1fr)', // 3 columns on desktop and above
              xl: 'repeat(4, 1fr)', // 4 columns on extra large screens
            },
            // Force equal column widths with CSS Grid
            '& > *': {
              minWidth: 0, // Prevent grid blowout
              width: '100%', // Force full width
            },
            // Additional CSS override for screens wider than 768px
            '@media (min-width: 768px)': {
              gridTemplateColumns: 'repeat(3, 1fr)',
              '& > *': {
                width: '100% !important',
                maxWidth: '100% !important',
                flex: 'none !important',
              },
            },
            // Extra large screens
            '@media (min-width: 1536px)': {
              gridTemplateColumns: 'repeat(4, 1fr)',
            },
          }}
        >
          {filteredEvents.map((event) => (
            <Box key={event.id} sx={{ width: '100%' }}>
              <EventCard event={event} />
            </Box>
          ))}
        </Box>

        {/* Event Details Modal */}
        <Dialog
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
            }
          }}
        >
          {selectedEvent && (
            <>
              <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={selectedEvent.image}
                    alt={selectedEvent.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <IconButton
                    onClick={() => setSelectedEvent(null)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              
              <DialogContent sx={{ p: 3 }}>
                <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 1 }}>
                  {selectedEvent.title}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Hosted by {selectedEvent.host}
                </Typography>

                <Typography variant="body1" color="text.primary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {selectedEvent.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="600" color="text.primary">
                            {selectedEvent.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedEvent.time}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="600" color="text.primary">
                            {selectedEvent.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedEvent.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="600" color="text.primary">
                          {selectedEvent.price}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="600" color="text.primary">
                          {selectedEvent.attendees}/{selectedEvent.capacity} attendees
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AvatarGroup max={6}>
                    {selectedEvent.attendeePhotos.map((photo, index) => (
                      <Avatar key={index} src={photo} />
                    ))}
                  </AvatarGroup>
                  <Typography variant="body2" color="text.secondary">
                    and {selectedEvent.attendees - selectedEvent.attendeePhotos.length} others are going
                  </Typography>
                </Box>
              </DialogContent>
              
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                  onClick={() => setSelectedEvent(null)}
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleJoinEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  variant="contained"
                  size="large"
                  sx={{ px: 4 }}
                >
                  {joinedEvents.includes(selectedEvent.id) ? 'Leave Event' : 'Join Event'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default EventsPage; 