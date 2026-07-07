import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

import Input from '@/components/Input';
import Select from '@/components/Select';
import IconWrapper from '@/components/IconWrapper';
import ImageSelector from '@/components/ImageSelector';

import { z } from 'zod';
import { settingsSchema } from '../../../../src/schemas/settings.schema';
import FormError from '../FormError';

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  register: UseFormRegister<SettingsFormData>;
  errors: FieldErrors<SettingsFormData>;
  imagePreview: string | null;
  isSubmitting: boolean;
  globalError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
}

export default function SettingsForm({
  register, errors, imagePreview, isSubmitting, globalError,
  handleFileChange, onSubmitAction, submitButtonText
}: SettingsFormProps) {

  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmitAction} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector
            imagePreview={imagePreview}
            onFileChange={handleFileChange}
            label={t('settings.form.labels.logo', { defaultValue: 'Panel Logo (Favicon)' })}
          />

          <div className="space-y-4 flex flex-col justify-center">
            <Input
              id="siteUrl"
              label={t('settings.form.labels.site_url', { defaultValue: 'Website URL' })}
              type="url"
              placeholder={t('settings.form.placeholders.site_url', { defaultValue: 'https://mywebsite.com' })}
              {...register('siteUrl')}
            >
              <IconWrapper>🌐</IconWrapper>
            </Input>
            <FormError error={!!errors.siteUrl} message={t(errors.siteUrl?.message as string)} />


            <Input
              id="publicEmail"
              label={t('settings.form.labels.public_email', { defaultValue: 'Public Email' })}
              type="email"
              placeholder={t('settings.form.placeholders.public_email', { defaultValue: 'myemail@domain.com' })}
              {...register('publicEmail')}
            >
              <IconWrapper>📧</IconWrapper>
            </Input>
            <FormError error={!!errors.publicEmail} message={t(errors.publicEmail?.message as string)} />
          </div>
        </div>

        <hr className="border-gray-200 dark:border-zinc-700" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Select
            id="theme"
            label={t('settings.form.labels.theme', { defaultValue: 'Theme' })}
            options={['light', 'dark', 'system']}
            translationGroup="settings.themes"
            {...register('theme')}
          />

          <Select
            id="panelLanguage"
            label={t('settings.form.labels.panel_language', { defaultValue: 'Panel Language' })}
            options={['pt', 'en', 'es']}
            translationGroup="languages"
            {...register('panelLanguage')}
          />
        </div>

        {globalError && <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-red-700 dark:text-red-400 text-sm">{globalError}</div>}
      </div>

      <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 flex items-center justify-end border-t border-gray-200 dark:border-zinc-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? t('buttons.saving', { defaultValue: 'Saving...' }) : submitButtonText}
        </button>
      </div>
    </form>
  );
}
