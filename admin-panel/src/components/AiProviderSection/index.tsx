import { useTranslation } from 'react-i18next';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import type { NewAiProvider } from '@/typings/AiProvider';

import Heading from '@/components/Heading';
import SubTitle from '@/components/SubTitle';
import AiProviderForm from '@/components/AiProviderForm';
import GlobalError from '@/components/GlobalError';

interface AiProviderSectionProps {
  register: UseFormRegister<NewAiProvider>;
  errors: FieldErrors<NewAiProvider>;
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

  return (
    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-8 shadow-sm">
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-700 pb-4">
        <Heading level={2} title={t('settings.ai_providers.title', { defaultValue: 'Inteligência Artificial' })} />
        <SubTitle content={t('settings.ai_providers.description', { defaultValue: 'Cadastre e gerencie suas chaves de API para geração de conteúdo.' })} />
      </div>

      <GlobalError error={globalError} message={globalError as string} />

      <div className="mb-8">{children}</div>

      <AiProviderForm
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmitAction={onSubmitAction}
        isEditing={isEditing}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
}
