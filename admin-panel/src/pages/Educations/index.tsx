import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import EducationCard from '@/components/EducationCard';
import Background from '@/components/Background';
import EmptyList from '@/components/EmptyList';
import PageLoader from '@/components/PageLoader';
import Heading from '@/components/Heading';

import AddButton from '@/components/Buttons/AddButton';
import BackButton from '@/components/Buttons/BackButton';

export default function Educations() {
  const { t } = useTranslation();

  const { educations, loading, globalError, deleteEducation } = useEducations({ fetchList: true });

  const render = () => {
    if (loading) {
      return (
        <PageLoader />
      );
    }

    if (educations.length === 0 && !globalError) {
      return (
        <EmptyList
          icon="📚"
          title={t('educations.page.list.empty_list_title', { defaultValue: 'No educations found.' })}
          description={t('educations.page.list.empty_list_description', { defaultValue: 'Start by adding your courses and degrees.' })}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {educations.map((education) => (
          <EducationCard
            key={education.id}
            education={education}
            onDelete={deleteEducation}
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
            <Heading level={1} icon="🎓" title={t('educations.page.list.title', { defaultValue: 'Educations' })} />
          </div>
          <AddButton to={{ pathname: '/educations/create' }} label={t('educations.buttons.new_education', { defaultValue: 'New Education' })} />
        </div>

        {globalError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-400 rounded-lg">
            <p className="font-bold">{t('educations.list.error_title', { defaultValue: 'Error' })}</p>
            <p>{globalError}</p>
          </div>
        )}

        {render()}
      </main>
    </div>
  );
}
