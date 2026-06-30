import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useSettingsContext } from '@/contexts/SettingsContext';
import { useSettings } from '@/hooks/useSettings';

import SettingsForm from '@/components/SettingsForm';
import Background from '@/components/Background';

export default function Settings() {
  const { t } = useTranslation();

  const { globalSettings, isLoadingSettings, applyNewSettings } = useSettingsContext();

  const {
    register,
    errors,
    isSubmitting,
    globalError,
    updateSettings,
    imagePreview,
    handleFileChange,
    reset,
    setImagePreview
  } = useSettings();

  useEffect(() => {
    if (globalSettings) {
      reset({
        ...globalSettings,
        customConfig: globalSettings.customConfig ?? {},
        siteUrl: globalSettings.siteUrl ?? '',
        publicEmail: globalSettings.publicEmail ?? '',
        logoUrl: globalSettings.logoUrl ?? '',
      });

      setImagePreview(globalSettings.logoUrl ?? null);
    }
  }, [globalSettings, reset, setImagePreview]);

  const onSubmitAction = updateSettings((updatedSettings) => {
    applyNewSettings(updatedSettings);
  });

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">

      <Background />

      {isLoadingSettings ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <main className="flex-1 px-8 py-8 w-full space-y-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
                {t('settings.title', { defaultValue: 'Settings' })}
              </h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                {t('settings.description', { defaultValue: 'Manage the panel settings.' })}
              </p>
            </div>
            <Link to="/panel" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors">
              ← {t('buttons.back_to_panel', { defaultValue: 'Back to panel' })}
            </Link>
          </div>

          <SettingsForm
            register={register}
            errors={errors}
            imagePreview={imagePreview}
            isSubmitting={isSubmitting}
            globalError={globalError}
            handleFileChange={handleFileChange}
            onSubmitAction={onSubmitAction}
            submitButtonText={t('buttons.save_changes', { defaultValue: 'Save changes' })}
          />
        </main>
      )}
    </div>
  );
}
