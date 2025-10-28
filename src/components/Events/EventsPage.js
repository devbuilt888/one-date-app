import React, { useState, useEffect } from 'react';
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
  CircularProgress,
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
import { useAuth } from '../../App';
import * as supabaseLib from '../../lib/supabase';

const EventsPage = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Dating', 'Social', 'Activity', 'Cultural', 'Outdoor'];

  // Load events from database
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        
        // Debug: Check if events object exists
        console.log('Supabase lib:', supabaseLib);
        console.log('Events object:', supabaseLib.events);
        console.log('Events.getAll:', supabaseLib.events?.getAll);
        
        if (!supabaseLib.events || typeof supabaseLib.events.getAll !== 'function') {
          console.error('Events object or getAll function not found');
          setError('Events service not available');
          return;
        }
        
        const { data, error } = await supabaseLib.events.getAll();
        if (error) {
          console.error('Error loading events:', error);
          setError('Failed to load events');
          return;
        }
        setEvents(data || []);
      } catch (err) {
        console.error('Exception loading events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadEvents();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const { data, error } = await supabaseLib.events.toggleAttendance(eventId);
      if (error) {
        console.error('Error toggling attendance:', error);
        return;
      }
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                isAttending: data.action === 'created' || data.action === 'updated',
                attendingCount: data.action === 'created' || data.action === 'updated' 
                  ? event.attendingCount + 1 
                  : event.attendingCount - 1,
                spotsLeft: data.action === 'created' || data.action === 'updated'
                  ? event.spotsLeft - 1
                  : event.spotsLeft + 1
              }
            : event
        )
      );
    } catch (err) {
      console.error('Exception toggling attendance:', err);
    }
  };

  const handleLikeEvent = async (eventId) => {
    try {
      const { data, error } = await supabaseLib.events.toggleLike(eventId);
      if (error) {
        console.error('Error toggling like:', error);
        return;
      }
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                isLiked: data.action === 'liked',
                likesCount: data.action === 'liked' 
                  ? event.likesCount + 1 
                  : event.likesCount - 1
              }
            : event
        )
      );
    } catch (err) {
      console.error('Exception toggling like:', err);
    }
  };

  const filteredEvents = currentTab === 0 
    ? events 
    : events.filter(event => event.category === categories[currentTab]);

  const EventCard = ({ event }) => {
    const isJoined = event.isAttending;
    const isLiked = event.isLiked;
    const spotsLeft = event.spotsLeft;
    const attendees = event.attendingCount;
    
    // Format date and time
    const eventDate = new Date(event.starts_at);
    const dateStr = eventDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
    const timeStr = eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

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
                {dateStr} at {timeStr}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {event.location_name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {attendees} attending
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
              <Typography variant="body2" color="text.secondary">
                {attendees} going
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        ) : filteredEvents.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Typography variant="h6" color="text.secondary">
              No events found
            </Typography>
          </Box>
        ) : (
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
        )}

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
                  Hosted by OneDate Events
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
                            {new Date(selectedEvent.starts_at).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(selectedEvent.starts_at).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="600" color="text.primary">
                            {selectedEvent.location_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="600" color="text.primary">
                          {selectedEvent.attendingCount}/{selectedEvent.max_participants} attendees
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="600" color="text.primary">
                          {selectedEvent.spotsLeft} spots left
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.attendingCount} people are attending this event
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
                  {selectedEvent.isAttending ? 'Leave Event' : 'Join Event'}
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