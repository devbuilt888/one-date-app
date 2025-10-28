import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import {
  PersonAdd,
  ArrowForward,
} from '@mui/icons-material';

const CreateProfilePrompt = ({ onCreateProfile }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <PersonAdd sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="600" color="text.primary" sx={{ mb: 1 }}>
          Welcome to OneDate! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Let's create your profile to get started with finding your perfect match.
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
        <Typography variant="body2">
          <strong>What you'll need:</strong>
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Your basic information (name, age, bio)</li>
          <li>Your dating preferences</li>
          <li>Some photos to showcase your personality</li>
          <li>Your location (for finding nearby matches)</li>
        </ul>
      </Alert>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAdd />}
          endIcon={<ArrowForward />}
          onClick={onCreateProfile}
          sx={{ px: 4, py: 1.5 }}
        >
          Create My Profile
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Don't worry, you can always edit your profile later!
      </Typography>
    </Paper>
  );
};

export default CreateProfilePrompt;
