import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Favorite, 
  ArrowForward,
  Email,
  Lock,
} from '@mui/icons-material';
import { useAuth } from '../../App';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authentication
    if (email && password) {
      // Mock user data
      const userData = {
        id: '1',
        name: 'Demo User',
        email: email,
        age: 25,
        bio: 'Love adventure and new experiences!',
        photos: ['/images/users/sarahJohnson.jpeg']
      };
      
      setTimeout(() => {
        login(userData);
        navigate('/dashboard');
        setLoading(false);
      }, 1000);
    } else {
      setError('Please fill in all fields');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'background.default',
      }}
    >
      {/* Left side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          },
        }}
      >
        <Box sx={{ zIndex: 1, textAlign: 'center', maxWidth: 480, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                borderRadius: '50%',
                p: 2,
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Favorite sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography 
              variant="h3" 
              fontWeight="700"
              sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              OneDate
            </Typography>
          </Box>
          
          <Typography variant="h4" fontWeight="600" sx={{ mb: 3, color: '#F1F5F9' }}>
            Connect with meaningful relationships
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#CBD5E1', lineHeight: 1.7, mb: 6 }}>
            Join thousands of users who have found their perfect match through our innovative dating platform. 
            Experience a new way to connect with people who share your interests and values.
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="700" sx={{ color: '#6366F1', mb: 1 }}>
                10K+
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Happy Couples
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="700" sx={{ color: '#8B5CF6', mb: 1 }}>
                50K+
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Active Users
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="700" sx={{ color: '#F59E0B', mb: 1 }}>
                95%
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Success Rate
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, sm: 6, md: 8 },
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {/* Mobile logo */}
            <Box 
              sx={{ 
                display: { xs: 'flex', md: 'none' }, 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  borderRadius: '50%',
                  p: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Favorite sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="700" color="primary">
                OneDate
              </Typography>
            </Box>

            <Typography variant="h3" fontWeight="700" color="text.primary" sx={{ mb: 2 }}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account to continue your journey
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid #FCA5A5',
                backgroundColor: '#FEF2F2',
                '& .MuiAlert-icon': {
                  color: '#DC2626',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Paper 
            elevation={0}
            sx={{ 
              p: 0,
              backgroundColor: 'transparent',
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography 
                    variant="body2" 
                    fontWeight="500" 
                    color="text.primary" 
                    sx={{ mb: 1 }}
                  >
                    Email address
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    variant="body2" 
                    fontWeight="500" 
                    color="text.primary" 
                    sx={{ mb: 1 }}
                  >
                    Password
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="text" 
                    size="small"
                    sx={{ 
                      color: 'secondary.main',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    Forgot password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={loading}
                  endIcon={!loading && <ArrowForward />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </Stack>
            </Box>
          </Paper>

          <Box sx={{ mt: 6 }}>
            <Divider sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                or
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  component={Link}
                  to="/signup"
                  variant="text"
                  sx={{ 
                    color: 'secondary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      textDecoration: 'underline',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Sign up for free
                </Button>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage; 