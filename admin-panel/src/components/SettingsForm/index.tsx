import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { SettingsFormData } from '@/typings/Settings';

import Input from '@/components/Input';
import Select from '@/components/Select';
import IconWrapper from '@/components/IconWrapper';
import ImageSelector from '@/components/ImageSelector';
import FormError from '@/components/FormError';
import SaveButton from '@/components/Buttons/SaveButton';

interface SettingsFormProps {
  register: UseFormRegister<SettingsFormData>;
  errors: FieldErrors<SettingsFormData>;
  imagePreview: string | null;
  isSubmitting: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SettingsForm({
  register, errors, imagePreview, isSubmitting,
  handleFileChange, onSubmitAction
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
      </div>

      <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 flex items-center justify-end border-t border-gray-200 dark:border-zinc-700">
        <SaveButton isSubmitting={isSubmitting} customLabel={t('buttons.save_changes', { defaultValue: 'Save changes' })} />
      </div>
    </form>
  );
}
