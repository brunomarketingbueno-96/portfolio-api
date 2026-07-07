import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from '@/contexts/SettingsContext';
import { useSettings } from '@/hooks/useSettings';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import Background from '@/components/Background';

import PageLoader from '@/components/PageLoader';
import SettingsForm from '@/components/SettingsForm';

import BackButton from '@/components/Buttons/BackButton';

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

  const render = () => {
    if (isLoadingSettings) return <PageLoader />;

    return (
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
    )
  }

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />
      <main className="flex-1 px-8 py-8 w-full space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <Heading level={1} title={t('settings.title', { defaultValue: 'Settings' })} />
            <SubTitle content={t('settings.description', { defaultValue: 'Manage the panel settings.' })} />
          </div>
          <BackButton to={{ pathname: '/panel' }} label={t('buttons.back_to_panel', { defaultValue: 'Back to panel' })} />
        </div>

        {render()}
      </main>
    </div>
  );
}
