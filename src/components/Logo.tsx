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
  const ecosystemPrimary = '#6366F1';
  const isEcosystemBrand = app === 'root' || app === 'accounts' || app === 'kylrix';
  
  const leftColor = isEcosystemBrand ? '#FFFFFF' : ecosystemPrimary;
  const rightColor = isEcosystemBrand ? ecosystemPrimary : current.accent;
  const cutoutColor = '#0A0908'; // Matches pitch-black background exactly

  const renderCutout = () => {
    switch (app) {
      case 'note':
      case 'vault':
      case 'flow':
      case 'connect':
        return (
          <rect
            x="38"
            y="38"
            width="24"
            height="24"
            fill={cutoutColor}
            transform="rotate(45 50 50)"
          />
        );
      case 'root':
      default:
        return <polygon points="50,38 62,50 50,62 38,50" fill={cutoutColor} />;
    }
  };

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
      {/* Left Hemisphere */}
      <polygon
        points="50,10 15,30 15,70 50,90"
        fill={leftColor}
        style={{ transition: 'fill 0.4s ease' }}
      />
      {/* Right Hemisphere */}
      <polygon
        points="50,10 85,30 85,70 50,90"
        fill={rightColor}
        style={{ transition: 'fill 0.4s ease' }}
      />
      {/* Center Cutout */}
      {renderCutout()}
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
