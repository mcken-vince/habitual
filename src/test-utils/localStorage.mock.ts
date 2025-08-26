/**
 * Utilities for working with localStorage mocks in tests
 */

import { localStorageMock } from '@/setupTests';

/**
 * Helper to setup localStorage with predefined data
 */
export const setupLocalStorage = (data: Record<string, any> = {}) => {
  localStorageMock.getItem.mockImplementation((key: string) => {
    return data[key] ? JSON.stringify(data[key]) : null;
  });
};

/**
 * Helper to verify localStorage calls
 */
export const expectLocalStorageSetItem = (key: string, value: any) => {
  expect(localStorageMock.setItem).toHaveBeenCalledWith(
    key,
    JSON.stringify(value)
  );
};

/**
 * Helper to verify localStorage getItem calls
 */
export const expectLocalStorageGetItem = (key: string) => {
  expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
};

/**
 * Clear all localStorage mock calls
 */
export const clearLocalStorageMock = () => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
};

/**
 * Mock localStorage to return specific habits data
 */
export const mockHabitsInLocalStorage = (habits: any[]) => {
  setupLocalStorage({
    'habits': habits,
  });
};

/**
 * Mock localStorage to return specific settings data
 */
export const mockSettingsInLocalStorage = (settings: any) => {
  setupLocalStorage({
    'settings': settings,
  });
};
