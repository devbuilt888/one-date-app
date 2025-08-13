import React, { useState } from 'react';
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
import AIChat from './AIChat';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAIChat, setShowAIChat] = useState(false);
  const [isAIChatMinimized, setIsAIChatMinimized] = useState(false);

  // Mock data for demonstration
  const stats = {
    matches: 12,
    likes: 34,
    events: 3,
    messages: 8,
  };

  const recentMatches = [
    {
      id: 1,
      name: 'Sarah',
      age: 26,
      image: '/images/users/sarahJohnson.jpeg',
      mutual: true,
      lastActive: '2h ago',
    },
    {
      id: 2,
      name: 'Emma',
      age: 24,
      image: '/images/users/emmaWilson.jpeg',
      mutual: false,
      lastActive: 'Online',
    },
    {
      id: 3,
      name: 'Olivia',
      age: 28,
      image: '/images/users/oliviaBrown.jpeg',
      mutual: true,
      lastActive: '1d ago',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Speed Dating Night',
      date: 'Tonight 8PM',
      location: 'Downtown Cafe',
      attendees: 24,
      category: 'Dating',
    },
    {
      id: 2,
      title: 'Wine Tasting Experience',
      date: 'Tomorrow 7PM',
      location: 'Vintage Cellars',
      attendees: 16,
      category: 'Social',
    },
  ];

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
              Welcome back, {user?.name}! 👋
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
                {recentMatches.map((match) => (
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
                      src={match.image}
                      sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="600" 
                        color="text.primary"
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        {match.name}, {match.age}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        {match.lastActive}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {match.mutual && (
                        <Chip
                          label="Mutual"
                          size="small"
                          color="secondary"
                          sx={{ 
                            fontWeight: 500,
                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                      )}
                      <ArrowForward sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 20 } }} />
                    </Box>
                  </Box>
                ))}
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
                {upcomingEvents.map((event) => (
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
                          {event.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                        >
                          {event.location}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Typography 
                      variant="caption" 
                      color="secondary.main" 
                      fontWeight="500"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      {event.attendees} people attending
                    </Typography>
                  </Box>
                ))}
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