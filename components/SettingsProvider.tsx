import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DisplayOrder, Settings } from '../global';
import { getSettings, storeSettings } from '../database/db.config';

const SettingContext = createContext<{
  settings: Settings
  saveSettings: (settings: Settings) => void;
}>({
  settings: {
    displayOrder: DisplayOrder.FrontFirst,
    shuffled: false,
  },
  saveSettings: () => {},
});

export function useSettings() {
  const value = useContext(SettingContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSettings must be wrapped in a <SettingsProvider />');
    }
  }
  return value;
}

export function SettingsProvider(props: PropsWithChildren) {
  const [settings, setSettings] = useState<Settings>({
    displayOrder: DisplayOrder.FrontFirst,
    shuffled: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const oldSettings: Settings = await getSettings();
    if (oldSettings) {
      setSettings(oldSettings);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    setSettings(newSettings)
    await storeSettings(newSettings);
  };

  return (
    <SettingContext.Provider
      value={{
        settings,
        saveSettings,
      }}
    >
      {props.children}
    </SettingContext.Provider>
  );
}
