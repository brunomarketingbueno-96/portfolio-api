import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import ServiceForm from '@/components/ServiceForm';
import Background from '@/components/Background';

export default function CreateService() {
  const { t } = useTranslation();

  const {
    imagePreview, handleFileChange,
    isSubmitting, globalError,
    createService,
    register, errors, fields, appendTranslation, removeTranslation
  } = useServices();

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">

      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
              {t('services.page.create.title', { defaultValue: 'Create new service' })}
            </h1>

            <h2 className="text-sm text-gray-500 dark:text-zinc-400">
              {t('services.page.create.description', { defaultValue: 'Create a new service to be displayed on the website.' })}
            </h2>

          </div>
          <Link to="/services" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors">
            ← {t('services.buttons.back_to_services', { defaultValue: 'Back to services' })}
          </Link>
        </div>

        <ServiceForm
          register={register}
          errors={errors}
          fields={fields}
          appendTranslation={appendTranslation}
          removeTranslation={removeTranslation}
          imagePreview={imagePreview}
          isSubmitting={isSubmitting}
          globalError={globalError}
          handleFileChange={handleFileChange}
          onSubmitAction={createService}
          submitButtonText={t('services.buttons.save_service', { defaultValue: 'Save service' })}
        />
      </main>
    </div>
  );
}
