import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Storefront, Visibility, VisibilityOff } from '@mui/icons-material';
import { auth, profiles } from '../../lib/supabase';

import AuthPageShell from '../Auth/AuthPageShell';

const SAMPLE_BUSINESS = {
  email: 'hello@cafelumen.com',
  password: 'password',
  confirmPassword: 'password',
  contactName: 'Elton Tito',
  businessName: 'Cafe Lumen',
  businessAddress: '120 Uptown Ave',
};

const BusinessSignupPage = ({ preview = false, embedded = false }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(preview ? SAMPLE_BUSINESS : {
    email: '',
    password: '',
    confirmPassword: '',
    contactName: '',
    businessName: '',
    businessAddress: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (preview) return;
    setError('');

    if (!form.email || !form.password || !form.confirmPassword || !form.contactName || !form.businessName || !form.businessAddress) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await auth.signUp(form.email, form.password, {
        display_name: form.contactName,
        is_business: true,
      });

      if (signUpError || !data?.user?.id) {
        throw signUpError || new Error('Signup failed');
      }

      const { error: profileError } = await profiles.upsert({
        id: data.user.id,
        display_name: form.contactName,
        is_business: true,
        business_name: form.businessName.trim(),
        business_address: form.businessAddress.trim(),
      });

      if (profileError) {
        throw profileError;
      }

      navigate('/vendors/events');
    } catch (err) {
      setError(err.message || 'Could not create business account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      embedded={embedded}
      title="Business sign up"
      subtitle="Create a business account with your name and address. After that, you can submit sponsored dating events for review."
      footer={!preview ? (
        <Stack spacing={1} sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have a business account?{' '}
            <RouterLink to="/login" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </RouterLink>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Looking for a personal account?{' '}
            <RouterLink to="/signup" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
              User sign up
            </RouterLink>
          </Typography>
          <Button component={RouterLink} to="/landing" sx={{ color: 'text.secondary' }}>
            Back to landing
          </Button>
        </Stack>
      ) : null}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Storefront sx={{ color: 'secondary.main' }} />
        <Typography variant="overline" color="secondary.main" fontWeight={800} letterSpacing={1.1}>
          Sponsor a dating event
        </Typography>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField required fullWidth disabled={preview} label="Contact name" value={form.contactName} onChange={handleChange('contactName')} />
          <TextField required fullWidth disabled={preview} label="Business name" value={form.businessName} onChange={handleChange('businessName')} />
          <TextField required fullWidth disabled={preview} multiline rows={2} label="Business address" value={form.businessAddress} onChange={handleChange('businessAddress')} />
          <TextField required fullWidth disabled={preview} type="email" label="Business email" value={form.email} onChange={handleChange('email')} />
          <TextField
            required
            fullWidth
            disabled={preview}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={form.password}
            onChange={handleChange('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={preview}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField required fullWidth disabled={preview} type="password" label="Confirm password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} />
          <Button type="submit" fullWidth variant="contained" disabled={loading || preview} sx={{ mt: 1, py: 1.4, fontWeight: 700 }}>
            {loading ? 'Creating account…' : 'Create business account'}
          </Button>
        </Stack>
      </Box>
    </AuthPageShell>
  );
};

export default BusinessSignupPage;
