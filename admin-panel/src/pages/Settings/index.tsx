import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useSettingsContext } from '@/contexts/SettingsContext';
import { useSettings } from '@/hooks/useSettings';

import SettingsForm from '@/components/SettingsForm';

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
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {isLoadingSettings ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <main className="flex-1 px-8 py-8 w-full space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('settings.title', { defaultValue: 'Settings' })}
              </h1>
              <p className="text-sm text-gray-500">
                {t('settings.description', { defaultValue: 'Manage the panel settings.' })}
              </p>
            </div>
            <Link to="/panel" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
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
