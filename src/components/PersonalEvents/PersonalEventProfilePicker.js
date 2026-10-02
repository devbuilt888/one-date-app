import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';

const ProfileChoiceCard = ({ profile, onSelect, disabled }) => (
  <Card
    variant="outlined"
    sx={{
      width: '100%',
      height: '100%',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      overflow: 'hidden',
      borderColor: 'grey.200',
      opacity: disabled ? 0.7 : 1,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': disabled ? {} : { transform: 'translateY(-4px)', boxShadow: 4 },
    }}
  >
    <CardMedia
      component="img"
      image={profile.photoUrl}
      alt={profile.displayName}
      sx={{
        width: '100%',
        height: 200,
        flexShrink: 0,
        objectFit: 'cover',
        objectPosition: 'center top',
      }}
    />
    <CardContent
      sx={{
        p: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        '&:last-child': { pb: 2 },
      }}
    >
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{
          lineHeight: 1.2,
          height: '2.4em',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {profile.displayName}
        {profile.age !== '—' ? `, ${profile.age}` : ''}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1,
          height: 60,
          lineHeight: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {profile.bio}
      </Typography>
      <Button
        fullWidth
        variant="contained"
        disabled={disabled}
        onClick={() => onSelect(profile)}
        sx={{ mt: 'auto', pt: 1, fontWeight: 700 }}
      >
        Choose this person
      </Button>
    </CardContent>
  </Card>
);

const PersonalEventProfilePicker = ({
  title,
  subtitle,
  profiles,
  onSelect,
  disabled = false,
}) => (
  <Box>
    <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5, textAlign: 'center' }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center' }}>
      {subtitle}
    </Typography>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, minmax(0, 1fr))',
        },
        gap: 2,
        alignItems: 'stretch',
      }}
    >
      {profiles.map((profile) => (
        <Box key={profile.id} sx={{ minWidth: 0, display: 'flex' }}>
          <ProfileChoiceCard profile={profile} onSelect={onSelect} disabled={disabled} />
        </Box>
      ))}
    </Box>
    <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary">
        Profiles are shuffled — trust your instincts.
      </Typography>
    </Stack>
  </Box>
);

export default PersonalEventProfilePicker;
