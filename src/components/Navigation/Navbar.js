import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Favorite,
  Event,
  Person,
  Chat,
  ExitToApp,
  Notifications,
} from '@mui/icons-material';
import { useAuth } from '../../App';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 0;
    if (path === '/matching') return 1;
    if (path === '/events') return 2;
    if (path === '/chats') return 3;
    if (path === '/profile') return 4;
    return 0;
  };

  const handleNavigationChange = (event, newValue) => {
    const routes = ['/dashboard', '/matching', '/events', '/chats', '/profile'];
    navigate(routes[newValue]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top App Bar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                borderRadius: '50%',
                p: 1,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Favorite sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <Typography 
              variant="h5" 
              fontWeight="700"
              sx={{ color: 'text.primary' }}
            >
              OneDate
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'secondary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography 
                  variant="body2" 
                  fontWeight="600"
                  color="text.primary"
                  sx={{ lineHeight: 1.2 }}
                >
                  {user?.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ lineHeight: 1 }}
                >
                  Online
                </Typography>
              </Box>
            </Box>

            <IconButton 
              onClick={handleLogout}
              size="small"
              sx={{
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  backgroundColor: 'grey.100',
                  borderColor: 'grey.300',
                },
              }}
            >
              <ExitToApp fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={getActiveTab()}
          onChange={handleNavigationChange}
          showLabels
          sx={{
            backgroundColor: 'transparent',
            paddingTop: 1,
            paddingBottom: 1,
            height: 64,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 60,
              paddingTop: 8,
              paddingBottom: 4,
              color: 'text.secondary',
              transition: 'all 0.2s ease',
              borderRadius: 2,
              margin: '0 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: 'grey.100',
                color: 'text.primary',
              },
              '&.Mui-selected': {
                backgroundColor: 'secondary.light',
                color: 'secondary.main',
                fontWeight: 600,
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: 4,
                },
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)',
                },
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              fontWeight: 500,
              marginTop: 4,
              lineHeight: 1,
              '&.Mui-selected': {
                fontSize: '0.75rem',
              },
            },
            '& .MuiSvgIcon-root': {
              fontSize: 24,
              marginBottom: 0,
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<DashboardIcon />}
          />
          <BottomNavigationAction
            label="Discover"
            icon={
              <Badge badgeContent={2} color="error" variant="dot">
                <Favorite />
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Events"
            icon={<Event />}
          />
          <BottomNavigationAction
            label="Chats"
            icon={
              <Badge badgeContent={5} color="error">
                <Chat />
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Profile"
            icon={<Person />}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Navbar; 