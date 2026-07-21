import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';

import type { AIProvider } from '@/typings/AiProvider';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import AiProviderForm from '@/components/AiProviderForm';
import GlobalError from '@/components/GlobalError';

interface AiProviderSectionProps {
  register: UseFormRegister<AIProvider>;
  errors: FieldErrors<AIProvider>;
  isSubmitting: boolean;
  globalError: string | null;
  onSubmitAction: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  children: React.ReactNode;
}

export default function AiProviderSection({
  register,
  errors,
  isSubmitting,
  globalError,
  onSubmitAction,
  isEditing,
  onCancelEdit,
  children
}: AiProviderSectionProps) {
  const { t } = useTranslation();

  const [isAddingNew, setIsAddingNew] = useState(false);

  const showForm = isEditing || isAddingNew;

  const handleCancel = () => {
    setIsAddingNew(false);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-8 shadow-sm">

      <div className="mb-6 border-b border-gray-100 dark:border-zinc-700 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <Heading level={2} title={t('pages.settings.sections.ai_provider.title', { defaultValue: 'Inteligência Artificial' })} />
          <SubTitle content={t('pages.settings.sections.ai_provider.description', { defaultValue: 'Cadastre e gerencie suas chaves de API para geração de conteúdo.' })} />
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className='
              bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer
              text-sm font-medium transition-colors flex items-center gap-2 shadow-sm
            '
          >
            {t('pages.settings.buttons.new_provider', { defaultValue: '+ Add Provider' })}
          </button>
        )}
      </div>

      <GlobalError error={globalError} message={globalError as string} />

      <div className="mb-8">{children}</div>

      {showForm && (
        <AiProviderForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmitAction={onSubmitAction}
          isEditing={isEditing}
          onCancelEdit={handleCancel}
        />
      )}
    </div>
  );
}
