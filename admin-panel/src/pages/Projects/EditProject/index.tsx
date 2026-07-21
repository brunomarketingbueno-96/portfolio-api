import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProjects } from '@/hooks/useProjects';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import Background from '@/components/Background';
import ProjectForm from '@/components/ProjectForm';

import BackButton from '@/components/Buttons/BackButton';
import PageLoader from '@/components/PageLoader';

export default function EditProject() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const {
    loading,
    globalError,
    updateProject,
    register,
    errors,
    isSubmitting,
    fields,
    appendTranslation,
    removeTranslation,
    imagePreview,
    handleFileChange
  } = useProjects({ editId: id });

  const render = () => {
    if (loading) return <PageLoader />;

    return (
      <ProjectForm
        register={register}
        errors={errors}
        fields={fields}
        appendTranslation={appendTranslation}
        removeTranslation={removeTranslation}
        imagePreview={imagePreview}
        isSubmitting={isSubmitting}
        globalError={globalError}
        handleFileChange={handleFileChange}
        onSubmitAction={updateProject(id as string)}
      />
    )
  }

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />

      <div className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading level={1} title={t('pages.projects.edit.title', { defaultValue: 'Edit Project' })} />
            <SubTitle content={t('pages.projects.edit.description', { defaultValue: 'Update your project information.' })} />
          </div>
          <BackButton to={{ pathname: '/projects' }} label={t('pages.projects.buttons.back_to_projects', { defaultValue: 'Back to list' })} />
        </div>

        {render()}
      </div>
    </div>
  );
}
