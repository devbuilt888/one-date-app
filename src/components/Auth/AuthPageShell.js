import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { Favorite } from '@mui/icons-material';

const BrandMark = () => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box
      sx={{
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        borderRadius: '50%',
        p: 1,
        mr: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Favorite sx={{ fontSize: 20, color: 'white' }} />
    </Box>
    <Typography variant="h5" fontWeight={700} color="text.primary">
      OneDate
    </Typography>
  </Box>
);

const AuthPageShell = ({
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'sm',
  embedded = false,
}) => {
  const card = (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Paper>
  );

  if (embedded) {
    return (
      <Box>
        {card}
        {footer}
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: 1.5,
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <BrandMark />
          <Button component={RouterLink} to="/tour" variant="outlined" size="small" sx={{ fontWeight: 700 }}>
            Take the tour
          </Button>
        </Container>
      </Box>
      <Container maxWidth={maxWidth} sx={{ pt: { xs: 3, sm: 5 }, px: { xs: 2, sm: 3 } }}>
        {card}
        {footer}
      </Container>
    </Box>
  );
};

export default AuthPageShell;
