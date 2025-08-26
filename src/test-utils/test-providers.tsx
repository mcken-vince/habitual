import React from 'react';
import { HabitsProvider } from '@/hooks/useHabits';
import { SettingsProvider } from '@/hooks/useSettings';

interface TestProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides all necessary contexts for testing
 */
export const TestProviders: React.FC<TestProvidersProps> = ({ children }) => {
  return (
    <SettingsProvider>
      <HabitsProvider>
        {children}
      </HabitsProvider>
    </SettingsProvider>
  );
};

/**
 * Custom render function that includes providers
 */
import { render, RenderOptions } from '@testing-library/react';

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
