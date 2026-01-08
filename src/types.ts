/**
 * Theme types for react-auto-time-theme
 */

/**
 * Available theme values
 */
export type Theme = 'light' | 'dark';

/**
 * Available mode values
 * - 'auto': Theme switches automatically based on time
 * - 'light': Force light theme
 * - 'dark': Force dark theme
 */
export type Mode = 'auto' | 'light' | 'dark';

/**
 * Configuration options for AutoThemeProvider
 */
export interface ThemeConfig {
  /**
   * Start time for light mode (e.g., "07:00")
   * @default "07:00"
   */
  lightStart: string;

  /**
   * Start time for dark mode (e.g., "22:00")
   * @default "22:00"
   */
  darkStart: string;

  /**
   * Default mode when no stored preference exists
   * @default "auto"
   */
  defaultMode: Mode;

  /**
   * LocalStorage key for storing user preference
   * @default "auto-theme-mode"
   */
  storageKey: string;

  /**
   * DOM element to apply the data-theme attribute to
   * @default "html"
   */
  applyTo: 'html' | 'body';

  /**
   * Callback invoked when the theme changes
   * @param theme - The current theme ('light' or 'dark')
   * @param mode - The current mode ('auto', 'light', or 'dark')
   */
  onThemeChange?: (theme: Theme, mode: Mode) => void;
}

/**
 * Theme context value exposed by useAutoTheme hook
 */
export interface ThemeContextValue {
  /**
   * Current theme value ('light' or 'dark')
   */
  theme: Theme;

  /**
   * Current mode value ('auto', 'light', or 'dark')
   */
  mode: Mode;

  /**
   * Set the mode to 'light' (manual override)
   */
  setLight: () => void;

  /**
   * Set the mode to 'dark' (manual override)
   */
  setDark: () => void;

  /**
   * Set the mode to 'auto' (enables time-based switching)
   */
  setAuto: () => void;

  /**
   * Toggle between light and dark themes
   * (only affects theme, mode remains unchanged)
   */
  toggleTheme: () => void;
}

/**
 * Internal state for ThemeContext
 */
export interface ThemeState {
  mode: Mode;
  theme: Theme;
}
