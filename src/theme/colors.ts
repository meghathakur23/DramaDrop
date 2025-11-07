/**
 * Color palette for DramaDrop app
 * Dark theme with neon blue and purple accents
 */

export const colors = {
  // Dark Backgrounds
  background: {
    primary: '#000000',
    secondary: '#0A0A0A',
    elevated: '#1A1A1A',
    card: '#1A1A1A',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },

  // Neon Blue Palette
  blue: {
    primary: '#00D4FF',
    secondary: '#0099FF',
    dark: '#0066CC',
    light: '#33E0FF',
  },
  pink: {
    primary: '#ff4db8',
  },
  // Neon Purple Palette
  purple: {
    primary: '#B026FF',
    secondary: '#7B2CBF',
    dark: '#5A1F8F',
    light: '#C855FF',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    tertiary: '#999999',
    disabled: '#666666',
  },

  // Accent Gradients (for use with LinearGradient)
  gradients: {
    bluePurple: ['#00D4FF', '#B026FF'],
    purpleBlue: ['#B026FF', '#00D4FF'],
    blueDark: ['#00D4FF', '#0066CC'],
    purpleDark: ['#B026FF', '#5A1F8F'],
  },

  // Border Colors
  border: {
    primary: '#333333',
    secondary: '#1A1A1A',
    accent: '#00D4FF',
  },

  // Status Colors
  status: {
    success: '#00FF88',
    error: '#FF3366',
    warning: '#FFAA00',
    info: '#00D4FF',
  },
} as const;

export type Colors = typeof colors;

