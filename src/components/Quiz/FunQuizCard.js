import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { getQuizDecorationPublicUrl } from '../../lib/quizDecorations';

const titleMistSx = {
  color: 'rgba(0,0,0,0.92)',
  fontWeight: 700,
  mb: 0.25,
  fontSize: '0.88rem',
  lineHeight: 1.15,
  textShadow:
    '0 0 10px rgba(255,255,255,1), 0 0 22px rgba(255,255,255,0.95), 0 0 36px rgba(255,255,255,0.75), 0 1px 2px rgba(255,255,255,0.9)',
};

const statusLabel = (variant) => {
  if (variant === 'completed') return 'Completed';
  if (variant === 'sign_in') return 'Unopened';
  return 'Not started';
};

/** Graphic bleeds past right + bottom; extra bottom pull keeps a slice clipped for a playful crop */
const DECORATION_SIZE = 100;
const DECORATION_OVERFLOW_X = 20;
const DECORATION_OVERFLOW_Y = 36;

const FunQuizCard = ({ quiz, onClick, statusVariant = 'not_started' }) => {
  const completed = statusVariant === 'completed';
  const decorationUrl = getQuizDecorationPublicUrl(quiz.id);

  return (
    <Card
      onClick={onClick}
      sx={{
        height: 100,
        position: 'relative',
        background: quiz.gradient,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          zIndex: 3,
          minWidth: 30,
          height: 24,
          px: 0.65,
          borderRadius: 999,
          border: '2px solid rgba(255,255,255,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.18)',
        }}
      >
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.75rem', lineHeight: 1 }}>
          +1
        </Typography>
      </Box>

      {decorationUrl ? (
        <Box
          component="img"
          src={decorationUrl}
          alt=""
          aria-hidden
          sx={{
            position: 'absolute',
            right: -DECORATION_OVERFLOW_X,
            bottom: -DECORATION_OVERFLOW_Y,
            width: DECORATION_SIZE,
            height: DECORATION_SIZE,
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 1,
            filter:
              'drop-shadow(0 4px 10px rgba(0,0,0,0.38)) drop-shadow(0 0 14px rgba(255,255,255,0.35))',
            opacity: 0.97,
          }}
        />
      ) : null}

      <CardContent
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 1.25,
          pt: 1,
          pb: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 0.35,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ flex: '0 1 auto', minHeight: 0 }}>
          <Typography variant="h6" sx={titleMistSx}>
            {quiz.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              fontSize: '0.65rem',
              lineHeight: 1.25,
              fontWeight: 500,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {quiz.subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0.75,
            flex: '0 0 auto',
            mt: 0,
          }}
        >
          <Chip
            label={statusLabel(statusVariant)}
            size="small"
            sx={{
              height: 20,
              fontWeight: 600,
              fontSize: '0.6rem',
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.85)',
              backgroundColor: completed ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.12)',
              '& .MuiChip-label': { px: 1 },
              ...(completed ? { border: '1px solid rgba(255,255,255,0.5)' } : { border: '1px solid rgba(255,255,255,0.45)' }),
            }}
            variant="outlined"
          />
          {!decorationUrl ? (
            <ArrowForward sx={{ fontSize: 18, color: '#fff', opacity: 0.95 }} />
          ) : (
            <Box sx={{ width: 22, height: 22, flexShrink: 0 }} aria-hidden />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FunQuizCard;
