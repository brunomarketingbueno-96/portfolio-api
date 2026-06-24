import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import Header from '@/components/Header';
import ServiceCard from '@/components/ServiceCard';

export default function Services() {
  const { t } = useTranslation();

  const {
    services,
    loading,
    error,
    deleteService,
  } = useServices({ fetchList: true });

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-8 py-8 w-full">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link to="/panel" className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-flex items-center gap-1 transition-colors">
              ← {t('services.list.back_to_panel', { defaultValue: 'Voltar ao painel' })}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🛠️</span> {t('services.list.title', { defaultValue: 'Serviços' })}
            </h1>
          </div>

          <Link
            to="/services/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>➕ {t('services.list.new_service', { defaultValue: 'Novo Serviço' })}</span>
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-lg">
            <p className="font-bold">{t('services.list.error_title', { defaultValue: 'Erro' })}</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {services.length === 0 && !error ? (
              <div className="text-center py-20 bg-white shadow-sm border border-gray-100 rounded-lg">
                <div className="text-gray-400 text-5xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-900">{t('services.list.empty_title', { defaultValue: 'Nenhum serviço encontrado' })}</h3>
                <p className="text-gray-500 mt-1">{t('services.list.empty_description', { defaultValue: 'Cadastre seu primeiro serviço para vê-lo aqui.' })}</p>
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
