import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';

import ImageSelector from '@/components/ImageSelector';
import Input from '@/components/Input';
import Select from '@/components/Select';
import IconWrapper from '@/components/IconWrapper';
import Textarea from '@/components/Textarea';

import FormError from '@/components/FormError';

import SaveButton from '@/components/Buttons/SaveButton';

import { z } from 'zod';
import { projectSchema } from '../../../../src/schemas/projects.schema';

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  fields: FieldArrayWithId<ProjectFormData, "translations", "id">[];
  appendTranslation: () => void;
  removeTranslation: (index: number) => void;

  imagePreview: string | null;
  isSubmitting: boolean;
  globalError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProjectForm({
  register, errors, fields, appendTranslation, removeTranslation,
  imagePreview, isSubmitting, globalError,
  handleFileChange, onSubmitAction
}: ProjectFormProps) {

  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmitAction} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />

          <div className="space-y-4 flex flex-col justify-center">
            <div>
              <Input
                id="liveUrl"
                label={t('projects.form.labels.liveUrl', { defaultValue: 'Live URL' })}
                type="url"
                placeholder={t('projects.form.placeholders.live_url', { defaultValue: 'https://myproject.com' })}
                {...register('liveUrl')}
              >
                <IconWrapper>🌐</IconWrapper>
              </Input>
              <FormError error={!!errors.liveUrl} message={t(errors.liveUrl?.message as string)} />
            </div>

            <div>
              <Input
                id="repoUrl"
                label={t('projects.form.labels.repoUrl', { defaultValue: 'Repository URL' })}
                type="url"
                placeholder={t('projects.form.placeholders.repo_url', { defaultValue: 'https://github.com/...' })}
                {...register('repoUrl')}
              >
                <IconWrapper>📦</IconWrapper>
              </Input>
              <FormError error={!!errors.repoUrl} message={t(errors.repoUrl?.message as string)} />
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-zinc-700" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">{t('projects.form.titles.translations', { defaultValue: 'Content & Translations' })}</h3>
            <button type="button" onClick={appendTranslation} className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1">
              {t('buttons.add_language', { defaultValue: '+ Add Language' })}
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
                      aria-label={t('buttons.delete', { defaultValue: 'Delete' })}
                      title={t('buttons.delete', { defaultValue: 'Delete' })}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <Select
                        id={`language-${index}`}
                        label={t('projects.form.labels.language', { defaultValue: 'Language' })}
                        options={['pt', 'en', 'es']}
                        translationGroup="languages"
                        disabled={index === 0}
                        {...register(`translations.${index}.language` as const)}
                      />
                      <FormError error={!!fieldErrors?.language} message={t(fieldErrors?.language?.message as string)} />
                    </div>

                    <div className="md:col-span-3">
                      <Input
                        id={`title-${index}`}
                        label={t('projects.form.labels.title', { defaultValue: 'Project Title' })}
                        placeholder={t('projects.form.placeholders.title', { defaultValue: 'Ex: E-commerce Website' })}
                        {...register(`translations.${index}.title` as const)}
                      >
                        <IconWrapper>📝</IconWrapper>
                      </Input>
                      <FormError error={!!fieldErrors?.title} message={t(fieldErrors?.title?.message as string)} />
                    </div>

                    <div className="md:col-span-4 mt-2 flex flex-col gap-2">
                      <Textarea
                        id={`description-${index}`}
                        label={t('projects.form.labels.description', { defaultValue: 'Description' })}
                        rows={4}
                        placeholder={t('projects.form.placeholders.description', { defaultValue: 'Describe the technologies used, the goal of the project...' })}
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
        <SaveButton isSubmitting={isSubmitting} customLabel={t('projects.buttons.save_project', { defaultValue: 'Save Project' })} />
      </div>
    </form>
  );
}
