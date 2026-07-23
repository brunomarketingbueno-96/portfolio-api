import { useTranslation } from 'react-i18next';
import type { AIProvider } from '@/typings/AiProvider';

import Heading from '@/components/Heading';
import AiProviderCard from '@/components/AiProviderCard';

interface AiProvidersListProps {
  providers: AIProvider[];
  onEdit: (provider: AIProvider) => void;
  onDelete: (id?: string) => void;
}

export default function AiProvidersList({ providers, onEdit, onDelete }: AiProvidersListProps) {
  const { t } = useTranslation();

  if (!providers || providers.length === 0) return null;

  return (
    <div className="space-y-4 mt-6">
      <Heading level={3} title={t('pages.settings.sections.ai_provider.registered_providers', { defaultValue: 'Registered Providers' })} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {providers.map((provider) => (
          <AiProviderCard
            key={provider.id}
            aiProvider={provider}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
