import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';

import ServiceForm from '@/components/ServiceForm';
import PageLoader from '@/components/PageLoader';

import Background from '@/components/Background';
import BackButton from '@/components/Buttons/BackButton';

export default function EditService() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const {
    loading,
    globalError,
    updateService,
    register,
    errors,
    isSubmitting,
    fields,
    appendTranslation,
    removeTranslation,
    imagePreview,
    handleFileChange
  } = useServices({ editId: id });

  const render = () => {
    if (loading) return <PageLoader />;

    return (
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
        onSubmitAction={updateService(id as string)}
      />
    )
  };

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading level={1} title={t('services.page.edit.title', { defaultValue: 'Edit Service' })} />
            <SubTitle content={t('services.page.edit.description', { defaultValue: 'Update the information for the selected service.' })} />
          </div>
          <BackButton to={{ pathname: '/services' }} label={t('services.buttons.back_to_services', { defaultValue: 'Back to services' })} />
        </div>

        {render()}
      </main>
    </div>
  );
}
