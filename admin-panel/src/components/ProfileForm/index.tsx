import { useTranslation } from 'react-i18next';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

import Input from '@/components/Input';
import IconWrapper from '@/components/IconWrapper';
import ImageSelector from '@/components/ImageSelector';
import FormError from '@/components/FormError';

import SaveButton from '@/components/Buttons/SaveButton';

import type { Profile } from '@/typings/Profile';

interface ProfileFormProps {
  profileRegister: UseFormRegister<Profile>;
  profileErrors: FieldErrors<Profile>;
  isSubmittingProfile: boolean;
  updateProfileSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  imagePreview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  globalErrorProfile?: string | null;
  successProfile?: boolean;
}

export default function ProfileForm({
  profileRegister,
  profileErrors,
  isSubmittingProfile,
  updateProfileSubmit,
  imagePreview,
  handleFileChange,
  globalErrorProfile,
  successProfile
}: ProfileFormProps) {

  const { t } = useTranslation();

  return (
    <form onSubmit={updateProfileSubmit} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-700 pb-3">
          👤 {t('profile.sections.personal_info', { defaultValue: 'Personal Information' })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center">
            <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <Input
                id="name"
                label={t('profile.labels.name', { defaultValue: 'Full Name' })}
                type="text"
                placeholder={t('profile.placeholders.name', { defaultValue: 'Your Full Name' })}
                {...profileRegister('name')}
              >
                <IconWrapper>📝</IconWrapper>
              </Input>
              <FormError error={!!profileErrors.name} message={t(profileErrors.name?.message as string)} />
            </div>

            <div>
              <Input
                id="email"
                label={t('profile.labels.email', { defaultValue: 'Email' })}
                type="email"
                placeholder={t('profile.placeholders.email', { defaultValue: 'your.email@example.com' })}
                {...profileRegister('email')}
              >
                <IconWrapper>📧</IconWrapper>
              </Input>
              <FormError error={!!profileErrors.email} message={t(profileErrors.email?.message as string)} />
            </div>
          </div>
        </div>

        {globalErrorProfile &&
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-red-700 dark:text-red-400 text-sm">
            {globalErrorProfile}
          </div>
        }

        {successProfile &&
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded text-green-700 dark:text-green-400 text-sm">
            {t('profile.messages.profile_success', { defaultValue: 'Profile updated successfully' })}
          </div>
        }
      </div>

      <div className="
         bg-gray-50 dark:bg-zinc-900 px-6 py-4 flex items-center justify-end border-t 
         border-gray-200 dark:border-zinc-700
        "
      >
        <SaveButton isSubmitting={isSubmittingProfile} customLabel={t('profile.buttons.save_profile', { defaultValue: 'Save Profile' })} />
      </div>
    </form>
  );
}
