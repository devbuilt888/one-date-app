import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSeasonRuntime } from '../../context/SeasonRuntimeContext';

export default function FunQuizzesSeasonHeader({ subtitle }) {
  const { seasonLabel, formattedSeasonClock } = useSeasonRuntime();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Box sx={{ flex: '1 1 auto', minWidth: 0, maxWidth: '100%' }}>
        <Typography
          variant="h5"
          fontWeight="700"
          color="text.primary"
          sx={{ mb: subtitle ? 1 : 0, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          Fun Quizzes
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      <Box
        sx={{
          flex: { xs: '1 1 100%', sm: '0 1 auto' },
          minWidth: 0,
          maxWidth: '100%',
          display: 'flex',
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            gap: { xs: 0.75, sm: 1 },
            rowGap: 0.75,
            width: { xs: '100%', sm: 'auto' },
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
            px: { xs: 1.25, sm: 1.75 },
            py: { xs: 0.75, sm: 0.9 },
            borderRadius: 2,
            bgcolor: 'rgba(15, 23, 42, 0.04)',
            border: '1px solid',
            borderColor: 'grey.200',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            backgroundImage:
              'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(248, 250, 252, 0.9) 100%)',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '0.6rem', sm: '0.65rem' },
              fontWeight: 700,
              color: 'text.secondary',
              letterSpacing: { xs: '0.06em', sm: '0.12em' },
              textTransform: 'uppercase',
              lineHeight: 1.25,
              textAlign: { xs: 'center', sm: 'left' },
              minWidth: 0,
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
            }}
          >
            {seasonLabel}
          </Typography>
          <Box
            sx={{
              width: 1,
              height: 14,
              bgcolor: 'grey.300',
              borderRadius: 1,
              flexShrink: 0,
              opacity: 0.9,
              display: { xs: 'none', sm: 'block' },
            }}
          />
          <Typography
            component="span"
            sx={{
              fontSize: { xs: '0.72rem', sm: '0.85rem' },
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: { xs: '0.03em', sm: '0.08em' },
              background: 'linear-gradient(120deg, #4F46E5 0%, #6366F1 45%, #7C3AED 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.25,
              minWidth: 0,
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
            {formattedSeasonClock}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
