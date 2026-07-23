import { useTranslation } from 'react-i18next';

import { useProjects } from '@/hooks/useProjects';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import Background from '@/components/Background';
import ProjectForm from '@/components/ProjectForm';

import BackButton from '@/components/Buttons/BackButton';

export default function CreateProject() {
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
    createProject
  } = useProjects();

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">

      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading level={1} title={t('pages.projects.create.title', { defaultValue: 'New Project' })} />
            <SubTitle content={t('pages.projects.create.description', { defaultValue: 'Add a new project to your portfolio.' })} />
          </div>
          <BackButton to={{ pathname: '/projects' }} label={t('pages.projects.buttons.back_to_projects', { defaultValue: 'Back to list' })} />
        </div>

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
          onSubmitAction={createProject}
        />
      </main>
    </div>
  );
}
