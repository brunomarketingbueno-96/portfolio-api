import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import EducationForm from '@/components/EducationForm';
import Background from '@/components/Background';

export default function CreateEducation() {
  const { t } = useTranslation();

  const {
    imagePreview,
    isSubmitting,
    globalError,
    handleFileChange,
    register,
    errors,
    fields,
    appendTranslation,
    removeTranslation,
    createEducation
  } = useEducations();

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">

      <Background />

      <div className="flex-1 px-16 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
              {t('educations.page.create.title', { defaultValue: 'New Education' })}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              {t('educations.page.create.description', { defaultValue: 'Add a new course or degree to your resume' })}
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
          onSubmitAction={createEducation}
          submitButtonText={t('educations.buttons.save_education', { defaultValue: 'Save Education' })}
        />
      </div>
    </div>
  );
}
