import React from 'react';
import { useTranslation } from 'react-i18next';

import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';
import type { NewEducation } from '@/typings/Educations';

import Input from '@/components/Input';
import Select from '@/components/Select';
import ImageSelector from '@/components/ImageSelector';
import IconWrapper from '@/components/IconWrapper';
import Textarea from '@/components/Textarea';
import FormError from '@/components/FormError';
import SaveButton from '@/components/Buttons/SaveButton';

interface EducationFormProps {
  register: UseFormRegister<NewEducation>;
  errors: FieldErrors<NewEducation>;
  fields: FieldArrayWithId<NewEducation, "translations", "id">[];
  appendTranslation: () => void;
  removeTranslation: (index: number) => void;

  imagePreview: string | null;
  isSubmitting: boolean;
  globalError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EducationForm({
  register, errors, fields, appendTranslation, removeTranslation,
  imagePreview, isSubmitting, globalError,
  handleFileChange, onSubmitAction
}: EducationFormProps) {

  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmitAction} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  id="type"
                  label={t('forms.educations.labels.type', { defaultValue: 'Type' })}
                  options={['college', 'course', 'certification', 'bootcamp']}
                  translationGroup="forms.educations.types"
                  {...register('type')}
                />
                <FormError error={!!errors.type?.message} message={t(errors.type?.message as string)} />
              </div>

              <div>
                <Select
                  id="status"
                  label={t('forms.educations.labels.status', { defaultValue: 'Status' })}
                  options={['completed', 'in_progress', 'paused']}
                  translationGroup="forms.educations.statuses"
                  {...register('status')}
                />
                <FormError error={!!errors.status?.message} message={t(errors.status?.message as string)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="startDate"
                  label={t('forms.educations.labels.start_date', { defaultValue: 'Start Date' })}
                  type="date"
                  placeholder=""
                  {...register('startDate')}
                >
                  <IconWrapper>📅</IconWrapper>
                </Input>
                <FormError error={!!errors.startDate?.message} message={t(errors.startDate?.message as string)} />
              </div>

              <div>
                <Input
                  id="endDate"
                  label={t('forms.educations.labels.end_date', { defaultValue: 'End Date' })}
                  type="date"
                  placeholder=""
                  {...register('endDate')}
                >
                  <IconWrapper>📅</IconWrapper>
                </Input>
                <FormError error={!!errors.endDate?.message} message={t(errors.endDate?.message as string)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="durationHours"
                  type="number"
                  label={t('forms.educations.labels.duration', { defaultValue: 'Duration (Hours)' })}
                  placeholder={t('forms.educations.placeholders.duration', { defaultValue: 'Ex: 120' })}
                  {...register('durationHours')}
                >
                  <IconWrapper>⏱️</IconWrapper>
                </Input>
                <FormError error={!!errors?.durationHours} message={t(errors.durationHours?.message as string)} />
              </div>

              <div>
                <Input
                  id="certificateUrl"
                  label={t('forms.educations.labels.certificate_url', { defaultValue: 'Certificate URL' })}
                  type="url"
                  placeholder={t('forms.educations.placeholders.certificate_url', { defaultValue: 'https://...' })}
                  {...register('certificateUrl')}
                >
                  <IconWrapper>🔗</IconWrapper>
                </Input>
                <FormError error={!!errors.certificateUrl?.message} message={t(errors.certificateUrl?.message as string)} />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-zinc-700" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">{t('pages.educations.create.content_and_translations', { defaultValue: 'Content & Translations' })}</h3>
            <button type="button" onClick={appendTranslation} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1">
              {t('forms.educations.buttons.add_translation', { defaultValue: '+ Add Language' })}
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => {
              const fieldErrors = errors.translations?.[index];

              return (
                <div key={field.id} className="bg-zinc-50/50 dark:bg-zinc-900/50 p-5 rounded-lg border border-zinc-200 dark:border-zinc-700 relative group">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => removeTranslation(index)}
                      aria-label={t('forms.educations.buttons.delete_translation', { defaultValue: 'Delete' })}
                      title={t('forms.educations.buttons.delete_translation', { defaultValue: 'Delete' })}
                      className="cursor-pointer absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <Select
                        id={`language-${index}`}
                        label={t('forms.educations.labels.language', { defaultValue: 'Language' })}
                        options={['pt', 'en', 'es']}
                        translationGroup="global.languages"
                        disabled={index === 0}
                        {...register(`translations.${index}.language` as const)}
                      />
                      <FormError error={!!fieldErrors?.language?.message} message={t(fieldErrors?.language?.message as string)} />
                    </div>

                    <div className="md:col-span-1">
                      <Input
                        id={`institution-${index}`}
                        label={t('forms.educations.labels.institution', { defaultValue: 'Institution' })}
                        placeholder={t('forms.educations.placeholders.institution', { defaultValue: 'Ex: Harvard' })}
                        {...register(`translations.${index}.institution` as const)}
                      >
                        <IconWrapper>🏛️</IconWrapper>
                      </Input>
                      <FormError error={!!fieldErrors?.institution?.message} message={t(fieldErrors?.institution?.message as string)} />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        id={`name-${index}`}
                        label={t('forms.educations.labels.course_name', { defaultValue: 'Course Name' })}
                        placeholder={t('forms.educations.placeholders.course_name', { defaultValue: 'Ex: Computer Science' })}
                        {...register(`translations.${index}.name` as const)}
                      >
                        <IconWrapper>🎓</IconWrapper>
                      </Input>
                      <FormError error={!!fieldErrors?.name?.message} message={t(fieldErrors?.name?.message as string)} />
                    </div>

                    <div className="md:col-span-4 mt-2 flex flex-col gap-2">
                      <Textarea
                        id={`description-${index}`}
                        label={t('forms.educations.labels.description', { defaultValue: 'Description' })}
                        placeholder={t('forms.educations.placeholders.description', { defaultValue: 'Ex: Computer Science' })}
                        {...register(`translations.${index}.description` as const)}
                      />
                      <FormError error={!!fieldErrors?.description?.message} message={t(fieldErrors?.description?.message as string)} />
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
        <SaveButton isSubmitting={isSubmitting} customLabel={t('forms.educations.buttons.save_education', { defaultValue: 'Save Education' })} />
      </div>
    </form>
  );
}
