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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../App';
import AuthPageShell from './AuthPageShell';

const SAMPLE_SIGNUP = {
  email: 'maya@example.com',
  password: 'password',
  confirmPassword: 'password',
  name: 'Maya Chen',
  age: '26',
  gender: 'female',
  interestedIn: 'male',
  bio: 'Coffee walks, new restaurants, and long conversations.',
  location: 'Uptown',
};

const SignupPage = ({ preview = false, embedded = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(preview ? SAMPLE_SIGNUP : {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
    interestedIn: '',
    bio: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const steps = ['Account Info', 'Personal Details', 'About You'];

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.name || !formData.age || !formData.gender || !formData.interestedIn) {
        setError('Please fill in all fields');
        return;
      }
    }
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview) return;
    setError('');
    setLoading(true);

    if (!formData.bio || !formData.location) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        display_name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        preferences_gender: [formData.interestedIn],
        bio: formData.bio,
        location: formData.location
      };

      const result = await signup(formData.email, formData.password, userData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={preview}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange('email')}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={preview}
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={preview}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              sx={{ mb: 2 }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={preview}
              id="name"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange('name')}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={preview}
              id="age"
              label="Age"
              name="age"
              type="number"
              inputProps={{ min: 18, max: 100 }}
              value={formData.age}
              onChange={handleChange('age')}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                disabled={preview}
                labelId="gender-label"
                id="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleChange('gender')}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="non-binary">Non-binary</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="interested-label">Interested In</InputLabel>
              <Select
                disabled={preview}
                labelId="interested-label"
                id="interestedIn"
                value={formData.interestedIn}
                label="Interested In"
                onChange={handleChange('interestedIn')}
              >
                <MenuItem value="male">Men</MenuItem>
                <MenuItem value="female">Women</MenuItem>
                <MenuItem value="both">Both</MenuItem>
                <MenuItem value="all">Everyone</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={preview}
              id="bio"
              label="Bio"
              name="bio"
              multiline
              rows={4}
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange('bio')}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={preview}
              id="location"
              label="Location"
              name="location"
              placeholder="City, State"
              value={formData.location}
              onChange={handleChange('location')}
              sx={{ mb: 2 }}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const stepControls = preview ? (
    <Stack spacing={3} sx={{ mt: 1 }}>
      {steps.map((label, index) => (
        <Box key={label}>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            Step {index + 1} · {label}
          </Typography>
          {renderStepContent(index)}
        </Box>
      ))}
      <Button fullWidth variant="contained" disabled sx={{ py: 1.4, fontWeight: 700 }}>
        Create Account
      </Button>
    </Stack>
  ) : (
    <>
      <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button type="submit" variant="contained" disabled={loading} sx={{ py: 1.2, px: 3, fontWeight: 700 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained" sx={{ py: 1.2, px: 3, fontWeight: 700 }}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </>
  );

  return (
    <AuthPageShell
      embedded={embedded}
      maxWidth="sm"
      title="Create your account"
      subtitle="Three short steps: your login, who you are, and a short bio."
      footer={!preview ? (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </Typography>
          <Button
            component={Link}
            to="/vendors/signup"
            variant="outlined"
            fullWidth
            sx={{ mt: 2, py: 1.2, fontWeight: 700 }}
          >
            I&apos;m a business wanting to sponsor a dating event
          </Button>
        </Box>
      ) : null}
    >
      {stepControls}
    </AuthPageShell>
  );
};

export default SignupPage; 