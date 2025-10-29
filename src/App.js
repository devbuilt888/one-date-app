import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { supabase, auth } from './lib/supabase';

// Import components
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import Dashboard from './components/Dashboard/Dashboard';
import MatchingPage from './components/Matching/MatchingPage';
import EventsPage from './components/Events/EventsPage';
import ProfilePage from './components/Profile/ProfilePage';
import ChatsPage from './components/Chat/ChatsPage';
import Navbar from './components/Navigation/Navbar';
import SeedPage from './components/Admin/SeedPage';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Sophisticated, professional theme inspired by Linear, Stripe, and Apple
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F172A', // Sophisticated slate-900
      dark: '#020617', // slate-950
      light: '#334155', // slate-700
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6366F1', // Modern indigo-500
      dark: '#4338CA', // indigo-700
      light: '#8B5CF6', // violet-500
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#F59E0B', // amber-500 for accents
      dark: '#D97706', // amber-600
      light: '#FCD34D', // amber-300
    },
    background: {
      default: '#FAFBFB', // Subtle off-white
      paper: '#FFFFFF',
      surface: '#F8FAFC', // slate-50
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // slate-900
      secondary: '#475569', // slate-600
      disabled: '#94A3B8', // slate-400
      hint: '#64748B', // slate-500
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    success: {
      main: '#10B981', // emerald-500
      light: '#34D399', // emerald-400
      dark: '#059669', // emerald-600
    },
    warning: {
      main: '#F59E0B', // amber-500
      light: '#FCD34D', // amber-300
      dark: '#D97706', // amber-600
    },
    error: {
      main: '#EF4444', // red-500
      light: '#F87171', // red-400
      dark: '#DC2626', // red-600
    },
    info: {
      main: '#3B82F6', // blue-500
      light: '#60A5FA', // blue-400
      dark: '#2563EB', // blue-600
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: '#0F172A',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#0F172A',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      color: '#0F172A',
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
      color: '#0F172A',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
      color: '#0F172A',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
      color: '#0F172A',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#475569',
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#475569',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#64748B',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#64748B',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      color: '#64748B',
    },
  },
  spacing: 8, // 8px base unit
  shape: {
    borderRadius: 8, // Clean, modern corners
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFeatureSettings: '"rlig" 1, "calt" 1',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '10px 16px',
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: 40,
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: '#0F172A',
          color: '#FFFFFF',
          border: '1px solid transparent',
          '&:hover': {
            background: '#1E293B',
            boxShadow: '0 4px 12px rgb(15 23 42 / 0.4)',
          },
          '&:disabled': {
            background: '#E2E8F0',
            color: '#94A3B8',
          },
        },
        outlined: {
          border: '1px solid #E2E8F0',
          color: '#475569',
          background: '#FFFFFF',
          '&:hover': {
            border: '1px solid #CBD5E1',
            background: '#F8FAFC',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          },
        },
        text: {
          color: '#475569',
          '&:hover': {
            background: '#F1F5F9',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
          minHeight: 32,
        },
        sizeLarge: {
          padding: '12px 20px',
          fontSize: '0.9375rem',
          minHeight: 48,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #F1F5F9',
          backgroundImage: 'none',
        },
        elevation0: {
          border: '1px solid transparent',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #F1F5F9',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          border: '1px solid #E2E8F0',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #F1F5F9',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            borderColor: '#E2E8F0',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: '#E2E8F0',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: '#CBD5E1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366F1',
              borderWidth: 2,
            },
            '&.Mui-error fieldset': {
              borderColor: '#EF4444',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748B',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#6366F1',
            },
            '&.Mui-error': {
              color: '#EF4444',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '0.9375rem',
            color: '#0F172A',
            padding: '12px 14px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.8125rem',
          fontWeight: 500,
          height: 28,
        },
        filled: {
          backgroundColor: '#F1F5F9',
          color: '#475569',
          '&:hover': {
            backgroundColor: '#E2E8F0',
          },
        },
        outlined: {
          borderColor: '#E2E8F0',
          color: '#475569',
          '&:hover': {
            backgroundColor: '#F8FAFC',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid #F1F5F9',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #F1F5F9',
          backgroundColor: '#FAFBFB',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#F1F5F9',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F1F5F9',
          color: '#475569',
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F1F5F9',
        },
        indicator: {
          backgroundColor: '#6366F1',
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          color: '#64748B',
          '&.Mui-selected': {
            color: '#6366F1',
          },
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await auth.signIn(email, password);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, userData = {}) => {
    try {
      const { error } = await auth.signUp(email, password, userData);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <div>Loading...</div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <AuthContext.Provider value={value}>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              {isAuthenticated && <Navbar />}
              <Box sx={{ flex: 1 }}>
                <Routes>
                  <Route 
                    path="/login" 
                    element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
                  />
                  <Route 
                    path="/signup" 
                    element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} 
                  />
                  <Route 
                    path="/dashboard" 
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/matching" 
                    element={isAuthenticated ? <MatchingPage /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/events" 
                    element={isAuthenticated ? <EventsPage /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/profile" 
                    element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/chats" 
                    element={isAuthenticated ? <ChatsPage /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/seed" 
                    element={<SeedPage />} 
                  />
                  <Route 
                    path="/" 
                    element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
                  />
                </Routes>
              </Box>
            </Box>
          </Router>
        </AuthContext.Provider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
