import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface Settings {
  // Add your settings fields here
  theme?: "light" | "dark";
  notificationsEnabled?: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updated: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: "light",
  notificationsEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  const updateSettings = (updated: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};