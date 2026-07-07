import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/useProfile';

import SubTitle from '@/components/SubTitle';
import Heading from '@/components/Heading';

import Background from '@/components/Background';
import PageLoader from '@/components/PageLoader';

import PasswordForm from '@/components/PasswordForm';
import ProfileForm from '@/components/ProfileForm';

import BackButton from '@/components/Buttons/BackButton';

export default function Profile() {
  const { t } = useTranslation();

  const {
    // Profile Form Hooks
    profileRegister, profileErrors, isSubmittingProfile, updateProfileSubmit, globalErrorProfile, successProfile,
    // Password Form Hooks
    passwordRegister, passwordErrors, isSubmittingPassword, updatePasswordSubmit, globalErrorPassword, successPassword,

    imagePreview, handleFileChange, loading
  } = useProfile();

  const render = () => {
    if (loading) {
      return <PageLoader />;
    }

    return (
      <main className="flex-1 px-8 py-8 w-full space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <Heading level={1} title={t('profile.title', { defaultValue: 'My Profile' })} />
            <SubTitle content={t('profile.description', { defaultValue: 'Manage your account information and security.' })} />
          </div>
          <BackButton to={{ pathname: '/panel' }} label={t('buttons.back_to_panel', { defaultValue: 'Back to Panel' })} />
        </div>

        <ProfileForm
          profileRegister={profileRegister}
          profileErrors={profileErrors}
          isSubmittingProfile={isSubmittingProfile}
          updateProfileSubmit={updateProfileSubmit}
          imagePreview={imagePreview}
          handleFileChange={handleFileChange}
          globalErrorProfile={globalErrorProfile}
          successProfile={successProfile}
        />

        <PasswordForm
          passwordRegister={passwordRegister}
          passwordErrors={passwordErrors}
          isSubmittingPassword={isSubmittingPassword}
          updatePasswordSubmit={updatePasswordSubmit}
          globalErrorPassword={globalErrorPassword}
          successPassword={successPassword}
        />
      </main>
    );
  };

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />
      {render()}
    </div>
  );
}