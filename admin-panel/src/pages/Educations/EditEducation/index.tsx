import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import EducationForm from '@/components/EducationForm';
import Background from '@/components/Background';

export default function EditEducation() {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const {
    loading,
    globalError,
    updateEducation,
    register,
    errors,
    isSubmitting,
    fields,
    appendTranslation,
    removeTranslation,
    imagePreview,
    handleFileChange
  } = useEducations({ editId: id });

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">

      <Background />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <div className="flex-1 px-8 py-8 w-full relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
                {t('educations.page.edit.title', { defaultValue: 'Edit Education' })}
              </h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                {t('educations.page.edit.description', { defaultValue: 'Update your course or degree information.' })}
              </p>
            </div>
            <Link to="/educations" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors">
              ← {t('educations.buttons.back_to_educations', { defaultValue: 'Back to educations' })}
            </Link>
          </div>

          <EducationForm
            register={register}
            errors={errors}
            fields={fields}
            appendTranslation={appendTranslation}
            removeTranslation={removeTranslation}
            imagePreview={imagePreview}
            isSubmitting={isSubmitting}
            globalError={globalError}
            handleFileChange={handleFileChange}
            onSubmitAction={updateEducation(id as string)}
            submitButtonText={t('educations.buttons.save_education', { defaultValue: 'Save Education' })}
          />
        </div>
      )}
    </div>
  );
}
