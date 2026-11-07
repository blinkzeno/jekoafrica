/**
 * Jeko brand palette and typography.
 * Source of truth for the onboarding / welcome flow.
 */

export const JekoColors = {
  gradientFrom: '#0B3D36',
  gradientTo: '#0E7C66',

  white: '#FFFFFF',
  textSoft: 'rgba(188, 255, 233, 0.85)',
  textMuted: 'rgba(255, 255, 255, 0.9)',

  emerald: '#00614F',
  emeraldDeep: '#0B3D36',
  mint: '#97F4D9',
  accent: '#FD761A',

  surface10: 'rgba(255, 255, 255, 0.10)',
  surface15: 'rgba(255, 255, 255, 0.15)',
  surface30: 'rgba(255, 255, 255, 0.30)',
} as const;

export const JekoFonts = {
  regular: 'PlusJakartaSans_400Regular',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

export const JekoRadius = {
  button: 14,
  card: 16,
  pill: 999,
} as const;
