import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Stack,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  ArrowForward,
  Email,
  Lock,
} from '@mui/icons-material';
import { useAuth } from '../../App';
import AuthPageShell from './AuthPageShell';

const LoginPage = ({ preview = false, embedded = false }) => {
  const [email, setEmail] = useState(preview ? 'maya@example.com' : '');
  const [password, setPassword] = useState(preview ? 'password' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview) return;
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      embedded={embedded}
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard, matches, and chats."
      footer={!preview ? (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{' '}
            <Button
              component={Link}
              to="/signup"
              variant="text"
              sx={{
                color: 'secondary.main',
                fontWeight: 700,
                p: 0,
                minWidth: 'auto',
                verticalAlign: 'baseline',
              }}
            >
              Sign up for free
            </Button>
          </Typography>
        </Box>
      ) : null}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            required
            fullWidth
            disabled={preview}
            id="email"
            name="email"
            autoComplete="email"
            autoFocus={!preview}
            label="Email address"
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
          <TextField
            required
            fullWidth
            disabled={preview}
            name="password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            label="Password"
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
                    disabled={preview}
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="text" size="small" disabled={preview} sx={{ color: 'secondary.main', fontWeight: 600 }}>
              Forgot password?
            </Button>
          </Box>
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            disabled={loading || preview}
            endIcon={!loading && <ArrowForward />}
            sx={{ py: 1.4, fontWeight: 700 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </Box>
    </AuthPageShell>
  );
};

export default LoginPage; 