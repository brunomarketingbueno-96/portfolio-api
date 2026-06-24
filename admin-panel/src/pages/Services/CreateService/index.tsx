import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import Header from '@/components/Header';
import ServiceForm from '@/components/ServiceForm';

export default function CreateService() {
  const { t } = useTranslation();

  const {
    form, setForm, imagePreview, submitting, error,
    handleFileChange, updateTranslation, addTranslation, removeTranslation,
    createService
  } = useServices();

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('services.create.title', { defaultValue: 'Criar Novo Serviço' })}</h1>
            <h2 className="text-sm text-gray-500">{t('services.create.description', { defaultValue: 'Preencha os detalhes abaixo para adicionar um novo serviço ao seu catálogo.' })}</h2>
          </div>
          <Link to="/services" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
            ← {t('services.create.back', { defaultValue: 'Voltar para serviços' })}
          </Link>
        </div>

        <ServiceForm
          form={form}
          setForm={setForm}
          imagePreview={imagePreview}
          submitting={submitting}
          error={error}
          handleFileChange={handleFileChange}
          updateTranslation={updateTranslation}
          addTranslation={addTranslation}
          removeTranslation={removeTranslation}
          onSubmitAction={createService}
          submitButtonText={t('services.form.buttons.save', { defaultValue: 'Salvar Serviço' })}
        />
      </main>
    </div>
  );
}
