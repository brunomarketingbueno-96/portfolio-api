import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import Background from '@/components/Background';
import ServiceForm from '@/components/ServiceForm';

import BackButton from '@/components/Buttons/BackButton';

export default function CreateService() {
  const { t } = useTranslation();

  const {
    imagePreview, handleFileChange, isSubmitting, globalError, createService,
    register, errors, fields, appendTranslation, removeTranslation
  } = useServices();

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading level={1} title={t('pages.services.create.title', { defaultValue: 'Create new service' })} />
            <SubTitle content={t('pages.services.create.description', { defaultValue: 'Create a new service to be displayed on the website.' })} />
          </div>
          <BackButton to={{ pathname: '/services' }} label={t('pages.services.buttons.back_to_services', { defaultValue: 'Back to services' })} />
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
        />
      </main>
    </div>
  );
}
