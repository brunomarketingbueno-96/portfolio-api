import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsService } from '@/services/settingsService';
import { UploadService } from '@/services/uploadService';

import { useImagePreview } from '@/hooks/useImagePreview';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema } from '../../../src/schemas/settings.schema';

import type { GlobalSettings, NewSettings } from '@/typings/Settings';

const initialForm: NewSettings = {
  theme: 'system',
  panelLanguage: 'en',
  siteUrl: '',
  publicEmail: '',
  logoUrl: '',
  customConfig: {}
};


export function useSettings(options?: { fetchOnMount?: boolean }) {
  const { t } = useTranslation();

  const [settings, setSettings] = useState<GlobalSettings>(null);
  const [loading, setLoading] = useState(!!options?.fetchOnMount);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NewSettings>({
    resolver: zodResolver(settingsSchema as never),
    defaultValues: initialForm
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SettingsService.get();

      const parsedData = {
        ...data,
        theme: data.theme ?? 'system',
        panelLanguage: data.panelLanguage ?? 'en',
        customConfig: data.customConfig ?? {},
        siteUrl: data.siteUrl ?? '',
        publicEmail: data.publicEmail ?? '',
        logoUrl: data.logoUrl ?? '',
      };

      setSettings(parsedData);
      reset(parsedData);
      setImagePreview(parsedData.logoUrl ?? null);

      return parsedData;
    } catch (error) {
      const err = error as ApiError;
      setGlobalError(err.error ? t(err.error) : t('api.error.unknown'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [reset, setImagePreview, t]);

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (options?.fetchOnMount) loadSettings();

  }, [options?.fetchOnMount, loadSettings]);

  const processFormSubmit = async (data: NewSettings, onSuccess?: (updated: NewSettings) => void) => {
    setGlobalError(null);
    try {
      let finalLogoUrl = imagePreview || '';

      if (selectedFile) {
        finalLogoUrl = await UploadService.uploadImage(selectedFile, 'settings', 'panel-logo');
      }

      const payload = {
        ...data,
        logoUrl: finalLogoUrl,
        customConfig: typeof data.customConfig === 'string'
          ? JSON.parse(data.customConfig || '{}')
          : data.customConfig,
      };

      const updated = await SettingsService.update(payload);

      setSettings(updated);
      setSelectedFile(null);

      if (onSuccess) onSuccess(updated);

    } catch (error) {
      const err = error as ApiError;
      setGlobalError(err.message || t('settings.error.update'));
    }
  };

  const updateSettings = (onSuccess?: (updated: NewSettings) => void) =>
    handleSubmit((data) => processFormSubmit(data, onSuccess));

  return {
    settings,
    loading,
    globalError,
    loadSettings,

    register,
    errors,
    isSubmitting,
    reset,
    updateSettings,

    imagePreview,
    handleFileChange,
    setImagePreview
  };
}
