import { useTranslation } from 'react-i18next';

import type { AIProvider } from '@/typings/AiProvider';

import { getProviderLogo } from '@/helpers/aiProviderHelpers';

interface AiProviderCardProps {
  aiProvider: AIProvider;
  onEdit: (provider: AIProvider) => void;
  onDelete: (id?: string) => void;
}

export default function AiProviderCard({ aiProvider, onEdit, onDelete }: AiProviderCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col h-full p-4 rounded-xl border transition-all hover:shadow-md ${aiProvider.isActive
        ? 'bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-sm'
        : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'
        }`}
    >

      <div className="flex items-center gap-3 mb-4">
        <img
          src={getProviderLogo(aiProvider.provider)}
          alt={`Logo ${aiProvider.provider}`}
          className="w-8 h-8 object-contain rounded-md bg-white dark:bg-zinc-900 p-1 border border-gray-100 dark:border-zinc-700 shadow-sm"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="capitalize text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate" title={aiProvider.name}>
            {aiProvider.provider}
          </span>
          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
            {aiProvider.name}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100 dark:border-zinc-700/50">

        <div className="flex-1">
          {aiProvider.isActive && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              {t('settings.ai_providers.active_badge', { defaultValue: 'Ativo' })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(aiProvider)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
            title={t('buttons.edit', { defaultValue: 'Editar' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onDelete(aiProvider.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
            title={t('buttons.delete', { defaultValue: 'Excluir' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div >
  );
}
