import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import Background from '@/components/Background';
import EducationForm from '@/components/EducationForm';

import BackButton from '@/components/Buttons/BackButton';

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
            <Heading level={1} title={t('educations.page.create.title', { defaultValue: 'New Education' })} />
            <SubTitle content={t('educations.page.create.description', { defaultValue: 'Add a new course or degree to your resume' })} />
          </div>
          <BackButton to={{ pathname: '/educations' }} label={t('educations.buttons.back_to_educations', { defaultValue: 'Back to Educations' })} />
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
        />
      </div>
    </div>
  );
}
