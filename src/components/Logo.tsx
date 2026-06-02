import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { KylrixApp } from '../types';

interface LogoProps {
  sx?: any;
  size?: number;
  app?: KylrixApp;
  variant?: 'full' | 'icon';
  animate?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  sx,
  size = 32,
  app = 'root',
  variant = 'full',
  animate = false,
}) => {
  const theme = useTheme();
  
  const appColors: Record<KylrixApp, { accent: string; label: string }> = {
    root: { accent: "#6366F1", label: "KYLRIX" },
    accounts: { accent: "#6366F1", label: "KYLRIX ACCOUNTS" },
    kylrix: { accent: "#6366F1", label: "KYLRIX" },
    vault: { accent: "#10B981", label: "KYLRIX VAULT" },
    flow: { accent: "#A855F7", label: "KYLRIX FLOW" },
    note: { accent: "#EC4899", label: "KYLRIX NOTE" },
    connect: { accent: "#F59E0B", label: "KYLRIX CONNECT" }
  };

  const current = appColors[app] || appColors.root;

  const Hexagon = (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      animate={animate ? { rotate: 360 } : {}}
      transition={animate ? { repeat: Infinity, duration: 12, ease: "linear" } : {}}
      aria-hidden="true"
      style={{ 
        display: 'block',
        minWidth: size,
      }}
    >
      {/* Outer Boundary Edges */}
      <line x1="15" y1="30" x2="50" y2="10" stroke="#EC4899" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="10" x2="85" y2="30" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="85" y1="30" x2="85" y2="70" stroke="#EC4899" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="85" y1="70" x2="50" y2="90" stroke="#A855F7" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="90" x2="15" y2="70" stroke="#EC4899" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="15" y1="70" x2="15" y2="30" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />

      {/* Inner Seam Edges */}
      <line x1="50" y1="50" x2="15" y2="30" stroke="#A855F7" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="85" y2="30" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="50" y2="90" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />

      {/* Vertices (Unified Ecosystem Color: Indigo) */}
      <circle cx="50" cy="10" r="4" fill="#6366F1" stroke="#000000" strokeWidth="1.5" />
      <circle cx="85" cy="30" r="4" fill="#6366F1" stroke="#000000" strokeWidth="1.5" />
      <circle cx="85" cy="70" r="4" fill="#6366F1" stroke="#000000" strokeWidth="1.5" />
      <circle cx="50" cy="90" r="4" fill="#6366F1" stroke="#000000" strokeWidth="1.5" />
      <circle cx="15" cy="70" r="4" fill="#6366F1" stroke="#000000" strokeWidth="1.5" />
      <circle cx="15" cy="30" r="4" fill="#6366F1" stroke="#000000" strokeWidth="1.5" />
      
      {/* Core Hub */}
      <circle cx="50" cy="50" r="5" fill="#6366F1" stroke="#000000" strokeWidth="2" />
    </motion.svg>
  );

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        userSelect: 'none',
        ...sx
      }}
    >
      {Hexagon}
      {variant === 'full' && (
        <Typography 
          sx={{ 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            color: '#FFFFFF', 
            fontSize: `${size * 0.55}px`, 
            lineHeight: 1, 
            textTransform: 'uppercase', 
            fontFamily: '"Space Grotesk", "Inter", sans-serif'
          }}
        >
          {current.label}
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
export { Logo };
