/**
 * react-auto-time-theme
 * A lightweight React npm package that automatically switches between light and
 * dark themes based on the user's local time, with full manual override support.
 */

// Re-export types
export type {
  Theme,
  Mode,
  ThemeConfig,
  ThemeContextValue,
} from './types';

// Re-export components
export { AutoThemeProvider, default as AutoThemeProviderDefault } from './AutoThemeProvider';

// Re-export hooks
export { useAutoTheme, useTheme, useMode } from './useAutoTheme';

// Re-export utilities
export {
  timeToMinutes,
  getCurrentMinutes,
  isLightTime,
  getThemeFromTime,
  getNextBoundary,
  getMsUntilNextBoundary,
  isValidTimeConfig,
} from './timeUtils';

export {
  isStorageAvailable,
  getStoredMode,
  storeMode,
  clearStoredMode,
  getStoredModeWithFallback,
} from './storage';

export {
  DEFAULT_LIGHT_START,
  DEFAULT_DARK_START,
  DEFAULT_STORAGE_KEY,
  DEFAULT_APPLY_TO,
  DEFAULT_MODE,
  DEFAULT_CONFIG,
} from './constants';
