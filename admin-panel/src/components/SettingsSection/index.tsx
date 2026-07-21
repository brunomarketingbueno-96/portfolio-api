import { useTranslation } from 'react-i18next';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { Settings } from '@/typings/Settings';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import SettingsForm from '@/components/SettingsForm';
import GlobalError from '@/components/GlobalError';

interface SettingsSectionProps {
  register: UseFormRegister<Settings>;
  errors: FieldErrors<Settings>;
  imagePreview: string | null;
  isSubmitting: boolean;
  globalError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SettingsSection({
  register,
  errors,
  imagePreview,
  isSubmitting,
  globalError,
  handleFileChange,
  onSubmitAction
}: SettingsSectionProps) {

  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-8 shadow-sm">
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-700 pb-4">
        <Heading level={2} title={t('pages.settings.sections.system.title', { defaultValue: 'System Settings' })} />
        <SubTitle content={t('pages.settings.sections.system.description', { defaultValue: 'Configure general settings for your panel.' })} />
      </div>

      <GlobalError error={globalError} message={globalError as string} />

      <SettingsForm
        register={register}
        errors={errors}
        imagePreview={imagePreview}
        isSubmitting={isSubmitting}
        handleFileChange={handleFileChange}
        onSubmitAction={onSubmitAction}
      />
    </div >
  );
}
