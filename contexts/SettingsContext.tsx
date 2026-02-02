import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  occlusionEnabled: boolean;
  setOcclusionEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [occlusionEnabled, setOcclusionEnabled] = useState(false);

  return (
    <SettingsContext.Provider value={{ occlusionEnabled, setOcclusionEnabled }}>
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
