import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import ServiceCard from '@/components/ServiceCard';
import Background from '@/components/Background';

export default function Services() {
  const { t } = useTranslation();

  const {
    services,
    loading,
    globalError,
    deleteService,
  } = useServices({ fetchList: true });

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">

      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>

            <Link to="/panel" className="text-sm text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2 inline-flex items-center gap-1 transition-colors">
              ← {t('buttons.back_to_panel', { defaultValue: 'Back to panel' })}
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">🛠️</span> {t('services.page.list.title', { defaultValue: 'Services' })}
            </h1>

          </div>

          <Link
            to="/services/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>➕ {t('services.buttons.new_service', { defaultValue: 'New service' })}</span>
          </Link>

        </div>

        {globalError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-400 rounded-lg">
            <p className="font-bold">{t('services.list.error_title', { defaultValue: 'Error' })}</p>
            <p>{globalError}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <>
            {services.length === 0 && !globalError ? (
              <div className="text-center py-20 bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700 rounded-lg">
                <div className="text-gray-400 dark:text-zinc-500 text-5xl mb-4">📁</div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-50">
                  {t('services.page.list.empty_list_title', { defaultValue: 'No services found.' })}
                </h3>

                <p className="text-gray-500 dark:text-zinc-400 mt-1">
                  {t('services.page.list.empty_list_description', { defaultValue: 'Register your first service to see it here.' })}
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onDelete={deleteService}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
