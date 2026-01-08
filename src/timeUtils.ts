/**
 * Time utility functions for react-auto-time-theme
 * Handles time parsing, comparison, and boundary calculations
 */

import { Theme } from './types';

/**
 * Convert a time string (e.g., "07:00" or "7:00") to minutes from midnight
 * @param time - Time string in HH:MM format
 * @returns Minutes from midnight (0-1439)
 */
export const timeToMinutes = (time: string): number => {
  const parts = time.trim().split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid time format: "${time}". Expected HH:MM format.`);
  }

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time values: "${time}". Hours and minutes must be numbers.`);
  }

  if (hours < 0 || hours > 23) {
    throw new Error(`Invalid hour value: "${hours}". Hours must be between 0 and 23.`);
  }

  if (minutes < 0 || minutes > 59) {
    throw new Error(`Invalid minute value: "${minutes}". Minutes must be between 0 and 59.`);
  }

  return hours * 60 + minutes;
};

/**
 * Get the current time in minutes from midnight
 * @returns Minutes from midnight (0-1439)
 */
export const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Check if the current time is within the light mode period
 * Handles midnight crossing correctly
 * @param lightStart - Start time for light mode (e.g., "07:00")
 * @param darkStart - Start time for dark mode (e.g., "22:00")
 * @returns true if current time is in light mode period, false otherwise
 */
export const isLightTime = (lightStart: string, darkStart: string): boolean => {
  const currentMinutes = getCurrentMinutes();
  const lightStartMinutes = timeToMinutes(lightStart);
  const darkStartMinutes = timeToMinutes(darkStart);

  // Handle normal range (lightStart < darkStart, e.g., 07:00 to 22:00)
  if (lightStartMinutes < darkStartMinutes) {
    return currentMinutes >= lightStartMinutes && currentMinutes < darkStartMinutes;
  }

  // Handle midnight crossing (darkStart < lightStart, e.g., 22:00 to 07:00)
  // This means light mode spans midnight
  return currentMinutes >= lightStartMinutes || currentMinutes < darkStartMinutes;
};

/**
 * Get the theme based on current time and configuration
 * @param lightStart - Start time for light mode
 * @param darkStart - Start time for dark mode
 * @returns 'light' or 'dark' based on current time
 */
export const getThemeFromTime = (lightStart: string, darkStart: string): Theme => {
  return isLightTime(lightStart, darkStart) ? 'light' : 'dark';
};

/**
 * Calculate the next theme boundary time
 * @param lightStart - Start time for light mode
 * @param darkStart - Start time for dark mode
 * @returns Minutes from midnight of the next boundary
 */
export const getNextBoundary = (lightStart: string, darkStart: string): number => {
  const currentMinutes = getCurrentMinutes();
  const lightStartMinutes = timeToMinutes(lightStart);
  const darkStartMinutes = timeToMinutes(darkStart);

  if (lightStartMinutes < darkStartMinutes) {
    // Normal range
    if (currentMinutes < lightStartMinutes) {
      return lightStartMinutes;
    } else if (currentMinutes < darkStartMinutes) {
      return darkStartMinutes;
    } else {
      // After dark start, next is next day's light start
      return lightStartMinutes + 1440; // 24 hours in minutes
    }
  } else {
    // Midnight crossing (light mode spans midnight)
    if (currentMinutes >= lightStartMinutes || currentMinutes < darkStartMinutes) {
      // In light mode, next is dark start
      return darkStartMinutes;
    } else {
      // In dark mode, next is light start
      return lightStartMinutes;
    }
  }
};

/**
 * Calculate milliseconds until the next theme boundary
 * @param lightStart - Start time for light mode
 * @param darkStart - Start time for dark mode
 * @returns Milliseconds until next boundary
 */
export const getMsUntilNextBoundary = (lightStart: string, darkStart: string): number => {
  const currentMinutes = getCurrentMinutes();
  const nextBoundary = getNextBoundary(lightStart, darkStart);
  const minutesUntilBoundary = nextBoundary - currentMinutes;

  // Handle next day case
  const adjustedMinutes = minutesUntilBoundary < 0 ? minutesUntilBoundary + 1440 : minutesUntilBoundary;

  return adjustedMinutes * 60 * 1000;
};

/**
 * Validate time configuration
 * @param lightStart - Start time for light mode
 * @param darkStart - Start time for dark mode
 * @returns true if configuration is valid, false otherwise
 */
export const isValidTimeConfig = (lightStart: string, darkStart: string): boolean => {
  try {
    timeToMinutes(lightStart);
    timeToMinutes(darkStart);
    return true;
  } catch {
    return false;
  }
};
