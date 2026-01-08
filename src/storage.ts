/**
 * Storage utility for react-auto-time-theme
 * Handles localStorage operations with error handling for SSR/compatibility
 */

import { Mode } from './types';

/**
 * Check if localStorage is available
 * Handles SSR environments and private browsing modes
 */
export const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get stored mode from localStorage
 * @param storageKey - The localStorage key to use
 * @returns The stored mode or null if not found
 */
export const getStoredMode = (storageKey: string): Mode | null => {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'auto' || stored === 'light' || stored === 'dark') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Store mode in localStorage
 * @param mode - The mode to store
 * @param storageKey - The localStorage key to use
 * @returns true if storage succeeded, false otherwise
 */
export const storeMode = (mode: Mode, storageKey: string): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(storageKey, mode);
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove stored mode from localStorage
 * @param storageKey - The localStorage key to use
 * @returns true if removal succeeded, false otherwise
 */
export const clearStoredMode = (storageKey: string): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(storageKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get stored mode with fallback
 * @param storageKey - The localStorage key to use
 * @param defaultMode - Default mode if nothing is stored
 * @returns The stored mode or default mode
 */
export const getStoredModeWithFallback = (storageKey: string, defaultMode: Mode): Mode => {
  return getStoredMode(storageKey) ?? defaultMode;
};
