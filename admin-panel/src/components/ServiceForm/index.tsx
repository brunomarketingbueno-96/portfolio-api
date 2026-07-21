import { useTranslation } from 'react-i18next';

import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';
import type { NewService } from '@/typings/Services';

import Input from '@/components/Input';
import Select from '@/components/Select';
import ImageSelector from '@/components/ImageSelector';
import IconWrapper from '@/components/IconWrapper';
import FormError from '@/components/FormError';
import Textarea from '@/components/Textarea';

import SaveButton from '@/components/Buttons/SaveButton';

interface ServiceFormProps {
  register: UseFormRegister<NewService>;
  errors: FieldErrors<NewService>;
  fields: FieldArrayWithId<NewService, "translations", "id">[];
  appendTranslation: () => void;
  removeTranslation: (index: number) => void;

  imagePreview: string | null;
  isSubmitting: boolean;
  globalError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ServiceForm({
  register, errors, fields, appendTranslation, removeTranslation,
  imagePreview, isSubmitting, globalError,
  handleFileChange, onSubmitAction
}: ServiceFormProps) {

  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmitAction} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />

          <div className="space-y-4 flex flex-col justify-center">
            <Input
              id="link"
              label={t('forms.services.labels.link', { defaultValue: 'Service Link' })}
              type="url"
              placeholder={t('forms.services.placeholders.link', { defaultValue: 'https://example.com/service' })}
              {...register('link')}
            >
              <IconWrapper>🔗</IconWrapper>
            </Input>
            <FormError error={!!errors.link} message={t(errors.link?.message as string)} />

            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 italic">
              {t('forms.services.labels.info_link', { defaultValue: '* Optional: Insert a link to the service for more information.' })}
            </p>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-zinc-700" />

        <div>
          <div className="flex items-center justify-between mb-4">

            <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">
              {t('pages.services.create.content_and_translations', { defaultValue: 'Translations & Content' })}
            </h3>

            <button type="button" onClick={appendTranslation} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1">
              {t('forms.services.buttons.add_translation', { defaultValue: '+ Add Language' })}
            </button>

          </div>

          <div className="space-y-6">
            {fields.map((field, index) => {
              const fieldErrors = errors.translations?.[index];

              return (
                <div key={field.id} className="bg-zinc-50/50 dark:bg-zinc-900/50 p-5 rounded-lg border border-zinc-200 dark:border-zinc-700 relative group">
                  {index !== 0 && (
                    <button type="button" onClick={() => removeTranslation(index)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors">✕</button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <Select
                        id={`language-${index}`}
                        label={t('forms.services.labels.language', { defaultValue: 'Language' })}
                        options={['pt', 'en', 'es']}
                        translationGroup="global.languages"
                        disabled={index === 0}
                        {...register(`translations.${index}.language` as const)}
                      />
                      <FormError error={!!fieldErrors?.language} message={t(fieldErrors?.language?.message as string)} />
                    </div>

                    <div className="md:col-span-3">
                      <Input
                        id={`title-${index}`}
                        label={t('forms.services.labels.title', { defaultValue: 'Service Title' })}
                        placeholder={t('forms.services.placeholders.title', { defaultValue: 'Ex: Web Design' })}
                        {...register(`translations.${index}.title` as const)}
                      >
                        <IconWrapper>🛠️</IconWrapper>
                      </Input>
                      <FormError error={!!fieldErrors?.title} message={t(fieldErrors?.title?.message as string)} />
                    </div>

                    <div className="md:col-span-4 mt-2 flex flex-col gap-2">
                      <Textarea
                        id={`description-${index}`}
                        label={t('forms.services.labels.description', { defaultValue: 'Service Description' })}
                        placeholder={t('forms.services.placeholders.description', { defaultValue: 'Describe the service...' })}
                        {...register(`translations.${index}.description` as const)}
                      />
                      <FormError error={!!fieldErrors?.description} message={t(fieldErrors?.description?.message as string)} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {globalError && <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-red-700 dark:text-red-400 text-sm">{globalError}</div>}
      </div>

      <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 flex items-center justify-end border-t border-gray-200 dark:border-zinc-700">
        <SaveButton isSubmitting={isSubmitting} customLabel={t('forms.services.buttons.save_service', { defaultValue: 'Save Service' })} />
      </div>
    </form>
  );
}
