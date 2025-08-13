import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Badge,
  Alert,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  LocationOn,
  Work,
  School,
  Cake,
  Verified,
  Add,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../../App';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Demo User',
    age: user?.age || '25',
    bio: user?.bio || 'Passionate about life, love, and meaningful connections. Always up for an adventure!',
    location: user?.location || 'New York, NY',
    work: 'Senior Product Designer',
    education: 'New York University',
    interests: ['Travel', 'Photography', 'Yoga', 'Coffee', 'Music', 'Art'],
    gender: user?.gender || 'female',
    interestedIn: user?.interestedIn || 'male',
    photos: user?.photos || [
      '/images/users/sarahJohnson.jpeg', 
      '/images/users/emmaWilson.jpeg', 
      '/images/users/oliviaBrown.jpeg'
    ],
    height: '5\'6"',
    exercise: 'Regularly',
    drinking: 'Socially',
    smoking: 'Never',
    children: 'Want someday',
  });
  const [newInterest, setNewInterest] = useState('');

  const handleChange = (field) => (event) => {
    setProfileData({ ...profileData, [field]: event.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      name: user?.name || 'Demo User',
      age: user?.age || '25',
      bio: user?.bio || 'Passionate about life, love, and meaningful connections. Always up for an adventure!',
      location: user?.location || 'New York, NY',
      work: 'Senior Product Designer',
      education: 'New York University',
      interests: ['Travel', 'Photography', 'Yoga', 'Coffee', 'Music', 'Art'],
      gender: user?.gender || 'female',
      interestedIn: user?.interestedIn || 'male',
      photos: ['/images/users/sarahJohnson.jpeg', '/images/users/emmaWilson.jpeg', '/images/users/oliviaBrown.jpeg'],
      height: '5\'6"',
      exercise: 'Regularly',
      drinking: 'Socially',
      smoking: 'Never',
      children: 'Want someday',
    });
    setIsEditing(false);
  };

  const handleInterestAdd = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleInterestRemove = (interestToRemove) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4, 
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" fontWeight="700" color="text.primary" sx={{ mb: 1 }}>
                Profile Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your profile information and preferences
              </Typography>
            </Box>
            
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                size="large"
                sx={{ px: 3 }}
              >
                Edit Profile
              </Button>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  size="large"
                  sx={{ px: 3 }}
                >
                  Save Changes
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Column - Photos */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              {/* Main Photo */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Profile Photos
                </Typography>
                
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Verified sx={{ color: 'secondary.main', fontSize: 20 }} />
                    }
                  >
                    <Avatar
                      src={profileData.photos[0]}
                      sx={{
                        width: 200,
                        height: 200,
                        mx: 'auto',
                        border: '4px solid',
                        borderColor: 'background.paper',
                        boxShadow: 3,
                      }}
                    />
                  </Badge>
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'background.paper',
                        border: '2px solid',
                        borderColor: 'grey.200',
                        '&:hover': {
                          backgroundColor: 'grey.50',
                        },
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  )}
                </Box>

                {/* Additional Photos */}
                <Grid container spacing={2}>
                  {profileData.photos.slice(1, 3).map((photo, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={photo}
                          variant="rounded"
                          sx={{
                            width: '100%',
                            height: 120,
                            borderRadius: 2,
                          }}
                        />
                        {isEditing && (
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                              },
                            }}
                          >
                            <PhotoCamera fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Add Photo
                  </Button>
                )}
              </Paper>

              {/* Profile Stats */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Profile Stats
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Profile Views</Typography>
                    <Typography variant="h6" fontWeight="600">142</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Likes Received</Typography>
                    <Typography variant="h6" fontWeight="600">89</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Profile Completeness</Typography>
                    <Typography variant="h6" fontWeight="600" color="success.main">95%</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column - Profile Information */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              {/* Basic Information */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Basic Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      value={profileData.name}
                      onChange={handleChange('name')}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Age
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={profileData.age}
                      onChange={handleChange('age')}
                      disabled={!isEditing}
                      placeholder="Enter your age"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Bio
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={profileData.bio}
                      onChange={handleChange('bio')}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      value={profileData.location}
                      onChange={handleChange('location')}
                      disabled={!isEditing}
                      placeholder="Enter your location"
                      InputProps={{
                        startAdornment: <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Height
                    </Typography>
                    <TextField
                      fullWidth
                      value={profileData.height}
                      onChange={handleChange('height')}
                      disabled={!isEditing}
                      placeholder="Enter your height"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Professional Information */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Professional & Education
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Occupation
                    </Typography>
                    <TextField
                      fullWidth
                      value={profileData.work}
                      onChange={handleChange('work')}
                      disabled={!isEditing}
                      placeholder="Enter your occupation"
                      InputProps={{
                        startAdornment: <Work sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Education
                    </Typography>
                    <TextField
                      fullWidth
                      value={profileData.education}
                      onChange={handleChange('education')}
                      disabled={!isEditing}
                      placeholder="Enter your education"
                      InputProps={{
                        startAdornment: <School sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Lifestyle */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Lifestyle Preferences
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Exercise
                    </Typography>
                    <FormControl fullWidth disabled={!isEditing}>
                      <Select
                        value={profileData.exercise}
                        onChange={handleChange('exercise')}
                      >
                        <MenuItem value="Never">Never</MenuItem>
                        <MenuItem value="Rarely">Rarely</MenuItem>
                        <MenuItem value="Sometimes">Sometimes</MenuItem>
                        <MenuItem value="Regularly">Regularly</MenuItem>
                        <MenuItem value="Daily">Daily</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Drinking
                    </Typography>
                    <FormControl fullWidth disabled={!isEditing}>
                      <Select
                        value={profileData.drinking}
                        onChange={handleChange('drinking')}
                      >
                        <MenuItem value="Never">Never</MenuItem>
                        <MenuItem value="Rarely">Rarely</MenuItem>
                        <MenuItem value="Socially">Socially</MenuItem>
                        <MenuItem value="Regularly">Regularly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Smoking
                    </Typography>
                    <FormControl fullWidth disabled={!isEditing}>
                      <Select
                        value={profileData.smoking}
                        onChange={handleChange('smoking')}
                      >
                        <MenuItem value="Never">Never</MenuItem>
                        <MenuItem value="Socially">Socially</MenuItem>
                        <MenuItem value="Regularly">Regularly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Children
                    </Typography>
                    <FormControl fullWidth disabled={!isEditing}>
                      <Select
                        value={profileData.children}
                        onChange={handleChange('children')}
                      >
                        <MenuItem value="Don't want">Don't want</MenuItem>
                        <MenuItem value="Want someday">Want someday</MenuItem>
                        <MenuItem value="Have and want more">Have and want more</MenuItem>
                        <MenuItem value="Have and don't want more">Have and don't want more</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>

              {/* Interests */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Interests & Hobbies
                </Typography>
                
                {isEditing && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        placeholder="Add new interest"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleInterestAdd()}
                      />
                      <Button 
                        variant="outlined" 
                        onClick={handleInterestAdd}
                        disabled={!newInterest.trim()}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      variant="filled"
                      deleteIcon={isEditing ? <Close /> : undefined}
                      onDelete={isEditing ? () => handleInterestRemove(interest) : undefined}
                      sx={{
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'secondary.dark',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Dating Preferences */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Dating Preferences
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      I am
                    </Typography>
                    <FormControl fullWidth disabled={!isEditing}>
                      <Select
                        value={profileData.gender}
                        onChange={handleChange('gender')}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="non-binary">Non-binary</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="500" color="text.primary" sx={{ mb: 1 }}>
                      Interested in
                    </Typography>
                    <FormControl fullWidth disabled={!isEditing}>
                      <Select
                        value={profileData.interestedIn}
                        onChange={handleChange('interestedIn')}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="everyone">Everyone</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage; 