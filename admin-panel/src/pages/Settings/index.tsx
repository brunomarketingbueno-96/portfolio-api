import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from '@/contexts/SettingsContext';

import { useSettings } from '@/hooks/useSettings';
import { useAiProviders } from '@/hooks/useAiProviders';

import Background from '@/components/Background';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';

import PageLoader from '@/components/PageLoader';

import BackButton from '@/components/Buttons/BackButton';

import SettingsSection from '@/components/SettingsSection';

import AiProviderSection from '@/components/AiProviderSection';
import AiProvidersList from '@/components/AiProviderList';

import type { AIProvider } from '@/typings/AiProvider';

export default function Settings() {
  const { t } = useTranslation();
  const { globalSettings, isLoadingSettings, applyNewSettings, refreshSettings } = useSettingsContext();

  const [editingProviderId, setEditingProviderId] = useState<string | null | undefined>(null);

  const {
    register,
    errors,
    isSubmitting,
    globalError,
    updateSettings,
    imagePreview,
    handleFileChange,
    setImagePreview,
    reset
  } = useSettings();

  const {
    register: registerAi,
    errors: errorsAi,
    isSubmitting: isSubmittingAi,
    globalError: globalErrorAi,
    createAiProvider,
    updateAiProvider,
    deleteAiProvider,
    reset: resetAi
  } = useAiProviders();

  const onSubmitAction = updateSettings((updatedSettings) => {
    applyNewSettings(updatedSettings);
  });

  const onAiSubmitAction = editingProviderId
    ? updateAiProvider(editingProviderId, () => {
      setEditingProviderId(null);
      refreshSettings();
      resetAi();
    })
    : createAiProvider(() => {
      refreshSettings();
      resetAi();
    });

  const handleEditAiProvider = (provider: AIProvider) => {
    setEditingProviderId(provider.id);
    resetAi(provider);
  };

  const handleCancelEditAiProvider = () => {
    setEditingProviderId(null);
    resetAi();
  };

  useEffect(() => {
    if (globalSettings) {
      reset({
        theme: globalSettings.theme ?? 'system',
        panelLanguage: globalSettings.panelLanguage ?? 'en',
        customConfig: globalSettings.customConfig ?? {},
        siteUrl: globalSettings.siteUrl ?? '',
        publicEmail: globalSettings.publicEmail ?? '',
        logoUrl: globalSettings.logoUrl ?? '',
      });

      setImagePreview(globalSettings.logoUrl ?? null);
    }
  }, [globalSettings, reset, setImagePreview]);

  const render = () => {
    if (isLoadingSettings) return <PageLoader />;

    return (
      <div className="space-y-10">

        <SettingsSection
          register={register}
          errors={errors}
          imagePreview={imagePreview}
          isSubmitting={isSubmitting}
          globalError={globalError}
          handleFileChange={handleFileChange}
          onSubmitAction={onSubmitAction}
        />

        <AiProviderSection
          register={registerAi}
          errors={errorsAi}
          isSubmitting={isSubmittingAi}
          globalError={globalErrorAi}
          onSubmitAction={onAiSubmitAction}
          isEditing={!!editingProviderId}
          onCancelEdit={handleCancelEditAiProvider}
        >
          <AiProvidersList
            providers={globalSettings?.aiKeys || []}
            onEdit={handleEditAiProvider}
            onDelete={deleteAiProvider}
          />
        </AiProviderSection>
      </div>
    );
  };

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />
      <main className="flex-1 px-8 py-8 w-full space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <Heading level={1} title={t('pages.settings.title', { defaultValue: 'Settings' })} />
            <SubTitle content={t('pages.settings.description', { defaultValue: 'Manage the panel settings.' })} />
          </div>
          <BackButton to={{ pathname: '/panel' }} label={t('global.buttons.back_to_panel', { defaultValue: 'Back to panel' })} />
        </div>

        {render()}
      </main>
    </div>
  );
}
