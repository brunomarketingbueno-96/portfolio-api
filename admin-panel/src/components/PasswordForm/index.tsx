import { useTranslation } from 'react-i18next';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ChangePassword } from '@/typings/Profile';

import Input from '@/components/Input';
import IconWrapper from '@/components/IconWrapper';
import FormError from '@/components/FormError';

interface PasswordFormProps {
  passwordRegister: UseFormRegister<ChangePassword>;
  passwordErrors: FieldErrors<ChangePassword>;
  isSubmittingPassword: boolean;
  updatePasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  globalErrorPassword?: string | null;
  successPassword?: boolean;
}

export default function PasswordForm({
  passwordRegister,
  passwordErrors,
  isSubmittingPassword,
  updatePasswordSubmit,
  globalErrorPassword,
  successPassword
}: PasswordFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={updatePasswordSubmit} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-700 pb-3">
          🔒 {t('pages.profile.sections.security', { defaultValue: 'Security and Password' })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Input
              id="oldPassword"
              label={t('forms.password.labels.old_password', { defaultValue: 'Current Password' })}
              type="password"
              placeholder="••••••••"
              {...passwordRegister('oldPassword')}
            >
              <IconWrapper>🔑</IconWrapper>
            </Input>
            <FormError error={!!passwordErrors.oldPassword} message={t(passwordErrors.oldPassword?.message as string)} />
          </div>

          <div>
            <Input
              id="newPassword"
              label={t('forms.password.labels.new_password', { defaultValue: 'New Password' })}
              type="password"
              placeholder="••••••••"
              {...passwordRegister('newPassword')}
            >
              <IconWrapper>✨</IconWrapper>
            </Input>
            <FormError error={!!passwordErrors.newPassword} message={t(passwordErrors.newPassword?.message as string)} />
          </div>

          <div>
            <Input
              id="confirmPassword"
              label={t('forms.password.labels.confirm_password', { defaultValue: 'Confirm New Password' })}
              type="password"
              placeholder="••••••••"
              {...passwordRegister('confirmPassword')}
            >
              <IconWrapper>✅</IconWrapper>
            </Input>
            <FormError error={!!passwordErrors.confirmPassword} message={t(passwordErrors.confirmPassword?.message as string)} />
          </div>
        </div>

        {globalErrorPassword && <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-red-700 dark:text-red-400 text-sm">{globalErrorPassword}</div>}
        {successPassword && <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded text-green-700 dark:text-green-400 text-sm">{t('profile.messages.password_success', { defaultValue: 'Password updated successfully' })}</div>}
      </div>

      <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 flex items-center justify-end border-t border-gray-200 dark:border-zinc-700">
        <button
          type="submit"
          disabled={isSubmittingPassword}
          className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        >
          {isSubmittingPassword ? t('forms.password.buttons.updating', { defaultValue: 'Updating...' }) : t('forms.password.buttons.update_password', { defaultValue: 'Update Password' })}
        </button>
      </div>
    </form>
  );
}
