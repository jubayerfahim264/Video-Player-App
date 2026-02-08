/**
 * Simple UI state: e.g. show/hide Privacy Policy screen.
 * Avoids adding full navigation just for one extra screen.
 */
import React, { createContext, useCallback, useContext, useState } from 'react';

interface AppUiContextValue {
  showPrivacyPolicy: boolean;
  openPrivacyPolicy: () => void;
  closePrivacyPolicy: () => void;
}

const defaultValue: AppUiContextValue = {
  showPrivacyPolicy: false,
  openPrivacyPolicy: () => {},
  closePrivacyPolicy: () => {},
};

const AppUiContext = createContext<AppUiContextValue>(defaultValue);

export function AppUiProvider({ children }: { children: React.ReactNode }) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const openPrivacyPolicy = useCallback(() => setShowPrivacyPolicy(true), []);
  const closePrivacyPolicy = useCallback(() => setShowPrivacyPolicy(false), []);

  return (
    <AppUiContext.Provider
      value={{ showPrivacyPolicy, openPrivacyPolicy, closePrivacyPolicy }}
    >
      {children}
    </AppUiContext.Provider>
  );
}

export function useAppUi() {
  const context = useContext(AppUiContext);
  if (!context) {
    throw new Error('useAppUi must be used within AppUiProvider');
  }
  return context;
}
