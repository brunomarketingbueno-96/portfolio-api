import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import Background from '@/components/Background';
import EducationForm from '@/components/EducationForm';

import BackButton from '@/components/Buttons/BackButton';
import PageLoader from '@/components/PageLoader';

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

  const render = () => {
    if (loading) return <PageLoader />;

    return (
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
      />
    )
  }

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading level={1} title={t('educations.page.edit.subtitle', { defaultValue: 'Update your course or degree information.' })} />
            <SubTitle content={t('educations.page.edit.description', { defaultValue: 'Update your course or degree information.' })} />
          </div>
          <BackButton to={{ pathname: '/educations' }} label={t('educations.buttons.back_to_educations', { defaultValue: 'Back to Educations' })} />
        </div>

        {render()}
      </main>
    </div>
  );
}
