import { useTranslation } from 'react-i18next';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';

import type { AIProvider } from '@/typings/AiProvider';

import SaveButton from '@/components/Buttons/SaveButton';
import FormError from '../FormError';
import Input from '@/components/Input';
import Select from '@/components/Select';
import IconWrapper from '../IconWrapper';

interface AiProviderFormProps {
  register: UseFormRegister<AIProvider>;
  errors: FieldErrors<AIProvider>;
  isSubmitting: boolean;
  onSubmitAction: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export default function AiProviderForm({
  register,
  errors,
  isSubmitting,
  onSubmitAction,
  isEditing,
  onCancelEdit,
}: AiProviderFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmitAction} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
        <div>
          <Input
            id="providerApiKeyName"
            label={t('settings.ai_providers.form.labels.name', { defaultValue: 'Key Name' })}
            type="text"
            autoComplete='off'
            placeholder={t('settings.ai_providers.form.placeholders.name', { defaultValue: 'Production Key' })}
            {...register('name')}
          >
            <IconWrapper>🔑</IconWrapper>
          </Input>
          <FormError error={!!errors.name} message={t(errors.name?.message as string)} />
        </div>

        <div>
          <Select
            translationGroup={'settings.ai_providers.providers'}
            id="provider"
            label={t('settings.ai_providers.form.labels.provider', { defaultValue: 'Provider' })}
            options={['groq', 'openai', 'gemini']}
            {...register('provider')}
          />
          <FormError error={!!errors.provider} message={t(errors.provider?.message as string)} />
        </div>

        <div className="md:col-span-2">
          <Input
            id="providerApiKey"
            label={t('settings.ai_providers.form.labels.key', { defaultValue: 'API Key' })}
            type="password"
            placeholder='••••••••••••••••••••••••••••••••'
            autoComplete='new-password'
            {...register('key')}
          >
            <IconWrapper>🔐</IconWrapper>
          </Input>
          <FormError error={!!errors.key} message={t(errors.key?.message as string)} />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="isActiveAi"
            {...register('isActive')}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
          />
          <label htmlFor="isActiveAi" className="text-sm font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer">
            {t('settings.ai_providers.form.labels.is_active', { defaultValue: 'Active' })}
          </label>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 flex gap-4 items-center justify-end border-t border-gray-200 dark:border-zinc-700">
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="
              px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer
              text-zinc-800 dark:text-zinc-100 text-sm font-medium rounded-lg transition-colors disabled:opacity-50
            "
          >
            {t('buttons.cancel', { defaultValue: 'Cancel' })}
          </button>
        )}

        <SaveButton isSubmitting={isSubmitting} customLabel={
          isEditing ?
            t('buttons.save_changes', { defaultValue: 'Save changes' }) :
            t('buttons.save', { defaultValue: 'Save' })
        } />
      </div>
    </form>
  );
}
