
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AiProviderService } from '@/services/aiProvidersService';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aiProviderSchema } from '../../../src/schemas/ai-providers.schema';

import type { NewAiProvider } from '@/typings/AiProvider';

const initialForm: NewAiProvider = {
  name: '',
  provider: 'openai',
  key: '',
  isActive: false
};

export function useAiProviders() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NewAiProvider>({
    resolver: zodResolver(aiProviderSchema),
    defaultValues: initialForm
  });

  const deleteAiProvider = async (id: string, onSuccess?: () => void) => {
    if (!window.confirm(t('ai_providers.action.confirm_delete', { defaultValue: 'Tem certeza que deseja excluir?' }))) return;

    setLoading(true);
    try {
      await AiProviderService.delete(id);
      if (onSuccess) onSuccess();
    } catch (error) {
      const err = error as ApiError;
      alert(err.error ? t(err.error) : t('api.error.unknown', { defaultValue: 'Erro desconhecido' }));
    } finally {
      setLoading(false);
    }
  };

  const processFormSubmit = async (data: NewAiProvider, id?: string, onSuccess?: () => void) => {
    setGlobalError(null);
    try {
      if (id) {
        await AiProviderService.update(id, data);
      } else {
        await AiProviderService.create(data);
      }

      reset(initialForm);
      if (onSuccess) onSuccess();
    } catch (error) {
      const err = error as ApiError;
      const errorKey = err.error;
      setGlobalError(errorKey ? t(errorKey) : t('api.error.unknown', { defaultValue: 'Erro desconhecido' }));
    }
  };

  const createAiProvider = (onSuccess?: () => void) => handleSubmit((data) => processFormSubmit(data, undefined, onSuccess));
  const updateAiProvider = (id: string, onSuccess?: () => void) => handleSubmit((data) => processFormSubmit(data, id, onSuccess));

  return {
    loading,
    globalError,
    deleteAiProvider,
    createAiProvider,
    updateAiProvider,

    register,
    errors,
    isSubmitting,
    reset
  };
}
