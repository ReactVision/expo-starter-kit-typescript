import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  occlusionEnabled: boolean;
  setOcclusionEnabled: (enabled: boolean) => void;
  occlusionSupported: boolean | null;
  setOcclusionSupported: (supported: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [occlusionEnabled, setOcclusionEnabled] = useState(false);
  const [occlusionSupported, setOcclusionSupported] = useState<boolean | null>(
    null
  );

  return (
    <SettingsContext.Provider
      value={{
        occlusionEnabled,
        setOcclusionEnabled,
        occlusionSupported,
        setOcclusionSupported,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
