import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AutoAwesome, Close, Favorite } from '@mui/icons-material';

const MatchQuizReportModal = ({
  open,
  onClose,
  currentUserName,
  matchedUserName,
  currentUserPhoto,
  matchedUserPhoto,
  comparisons = [],
  onStartChat,
}) => {
  const matchCount = comparisons.filter((row) => row.isMatch).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 42%, #FFFFFF 42%)',
        },
      }}
    >
      <Box sx={{ position: 'relative', px: 3, pt: 3, pb: 2, color: '#fff' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'rgba(255,255,255,0.8)' }}
          aria-label="Close"
        >
          <Close />
        </IconButton>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
          <AutoAwesome sx={{ color: '#FCD34D' }} />
          <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700 }}>
            Compatibility Report
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
          <Stack alignItems="center" spacing={0.5}>
            <Avatar src={currentUserPhoto} sx={{ width: 64, height: 64, border: '3px solid #fff' }} />
            <Typography variant="body2" fontWeight={700}>
              {currentUserName}
            </Typography>
          </Stack>
          <Favorite sx={{ color: '#F472B6', fontSize: 28 }} />
          <Stack alignItems="center" spacing={0.5}>
            <Avatar src={matchedUserPhoto} sx={{ width: 64, height: 64, border: '3px solid #fff' }} />
            <Typography variant="body2" fontWeight={700}>
              {matchedUserName}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="h5" fontWeight={800} textAlign="center">
          It&apos;s a Match!
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.85, mt: 0.5 }}>
          {matchCount > 0
            ? `${matchCount} quiz result${matchCount === 1 ? '' : 's'} in common`
            : 'Compare your personality quiz results below'}
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, py: 3, bgcolor: '#fff' }}>
        {comparisons.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Neither of you has completed any quizzes yet. Take a few fun quizzes on your dashboard
            to unlock richer match reports next time.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {comparisons.map((row) => (
              <Box
                key={row.quizId}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: row.isMatch ? 'success.light' : 'grey.200',
                  overflow: 'hidden',
                  bgcolor: row.isMatch ? 'rgba(16, 185, 129, 0.04)' : 'background.paper',
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.25,
                    background: row.gradient || 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700} color="#fff">
                    {row.quizTitle}
                  </Typography>
                  {row.badge && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      {row.badge}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 0,
                  }}
                >
                  <Box sx={{ p: 2, borderRight: '1px solid', borderColor: 'grey.100' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {currentUserName}
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>
                      {row.currentResult}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {matchedUserName}
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>
                      {row.matchedResult}
                    </Typography>
                  </Box>
                </Box>

                {row.isMatch && (
                  <Box sx={{ px: 2, pb: 1.5 }}>
                    <Chip size="small" label="Same result" color="success" variant="outlined" />
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 3 }}>
          {onStartChat && (
            <Button variant="contained" onClick={onStartChat} sx={{ px: 3 }}>
              Start chatting
            </Button>
          )}
          <Button variant="outlined" onClick={onClose}>
            Keep swiping
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MatchQuizReportModal;
