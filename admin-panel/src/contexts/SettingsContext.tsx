import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

import { useSettings as useSettingsHook } from '@/hooks/useSettings';

import { z } from 'zod';
import { settingsSchema } from '../../../src/schemas/settings.schema';

type Settings = z.infer<typeof settingsSchema>;

interface SettingsContextType {
  globalSettings: Settings | null;
  isLoadingSettings: boolean;
  applyNewSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const mapLanguageToLocale = (lang: string) => {
  const map: Record<string, string> = { 'pt': 'pt-BR', 'en': 'en-US', 'es': 'es-ES' };
  return map[lang] || 'en-US';
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { i18n } = useTranslation();

  const { settings, loading, loadSettings } = useSettingsHook();

  useEffect(() => {
    if (!isAuthenticated) return;

    loadSettings().then((data) => {
      if (data?.panelLanguage) {
        const targetLocale = mapLanguageToLocale(data.panelLanguage);

        // TRAVA 1: Só dispara a mudança de idioma se for realmente diferente.
        if (i18n.language !== targetLocale) {
          i18n.changeLanguage(targetLocale);
        }
      }
    });

  }, [isAuthenticated]);

  const applyNewSettings = (updated: Settings) => {
    if (updated.panelLanguage) {
      i18n.changeLanguage(mapLanguageToLocale(updated.panelLanguage));
    }
    loadSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        globalSettings: settings,
        isLoadingSettings: loading,
        applyNewSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext deve ser usado dentro de um SettingsProvider');
  }
  return context;
}
