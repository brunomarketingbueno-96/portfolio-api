import { useState, useEffect, useMemo, useRef } from 'react'
import { useSettingsContext } from '@/contexts/SettingsContext'

import AiSelector from '@/components/AiSelector'

import type { AIProvider } from '@/typings/AiProvider';

interface AiGeneratorAssistentProps {
  aiPrompt: string
  setAiPrompt: (aiPrompt: string) => void
  isGenerating: boolean
  onGenerateAI?: (aiPrompt: string, index: number, providerId: string) => void
  index: number
}

export default function AiGeneratorAssistent({
  aiPrompt,
  setAiPrompt,
  isGenerating,
  onGenerateAI,
  index,
}: AiGeneratorAssistentProps) {

  const { globalSettings } = useSettingsContext()

  const providers: AIProvider[] = useMemo(
    () => globalSettings?.aiKeys || [],
    [globalSettings?.aiKeys]
  )

  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedProvider(providers[0])
    }
  }, [providers, selectedProvider])

  if (providers.length === 0 || !selectedProvider) {
    return null
  }

  return (
    <div className="md:col-span-12 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
          ✨ Assistente de IA
        </label>

        <AiSelector
          providers={providers}
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          disabled={isGenerating}
        />
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={2}
          value={aiPrompt}
          onChange={handleTextareaChange}
          placeholder="Ex: Crie um artigo longo e persuasivo focado em dicas de vendas..."
          className="
            w-full pl-4 pr-12 py-2.5 text-sm bg-white dark:bg-zinc-900 
            border border-gray-300 dark:border-zinc-700 rounded-xl resize-none 
            outline-none text-zinc-900 dark:text-zinc-100 transition-shadow
            min-h-16 max-h-32 overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600
          "
          disabled={isGenerating}
        />
        <button
          type="button"
          onClick={() => onGenerateAI && selectedProvider.id && onGenerateAI(aiPrompt, index, selectedProvider.id)}
          disabled={isGenerating || !aiPrompt.trim()}
          aria-label="Gerar conteúdo"
          className="
            absolute right-4 bottom-4 w-8 h-8 flex items-center justify-center
            rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
          "
        >
          {isGenerating ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
