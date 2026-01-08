/**
 * AutoThemeProvider for react-auto-time-theme
 * Context provider that manages theme state and scheduling
 */

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { ThemeConfig, Theme, Mode, ThemeContextValue, ThemeState } from './types';
import { DEFAULT_CONFIG } from './constants';
import {
  getThemeFromTime,
  getMsUntilNextBoundary,
  isValidTimeConfig,
} from './timeUtils';
import { getStoredModeWithFallback, storeMode, clearStoredMode } from './storage';
import { VISIBILITY_CHANGE_EVENT } from './constants';

/**
 * Theme context type
 */
interface ThemeContextType extends ThemeContextValue {
  setMode: (mode: Mode) => void;
}

/**
 * Create context with null as initial value
 */
export const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Apply theme to DOM element
 * @param theme - Theme to apply
 * @param applyTo - Target element selector
 */
const applyThemeToDom = (theme: Theme, applyTo: 'html' | 'body'): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const target = applyTo === 'html' ? document.documentElement : document.body;
  if (target) {
    target.setAttribute('data-theme', theme);
  }
};

/**
 * Calculate theme based on mode
 * @param mode - Current mode
 * @param config - Theme configuration
 * @returns Calculated theme
 */
const calculateTheme = (mode: Mode, config: ThemeConfig): Theme => {
  if (mode === 'light') {
    return 'light';
  }
  if (mode === 'dark') {
    return 'dark';
  }
  // mode === 'auto'
  return getThemeFromTime(config.lightStart, config.darkStart);
};

/**
 * AutoThemeProvider Props
 */
interface AutoThemeProviderProps {
  /** Theme configuration options */
  config?: Partial<ThemeConfig>;
  /** Child components */
  children: React.ReactNode;
}

/**
 * AutoThemeProvider component
 * Manages theme state, scheduling, and DOM updates
 */
export const AutoThemeProvider: React.FC<AutoThemeProviderProps> = ({
  config = {},
  children,
}) => {
  // Merge config with defaults
  const mergedConfig: ThemeConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  // Validate time config
  if (!isValidTimeConfig(mergedConfig.lightStart, mergedConfig.darkStart)) {
    console.warn(
      'AutoThemeProvider: Invalid time configuration. ' +
      'Using default values instead.'
    );
    mergedConfig.lightStart = DEFAULT_CONFIG.lightStart;
    mergedConfig.darkStart = DEFAULT_CONFIG.darkStart;
  }

  // State for mode and theme
  const [state, setState] = useState<ThemeState>(() => {
    const storedMode = getStoredModeWithFallback(
      mergedConfig.storageKey,
      mergedConfig.defaultMode
    );
    const theme = calculateTheme(storedMode, mergedConfig);
    return {
      mode: storedMode,
      theme,
    };
  });

  // Ref for timeout to enable cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Update theme and apply to DOM
   */
  const updateTheme = useCallback(
    (newMode: Mode, newTheme: Theme) => {
      setState({ mode: newMode, theme: newTheme });
      applyThemeToDom(newTheme, mergedConfig.applyTo);
      
      // Call onThemeChange callback if provided
      if (mergedConfig.onThemeChange) {
        mergedConfig.onThemeChange(newTheme, newMode);
      }
    },
    [mergedConfig]
  );

  /**
   * Set mode and update storage
   */
  const setMode = useCallback(
    (newMode: Mode) => {
      const newTheme = calculateTheme(newMode, mergedConfig);

      if (newMode === 'auto') {
        // When switching to auto, clear stored preference
        clearStoredMode(mergedConfig.storageKey);
      } else {
        // Store manual preference
        storeMode(newMode, mergedConfig.storageKey);
      }

      updateTheme(newMode, newTheme);
    },
    [mergedConfig, updateTheme]
  );

  /**
   * Schedule next theme check
   */
  const scheduleNextCheck = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only schedule if in auto mode
    if (state.mode !== 'auto') {
      return;
    }

    const msUntilBoundary = getMsUntilNextBoundary(
      mergedConfig.lightStart,
      mergedConfig.darkStart
    );

    // Ensure we don't schedule too far in the future
    const safeMsUntilBoundary = Math.min(msUntilBoundary, 24 * 60 * 60 * 1000);

    timeoutRef.current = setTimeout(() => {
      const newTheme = getThemeFromTime(
        mergedConfig.lightStart,
        mergedConfig.darkStart
      );
      
      setState((prevState) => {
        // Only update if we're still in auto mode
        if (prevState.mode !== 'auto') {
          return prevState;
        }

        // Only update if theme actually changed
        if (prevState.theme === newTheme) {
          return prevState;
        }

        applyThemeToDom(newTheme, mergedConfig.applyTo);
        
        if (mergedConfig.onThemeChange) {
          mergedConfig.onThemeChange(newTheme, 'auto');
        }

        return { ...prevState, theme: newTheme };
      });

      // Schedule next check
      scheduleNextCheck();
    }, safeMsUntilBoundary);
  }, [state.mode, mergedConfig, updateTheme]);

  /**
   * Handle visibility change (tab focus)
   */
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible' && state.mode === 'auto') {
      // Recalculate theme when tab becomes visible
      const newTheme = getThemeFromTime(
        mergedConfig.lightStart,
        mergedConfig.darkStart
      );

      setState((prevState) => {
        if (prevState.theme === newTheme) {
          return prevState;
        }

        applyThemeToDom(newTheme, mergedConfig.applyTo);
        
        if (mergedConfig.onThemeChange) {
          mergedConfig.onThemeChange(newTheme, 'auto');
        }

        return { ...prevState, theme: newTheme };
      });
    }
  }, [state.mode, mergedConfig]);

  // Initial theme application on mount
  useEffect(() => {
    applyThemeToDom(state.theme, mergedConfig.applyTo);
  }, []);

  // Setup and cleanup for scheduling and event listeners
  useEffect(() => {
    // Schedule next check
    scheduleNextCheck();

    // Add visibility change listener
    document.addEventListener(VISIBILITY_CHANGE_EVENT, handleVisibilityChange);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener(VISIBILITY_CHANGE_EVENT, handleVisibilityChange);
    };
  }, [scheduleNextCheck, handleVisibilityChange]);

  // Update schedule when config changes
  useEffect(() => {
    if (state.mode === 'auto') {
      scheduleNextCheck();
    }
  }, [mergedConfig.lightStart, mergedConfig.darkStart, state.mode, scheduleNextCheck]);

  // Context value
  const contextValue: ThemeContextType = {
    theme: state.theme,
    mode: state.mode,
    setMode,
    setLight: () => setMode('light'),
    setDark: () => setMode('dark'),
    setAuto: () => setMode('auto'),
    toggleTheme: () => setMode(state.theme === 'light' ? 'dark' : 'light'),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default AutoThemeProvider;
