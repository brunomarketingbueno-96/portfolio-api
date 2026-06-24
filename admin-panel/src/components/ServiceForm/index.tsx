import React from 'react';
import { useTranslation } from 'react-i18next';

import Input from '@/components/Input';
import Select from '@/components/Select';
import IconWrapper from '@/components/IconWrapper';
import ImageSelector from '@/components/ImageSelector';

interface ServiceFormProps {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  imagePreview: string | null;
  submitting: boolean;
  error: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateTranslation: (index: number, field: keyof ServiceTranslation, value: string) => void;
  addTranslation: () => void;
  removeTranslation: (index: number) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
}

export default function ServiceForm({
  form, setForm, imagePreview, submitting, error,
  handleFileChange, updateTranslation, addTranslation, removeTranslation,
  onSubmitAction, submitButtonText
}: ServiceFormProps) {

  const { t } = useTranslation();
  const textAreaClass = "w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900";

  return (
    <form onSubmit={onSubmitAction} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />

          <div className="space-y-4 flex flex-col justify-center">
            <Input
              id="link"
              name="link"
              label={t('services.form.labels.link', { defaultValue: 'Link do Serviço' })}
              type="url"
              value={form.link || ''}
              onChange={e => setForm({ ...form, link: e.target.value })}
              placeholder={t('services.form.placeholders.link', { defaultValue: 'https://exemplo.com/servico' })}
            >
              <IconWrapper>🔗</IconWrapper>
            </Input>

            <p className="text-xs text-zinc-400 mt-2 italic">
              {t('services.form.info.link', { defaultValue: '* Opcional: Insira um link externo para mais detalhes ou contratação.' })}
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{t('services.form.titles.translations', { defaultValue: 'Traduções e Conteúdo' })}</h3>
            <button type="button" onClick={addTranslation} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              {t('services.form.buttons.addLanguage', { defaultValue: '+ Adicionar Idioma' })}
            </button>
          </div>

          <div className="space-y-6">
            {form.translations.map((tData, index) => (
              <div key={index} className="bg-zinc-50/50 p-5 rounded-lg border border-zinc-200 relative group">
                {index !== 0 && (
                  <button type="button" onClick={() => removeTranslation(index)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors">✕</button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <Select
                      label={t('services.form.labels.language', { defaultValue: 'Idioma' })}
                      value={tData.language}
                      onChange={(e) => updateTranslation(index, 'language', e.target.value)}
                      options={['pt', 'en', 'es']}
                      translationGroup="languages"
                      disabled={index === 0}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Input
                      id={`title-${index}`}
                      name="title"
                      label={t('services.form.labels.title', { defaultValue: 'Título do Serviço' })}
                      value={tData.title || ''}
                      onChange={(e) => updateTranslation(index, 'title', e.target.value)}
                      placeholder={t('services.form.placeholders.title', { defaultValue: 'Ex: Desenvolvimento Web Fullstack' })}
                      required
                    >
                      <IconWrapper>🛠️</IconWrapper>
                    </Input>
                  </div>

                  <div className="md:col-span-4 mt-2 flex flex-col gap-2">
                    <label className="ml-1 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                      {t('services.form.labels.description', { defaultValue: 'Descrição do Serviço' })}
                    </label>
                    <textarea
                      value={tData.description || ''}
                      onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                      rows={4}
                      placeholder={t('services.form.placeholders.description', { defaultValue: 'Descreva detalhadamente o que este serviço oferece...' })}
                      required
                      className={textAreaClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">{error}</div>}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-200">
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        >
          {submitting ? t('services.form.buttons.saving', { defaultValue: 'Salvando...' }) : submitButtonText}
        </button>
      </div>
    </form>
  );
}
