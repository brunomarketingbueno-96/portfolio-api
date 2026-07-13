import { useTranslation } from 'react-i18next';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';

import { z } from 'zod'

import { aiProviderSchema } from '../../../../src/schemas/ai-providers.schema';

type AiProviderFormData = z.infer<typeof aiProviderSchema>;

interface AiProviderFormProps {
  register: UseFormRegister<AiProviderFormData>;
  errors: FieldErrors<AiProviderFormData>;
  isSubmitting: boolean;
  onSubmitAction: (e?: React.BaseSyntheticEvent) => Promise<void>;

  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export default function AiProviderForm({
  register,
  errors,
  isSubmitting,
  onSubmitAction,
  isEditing,
  onCancelEdit,
}: AiProviderFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmitAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {t('settings.ai_providers.name', { defaultValue: 'Nome da Chave' })}
          </label>
          <input
            type="text"
            placeholder="Ex: Groq Produção"
            {...register('name')}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-zinc-100"
          />
          {errors.name && (
            <span className="text-red-500 text-xs mt-1 block">{t(errors.name.message as string)}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {t('settings.ai_providers.provider', { defaultValue: 'Provedor' })}
          </label>
          <select
            {...register('provider')}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-zinc-100"
          >
            <option value="groq">Groq</option>
            <option value="openai">OpenAI</option>
            <option value="gemini">Google Gemini</option>
          </select>
          {errors.provider && (
            <span className="text-red-500 text-xs mt-1 block">{t(errors.provider.message as string)}</span>
          )}
        </div>

        {/* API Key */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {t('settings.ai_providers.key', { defaultValue: 'API Key' })}
          </label>
          <input
            type="password"
            placeholder="sk-..."
            {...register('key')}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-zinc-100"
          />
          {errors.key && (
            <span className="text-red-500 text-xs mt-1 block">{t(errors.key.message as string)}</span>
          )}
        </div>

        {/* Is Active */}
        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="isActiveAi"
            {...register('isActive')}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
          />
          <label htmlFor="isActiveAi" className="text-sm font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer">
            {t('settings.ai_providers.is_active', { defaultValue: 'Definir como provedor ativo principal' })}
          </label>
        </div>
      </div>

      {/* Rodapé de Botões Dinâmico */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-700">
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-100 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {t('buttons.cancel', { defaultValue: 'Cancelar' })}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting
            ? t('buttons.saving', { defaultValue: 'Salvando...' })
            : isEditing
              ? t('buttons.save_changes', { defaultValue: 'Salvar Alterações' })
              : t('buttons.add_provider', { defaultValue: 'Adicionar Provedor' })
          }
        </button>
      </div>
    </form>
  );
}
