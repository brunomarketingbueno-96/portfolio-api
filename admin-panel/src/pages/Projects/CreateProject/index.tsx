import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProjects } from '@/hooks/useProjects';

import ProjectForm from '@/components/ProjectForm';
import Background from '@/components/Background';

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
              {t('projects.page.create.title', { defaultValue: 'New Project' })}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              {t('projects.page.create.description', { defaultValue: 'Add a new project to your portfolio.' })}
            </p>
          </div>
          <Link to="/projects" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors">
            ← {t('projects.buttons.back_to_projects', { defaultValue: 'Back to list' })}
          </Link>
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
          submitButtonText={t('projects.buttons.save_project', { defaultValue: 'Save Project' })}
        />
      </main>
    </div>
  );
}
