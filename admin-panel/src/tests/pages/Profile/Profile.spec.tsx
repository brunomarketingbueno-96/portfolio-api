import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Profile from '@/pages/Profile';
import { useProfile } from '@/hooks/useProfile';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('@/hooks/useProfile', () => ({
  useProfile: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/Heading', () => ({
  default: ({ title }: any) => <h1 data-testid="mock-heading">{title}</h1>
}));

vi.mock('@/components/SubTitle', () => ({
  default: ({ content }: any) => <p data-testid="mock-subtitle">{content}</p>
}));

vi.mock('@/components/Buttons/BackButton', () => ({
  default: ({ to, label }: any) => <a href={to.pathname} data-testid="mock-back-button">{label}</a>
}));

vi.mock('@/components/PageLoader', () => ({
  default: () => <div data-testid="mock-page-loader" />
}));

vi.mock('@/components/ProfileForm', () => ({
  default: ({ updateProfileSubmit, globalErrorProfile, successProfile }: any) => (
    <form data-testid="mock-profile-form" onSubmit={updateProfileSubmit}>
      {globalErrorProfile && <span>{globalErrorProfile}</span>}
      {successProfile && <span>Profile updated successfully</span>}
      <button type="submit">Submit Profile</button>
    </form>
  )
}));

vi.mock('@/components/PasswordForm', () => ({
  default: ({ updatePasswordSubmit, globalErrorPassword, successPassword }: any) => (
    <form data-testid="mock-password-form" onSubmit={updatePasswordSubmit}>
      {globalErrorPassword && <span>{globalErrorPassword}</span>}
      {successPassword && <span>Password updated successfully</span>}
      <button type="submit">Submit Password</button>
    </form>
  )
}));

describe('Profile Page Component', () => {
  const mockUpdateProfileSubmit = vi.fn((e) => e.preventDefault());
  const mockUpdatePasswordSubmit = vi.fn((e) => e.preventDefault());

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProfile).mockReturnValue({
      profileRegister: vi.fn().mockReturnValue({}),
      profileErrors: {},
      isSubmittingProfile: false,
      updateProfileSubmit: mockUpdateProfileSubmit,
      globalErrorProfile: null,
      successProfile: false,
      passwordRegister: vi.fn().mockReturnValue({}),
      passwordErrors: {},
      isSubmittingPassword: false,
      updatePasswordSubmit: mockUpdatePasswordSubmit,
      globalErrorPassword: null,
      successPassword: false,
      imagePreview: null,
      handleFileChange: vi.fn(),
      loading: false,
    } as any);
  });

  it('should render loading spinner when loading is true', () => {
    vi.mocked(useProfile).mockReturnValue({
      ...vi.mocked(useProfile)(),
      loading: true,
    } as any);

    render(<Profile />);

    expect(screen.getByTestId('mock-page-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-profile-form')).not.toBeInTheDocument();
  });

  it('should render profile layout, headers, background, and forms correctly when loaded', () => {
    render(<Profile />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByTestId('mock-heading')).toHaveTextContent('My Profile');
    expect(screen.getByTestId('mock-subtitle')).toHaveTextContent('Manage your account information and security.');

    const link = screen.getByTestId('mock-back-button');
    expect(link).toHaveAttribute('href', '/panel');
    expect(link).toHaveTextContent('Back to Panel');

    expect(screen.getByTestId('mock-profile-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-password-form')).toBeInTheDocument();
  });

  it('should trigger updateProfileSubmit when the personal info form is submitted', () => {
    render(<Profile />);

    const form = screen.getByTestId('mock-profile-form');
    fireEvent.submit(form);

    expect(mockUpdateProfileSubmit).toHaveBeenCalledTimes(1);
  });

  it('should trigger updatePasswordSubmit when the security form is submitted', () => {
    render(<Profile />);

    const form = screen.getByTestId('mock-password-form');
    fireEvent.submit(form);

    expect(mockUpdatePasswordSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display error and success messages properly', () => {
    vi.mocked(useProfile).mockReturnValue({
      ...vi.mocked(useProfile)(),
      globalErrorProfile: 'Error updating profile',
      successProfile: true,
      globalErrorPassword: 'Error updating password',
      successPassword: true,
    } as any);

    render(<Profile />);

    expect(screen.getByText('Error updating profile')).toBeInTheDocument();
    expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    expect(screen.getByText('Error updating password')).toBeInTheDocument();
    expect(screen.getByText('Password updated successfully')).toBeInTheDocument();
  });
});
