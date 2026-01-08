/**
 * useAutoTheme hook for react-auto-time-theme
 * Provides theme state and control functions to components
 */

import { useContext, useCallback, useMemo } from 'react';
import { ThemeContext } from './AutoThemeProvider';
import { Theme, Mode, ThemeContextValue } from './types';

/**
 * Hook to access and control the auto theme
 * @returns Theme context value with current state and control functions
 * @throws Error if used outside of AutoThemeProvider
 */
export const useAutoTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      'useAutoTheme must be used within an AutoThemeProvider. ' +
      'Make sure your component is wrapped with <AutoThemeProvider>.'
    );
  }

  const { mode, theme, setMode } = context;

  /**
   * Set the mode to 'light' (manual override)
   */
  const setLight = useCallback(() => {
    setMode('light');
  }, [setMode]);

  /**
   * Set the mode to 'dark' (manual override)
   */
  const setDark = useCallback(() => {
    setMode('dark');
  }, [setMode]);

  /**
   * Set the mode to 'auto' (enables time-based switching)
   */
  const setAuto = useCallback(() => {
    setMode('auto');
  }, [setMode]);

  /**
   * Toggle between light and dark themes
   * (only affects theme, mode remains unchanged)
   */
  const toggleTheme = useCallback(() => {
    setMode(theme === 'light' ? 'dark' : 'light');
  }, [setMode, theme]);

  return useMemo(
    () => ({
      theme,
      mode,
      setLight,
      setDark,
      setAuto,
      toggleTheme,
    }),
    [theme, mode, setLight, setDark, setAuto, toggleTheme]
  );
};

/**
 * Hook to get only the current theme value
 * @returns Current theme ('light' or 'dark')
 */
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      'useTheme must be used within an AutoThemeProvider. ' +
      'Make sure your component is wrapped with <AutoThemeProvider>.'
    );
  }

  return context.theme;
};

/**
 * Hook to get only the current mode value
 * @returns Current mode ('auto', 'light', or 'dark')
 */
export const useMode = (): Mode => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      'useMode must be used within an AutoThemeProvider. ' +
      'Make sure your component is wrapped with <AutoThemeProvider>.'
    );
  }

  return context.mode;
};
