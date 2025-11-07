/**
 * Main theme export for DramaDrop app
 * Combines colors, typography, and spacing
 */

import {colors, Colors} from './colors';
import {typography, Typography} from './typography';
import {spacing, borderRadius, shadows, Spacing, BorderRadius, Shadows} from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;

// Export individual types
export type {Colors, Typography, Spacing, BorderRadius, Shadows};

// Export individual constants for convenience
export {colors, typography, spacing, borderRadius, shadows};

