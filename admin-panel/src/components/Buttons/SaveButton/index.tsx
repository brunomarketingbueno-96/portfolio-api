import { useTranslation } from 'react-i18next';

interface SaveButtonProps {
  isSubmitting: boolean;
  customLabel?: string;
}

export default function SaveButton({ isSubmitting, customLabel }: SaveButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
    >
      {
        isSubmitting
          ?
          t('global.buttons.saving', { defaultValue: 'Saving...' })
          :
          customLabel ? customLabel : t('global.buttons.save', { defaultValue: 'Save' })
      }
    </button>
  );
};
