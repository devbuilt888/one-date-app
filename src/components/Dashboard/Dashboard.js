import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Favorite,
  Event,
  Chat,
  TrendingUp,
  LocationOn,
  Schedule,
  ArrowForward,
  SmartToy,
  Notifications,
  Star,
  EmojiEvents,
} from '@mui/icons-material';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';
import { supabase, matching, chat, events } from '../../lib/supabase';
import AIChat from './AIChat';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAIChat, setShowAIChat] = useState(false);
  const [isAIChatMinimized, setIsAIChatMinimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    matches: 0,
    likes: 0,
    events: 0,
    messages: 0,
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch user's matches
        const { data: matches, error: matchesError } = await matching.getMatches();
        if (matchesError) {
          console.error('Error fetching matches:', matchesError);
          setRecentMatches([]);
        } else {
          setRecentMatches(matches || []);
        }
        
        // Fetch upcoming events
        const { data: eventsData } = await events.getNearby();
        setUpcomingEvents(eventsData || []);
        
        // Calculate stats
        const matchesCount = matches?.length || 0;
        const eventsCount = eventsData?.length || 0;
        
        setStats({
          matches: matchesCount,
          likes: 0, // TODO: Implement likes count
          events: eventsCount,
          messages: 0, // TODO: Implement messages count
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleOpenAIChat = () => {
    setShowAIChat(true);
    setIsAIChatMinimized(false);
  };

  const handleCloseAIChat = () => {
    setShowAIChat(false);
  };

  const handleToggleAIChatMinimize = () => {
    setIsAIChatMinimized(!isAIChatMinimized);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
        {/* Welcome Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              color="text.primary" 
              sx={{ 
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Welcome back, {user?.user_metadata?.display_name || user?.email}! 👋
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Ready to find your perfect match today?
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/matching')}
                sx={{ px: 3 }}
              >
                Start Matching
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<SmartToy />}
                onClick={handleOpenAIChat}
                sx={{ px: 3 }}
              >
                AI Dating Coach
              </Button>
            </Stack>
          </Box>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              opacity: 0.1,
            }}
          />
        </Paper>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Stats Cards */}
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.2s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  borderColor: 'secondary.main',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'error.light',
                  color: 'error.main',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 1, sm: 2 },
                }}
              >
                <Favorite sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                color="text.primary" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {stats.matches}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                New Matches
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.2s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  borderColor: 'secondary.main',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'secondary.light',
                  color: 'secondary.main',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 1, sm: 2 },
                }}
              >
                <TrendingUp sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                color="text.primary" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {stats.likes}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Likes Received
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.2s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  borderColor: 'secondary.main',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'warning.light',
                  color: 'warning.main',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 1, sm: 2 },
                }}
              >
                <Event sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                color="text.primary" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {stats.events}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Events Joined
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.2s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  borderColor: 'secondary.main',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'info.light',
                  color: 'info.main',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 1, sm: 2 },
                }}
              >
                <Chat sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                color="text.primary" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {stats.messages}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                New Messages
              </Typography>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography 
                variant="h5" 
                fontWeight="700" 
                color="text.primary" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Quick Actions
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Favorite />}
                    onClick={() => navigate('/matching')}
                    sx={{ 
                      py: { xs: 1.5, sm: 2 }, 
                      justifyContent: 'flex-start',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Start Matching
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Event />}
                    onClick={() => navigate('/events')}
                    sx={{ 
                      py: { xs: 1.5, sm: 2 }, 
                      justifyContent: 'flex-start',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Browse Events
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Chat />}
                    onClick={() => navigate('/chats')}
                    sx={{ 
                      py: { xs: 1.5, sm: 2 }, 
                      justifyContent: 'flex-start',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    View Messages
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SmartToy />}
                    onClick={handleOpenAIChat}
                    sx={{ 
                      py: { xs: 1.5, sm: 2 }, 
                      justifyContent: 'flex-start',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    AI Coach
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Matches & Upcoming Events Row */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                border: '1px solid',
                borderColor: 'grey.200',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  fontWeight="700" 
                  color="text.primary"
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                  Recent Matches
                </Typography>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <Notifications />
                </IconButton>
              </Box>
              
              <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                {recentMatches.length > 0 ? (
                  recentMatches.map((match) => {
                    // Get the other user from the match
                    const otherUser = match.user_a_id === user?.id ? match.user_b : match.user_a;
                    return (
                      <Box
                        key={match.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: { xs: 1.5, sm: 2 },
                          backgroundColor: 'background.default',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'grey.100',
                            transform: 'translateX(4px)',
                          },
                        }}
                        onClick={() => navigate('/chats')}
                      >
                        <Avatar
                          src={otherUser?.photo_urls?.[0] || '/images/users/default-avatar.png'}
                          sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, mr: 2 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="600" 
                            color="text.primary"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {otherUser?.display_name || 'Unknown User'}, {otherUser?.age || 'N/A'}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Matched {new Date(match.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label="Match"
                            size="small"
                            color="secondary"
                            sx={{ 
                              fontWeight: 500,
                              fontSize: { xs: '0.625rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                          <ArrowForward sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 20 } }} />
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No matches yet. Start swiping to find your perfect match!
                    </Typography>
                  </Box>
                )}
              </Stack>
              
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/matching')}
                sx={{ 
                  mt: 2, 
                  color: 'secondary.main', 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Find More Matches
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                border: '1px solid',
                borderColor: 'grey.200',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  fontWeight="700" 
                  color="text.primary"
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                  Upcoming Events
                </Typography>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <EmojiEvents />
                </IconButton>
              </Box>
              
              <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <Box
                      key={event.id}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: 'background.default',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                          transform: 'translateX(4px)',
                        },
                      }}
                      onClick={() => navigate('/events')}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="600" 
                          color="text.primary"
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            lineHeight: 1.2
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Chip 
                          label={event.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                      </Box>
                      
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            {new Date(event.starts_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            {event.location_name}
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Typography 
                        variant="caption" 
                        color="secondary.main" 
                        fontWeight="500"
                        sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                      >
                        {event.description || 'Join us for this event!'}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No upcoming events. Check back later!
                    </Typography>
                  </Box>
                )}
              </Stack>
              
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/events')}
                sx={{ 
                  mt: 2, 
                  color: 'secondary.main', 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                View All Events
              </Button>
            </Paper>
          </Grid>

          {/* Fun Quizzes Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                border: '1px solid',
                borderColor: 'grey.200',
                mb: 3,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight="700" 
                    color="text.primary" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    Fun Quizzes
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Discover more about yourself with these personality quizzes
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  View All
                </Button>
              </Box>

              <Grid container spacing={2}>
                {/* Quiz Cards */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Hogwarts House
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          Find out which Hogwarts house you belong to!
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          🏰 Harry Potter
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Ideal Vacation
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          Discover your perfect vacation destination!
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          ✈️ Travel
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Twilight Character
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          Which Twilight character are you?
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          🌙 Twilight
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Love Language
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          Discover your love language!
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          💕 Relationships
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Marvel Hero
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          Which Marvel superhero are you?
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          🦸 Marvel
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Disney Princess
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          Which Disney princess are you?
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          👑 Disney
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Star Wars
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          Which Star Wars character are you?
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          ⭐ Star Wars
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>
                          Dating Style
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          What's your dating personality?
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          💘 Dating
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Profile Completion */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                justifyContent: 'space-between', 
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight="700" 
                    color="text.primary" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    Profile Completion
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Complete your profile to get better matches
                  </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography 
                    variant="h4" 
                    fontWeight="700" 
                    color="success.main"
                    sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                  >
                    85%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Complete
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={85}
                sx={{
                  height: { xs: 6, sm: 8 },
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'success.main',
                    borderRadius: 4,
                  },
                  mb: 2,
                }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Add more photos and interests to reach 100%
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/profile')}
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    alignSelf: { xs: 'flex-start', sm: 'auto' }
                  }}
                >
                  Complete Profile
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* AI Chat Component */}
        {showAIChat && (
          <AIChat
            isMinimized={isAIChatMinimized}
            onToggleMinimize={handleToggleAIChatMinimize}
            onClose={handleCloseAIChat}
          />
        )}
      </Container>
    </Box>
  );
};

export default Dashboard; 