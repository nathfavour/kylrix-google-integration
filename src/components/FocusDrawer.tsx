import React from 'react';
import { Box, Drawer, Button, Typography, useTheme, Stack } from '@mui/material';
import { X, Terminal } from 'lucide-react';
import Logo from './Logo';

interface FocusDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FocusDrawer: React.FC<FocusDrawerProps> = ({
  open,
  onClose,
  title = "Integration Portal",
  description,
  children
}) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'rgba(5, 4, 3, 0.9)', // Deep black mask to blur/obscure rest of workspace
          }
        },
        paper: {
          sx: {
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            bgcolor: '#161412',
            borderTop: '1px solid #34322F',
            backgroundImage: 'none',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            boxShadow: '0 -16px 40px rgba(0,0,0,0.85)',
            pb: 'max(24px, env(safe-area-inset-bottom))'
          }
        }
      }}
    >
      {/* Drawer Drag Handle bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
        <Box sx={{ width: '40px', height: '4px', bgcolor: '#1C1A18', borderRadius: '2px' }} />
      </Box>

      {/* Drawer Header */}
      <Box sx={{ px: 4, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1C1A18' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Logo app="root" size={32} variant="icon" />
          <Box>
            <Typography sx={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, fontFamily: '"Space Grotesk", sans-serif' }}>
              {title}
            </Typography>
            {description && (
              <Typography sx={{ color: '#9B9691', fontSize: '12px', mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
        </Box>

        <Button 
          onClick={onClose}
          sx={{ 
            p: 1.5, 
            minWidth: 0, 
            borderRadius: '50%', 
            color: '#9B9691',
            bgcolor: '#0A0908',
            border: '1px solid #1D1C1B',
            '&:hover': {
              bgcolor: '#1C1A18',
              color: '#FFFFFF'
            }
          }}
        >
          <X size={18} />
        </Button>
      </Box>

      {/* Drawer Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 4, py: 3, bgcolor: '#0A0908' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {children}
        </Box>
      </Box>

      {/* Footer System Status Bar */}
      <Box sx={{ borderTop: '1px solid #1C1A18', px: 4, py: 2, bgcolor: '#161412', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Terminal size={12} style={{ color: '#9B9691' }} />
          <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
            SECURE CLIENT PIPELINE TERMINAL (LOCAL-ONLY OVERLAYS ENABLED)
          </Typography>
        </Box>
        <Typography sx={{ color: '#6366F1', fontSize: '11px', fontFamily: '"JetBrains Mono"', fontWeight: 700 }}>
          STATUS: BRIDGED
        </Typography>
      </Box>
    </Drawer>
  );
};
