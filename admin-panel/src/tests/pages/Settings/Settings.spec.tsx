import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Settings from '@/pages/Settings';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { useSettings } from '@/hooks/useSettings';
import { useAiProviders } from '@/hooks/useAiProviders';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('@/contexts/SettingsContext', () => ({
  useSettingsContext: vi.fn(),
}));

vi.mock('@/hooks/useSettings', () => ({
  useSettings: vi.fn(),
}));

vi.mock('@/hooks/useAiProviders', () => ({
  useAiProviders: vi.fn(),
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

vi.mock('@/components/SettingsForm', () => ({
  default: ({ submitButtonText, onSubmitAction, globalError, isSubmitting }: any) => (
    <form
      data-testid="mock-settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitAction();
      }}
    >
      <span data-testid="form-global-error">{globalError}</span>
      <span data-testid="form-is-submitting">{isSubmitting ? 'submitting' : 'idle'}</span>
      <button type="submit" data-testid="form-submit-btn">{submitButtonText}</button>
    </form>
  )
}));

describe('Settings Page Component', () => {
  const mockApplyNewSettings = vi.fn();
  const mockReset = vi.fn();
  const mockSetImagePreview = vi.fn();
  const mockUpdateSettingsSubmit = vi.fn();
  const mockUpdateSettings = vi.fn().mockImplementation((callback) => {
    return () => {
      callback({ siteUrl: 'https://new-url.com' });
      mockUpdateSettingsSubmit();
    };
  });

  const mockGlobalSettings = {
    siteUrl: 'https://example.com',
    publicEmail: 'admin@example.com',
    logoUrl: 'https://example.com/logo.png',
    customConfig: {},
    aiKeys: []
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSettingsContext).mockReturnValue({
      globalSettings: mockGlobalSettings,
      isLoadingSettings: false,
      applyNewSettings: mockApplyNewSettings,
    } as any);

    vi.mocked(useSettings).mockReturnValue({
      register: vi.fn() as any,
      errors: {},
      isSubmitting: false,
      globalError: null,
      updateSettings: mockUpdateSettings,
      imagePreview: null,
      handleFileChange: vi.fn(),
      reset: mockReset,
      setImagePreview: mockSetImagePreview,
    } as any);

    vi.mocked(useAiProviders).mockReturnValue({
      register: vi.fn() as any,
      errors: {},
      isSubmitting: false,
      globalError: null,
      createAiProvider: vi.fn(),
      updateAiProvider: vi.fn(),
      deleteAiProvider: vi.fn(),
      reset: vi.fn(),
    } as any);
  });

  it('should render loading spinner when isLoadingSettings is true', () => {
    vi.mocked(useSettingsContext).mockReturnValue({
      globalSettings: null,
      isLoadingSettings: true,
      applyNewSettings: mockApplyNewSettings,
    } as any);

    render(<Settings />);

    expect(screen.getByTestId('mock-page-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-settings-form')).not.toBeInTheDocument();
  });

  it('should render Layout, headers, background, back link and SettingsForm correctly when loaded', () => {
    render(<Settings />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();

    expect(screen.getAllByTestId('mock-heading')[0]).toHaveTextContent('Settings');
    expect(screen.getAllByTestId('mock-subtitle')[0]).toHaveTextContent('Manage the panel settings.');

    const link = screen.getByTestId('mock-back-button');
    expect(link).toHaveAttribute('href', '/panel');
    expect(link).toHaveTextContent('Back to panel');

    expect(screen.getByTestId('mock-settings-form')).toBeInTheDocument();
  });

  it('should reset form values and image preview when globalSettings is loaded/changed', () => {
    render(<Settings />);

    expect(mockReset).toHaveBeenCalledWith({
      theme: 'system',
      panelLanguage: 'en',
      customConfig: {},
      siteUrl: 'https://example.com',
      publicEmail: 'admin@example.com',
      logoUrl: 'https://example.com/logo.png',
    });
    expect(mockSetImagePreview).toHaveBeenCalledWith('https://example.com/logo.png');
  });

  it('should trigger updateSettings submit action and apply new settings on form submit', () => {
    render(<Settings />);

    const form = screen.getByTestId('mock-settings-form');
    fireEvent.submit(form);

    expect(mockUpdateSettingsSubmit).toHaveBeenCalledTimes(1);
    expect(mockApplyNewSettings).toHaveBeenCalledWith({ siteUrl: 'https://new-url.com' });
  });
});
