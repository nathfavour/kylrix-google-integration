import { createTheme } from '@mui/material/styles';

export const kylrixTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0A0908', // Pitch black stage
      paper: '#161412',   // Dark Ash primary surface
    },
    primary: {
      main: '#6366F1', // Ecosystem primary / Accounts
      dark: '#575CF0',
    },
    error: {
      main: '#EF4444', // Red for warnings
    },
    success: {
      main: '#10B981', // Emerald for active connections
    },
    warning: {
      main: '#F59E0B',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9B9691', // Muted text (opaque hex)
    },
    divider: '#1C1A18', // Hairline borders
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          border: '1px solid transparent',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161412',
          borderRadius: '24px',
          border: '1px solid #1C1A18',
          boxShadow: '0 4px 4px -4px rgba(0,0,0,0.9), 0 2px 3px -3px rgba(37,35,33,0.9)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161412',
          backgroundImage: 'none',
          border: '1px solid #34322F',
          borderRadius: '24px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#1C1A18',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 24,
          padding: 0,
          display: 'flex',
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: '#FFFFFF',
              '& + .MuiSwitch-track': {
                backgroundColor: '#6366F1',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 20,
            height: 20,
            boxShadow: 'none',
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
            backgroundColor: '#1C1A18',
            opacity: 1,
            border: '1px solid #34322F',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
});
