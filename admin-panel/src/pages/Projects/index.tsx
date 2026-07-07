import { useTranslation } from 'react-i18next';

import { useProjects } from '@/hooks/useProjects';

import ProjectCard from '@/components/ProjectCard';
import Background from '@/components/Background';
import EmptyList from '@/components/EmptyList';
import PageLoader from '@/components/PageLoader';
import Heading from '@/components/Heading';

import AddButton from '@/components/Buttons/AddButton';
import BackButton from '@/components/Buttons/BackButton';
import GlobalError from '@/components/GlobalError';

export default function Projects() {
  const { t } = useTranslation();

  const {
    projects,
    loading,
    globalError,
    deleteProject,
  } = useProjects({ fetchList: true });

  const render = () => {
    if (loading) return <PageLoader />;

    if (projects.length === 0 && !globalError) {
      return (
        <EmptyList
          icon="📁"
          title={t('projects.page.list.empty_list_title', { defaultValue: 'No projects found.' })}
          description={t('projects.page.list.empty_list_description', { defaultValue: 'Start by adding your first project.' })}
        />
      );
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={deleteProject}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <BackButton to={{ pathname: '/panel' }} label={t('buttons.back_to_panel', { defaultValue: 'Back to panel' })} />
            <Heading level={1} icon="👨‍💻" title={t('projects.page.list.title', { defaultValue: 'My Projects' })} />
          </div>
          <AddButton to={{ pathname: '/projects/create' }} label={t('projects.buttons.new_project', { defaultValue: 'New Project' })} />
        </div>

        <GlobalError error={globalError} message={t('projects.list.error_title', { defaultValue: 'Error' })} />

        {render()}
      </main>
    </div>
  );
}
