/**
 * Default configuration constants for react-auto-time-theme
 */

import { ThemeConfig } from './types';

/**
 * Default light mode start time (7:00 AM)
 */
export const DEFAULT_LIGHT_START = '07:00';

/**
 * Default dark mode start time (10:00 PM)
 */
export const DEFAULT_DARK_START = '22:00';

/**
 * Default storage key for persisting theme preference
 */
export const DEFAULT_STORAGE_KEY = 'auto-theme-mode';

/**
 * Default target element selector for applying theme
 */
export const DEFAULT_APPLY_TO = 'html' as const;

/**
 * Default mode when no preference is stored
 */
export const DEFAULT_MODE: 'auto' = 'auto';

/**
 * Complete default configuration
 */
export const DEFAULT_CONFIG: Omit<ThemeConfig, 'onThemeChange'> = {
  lightStart: DEFAULT_LIGHT_START,
  darkStart: DEFAULT_DARK_START,
  defaultMode: DEFAULT_MODE,
  storageKey: DEFAULT_STORAGE_KEY,
  applyTo: DEFAULT_APPLY_TO,
};

/**
 * Event name for visibility change detection
 */
export const VISIBILITY_CHANGE_EVENT = 'visibilitychange';

/**
 * Event name for time change detection (if supported)
 */
export const TIME_CHANGE_EVENT = 'timeupdate';

/**
 * Minimum interval for checking theme boundaries (in milliseconds)
 * This prevents excessive re-checks
 */
export const MIN_CHECK_INTERVAL = 60000; // 1 minute
