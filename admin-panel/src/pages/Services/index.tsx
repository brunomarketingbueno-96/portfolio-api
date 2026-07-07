import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import ServiceCard from '@/components/ServiceCard';
import Background from '@/components/Background';
import EmptyList from '@/components/EmptyList';
import PageLoader from '@/components/PageLoader';
import Heading from '@/components/Heading';

import AddButton from '@/components/Buttons/AddButton';
import BackButton from '@/components/Buttons/BackButton';
import GlobalError from '@/components/GlobalError';

export default function Services() {
  const { t } = useTranslation();

  const { services, loading, globalError, deleteService } = useServices({ fetchList: true });

  const render = () => {
    if (loading) return <PageLoader />;

    if (services.length === 0 && !globalError) {
      return (
        <EmptyList
          icon="📁"
          title={t('services.page.list.empty_list_title', { defaultValue: 'No services found.' })}
          description={t('services.page.list.empty_list_description', { defaultValue: 'Register your first service to see it here.' })}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onDelete={deleteService}
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
            <Heading level={1} icon="🛠️" title={t('services.page.list.title', { defaultValue: 'Services' })} />
          </div>
          <AddButton to={{ pathname: '/services/create' }} label={t('services.buttons.new_service', { defaultValue: 'New Service' })} />
        </div>

        <GlobalError error={globalError} message={t('services.list.error_title', { defaultValue: 'Error' })} />

        {render()}
      </main>
    </div>
  );
}
