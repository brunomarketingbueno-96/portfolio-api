import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import EditEducation from '@/pages/Educations/EditEducation';

import { useEducations } from '@/hooks/useEducations';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
}));

vi.mock('@/hooks/useEducations', () => ({
  useEducations: vi.fn(),
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

vi.mock('@/components/EducationForm', () => ({
  default: ({ onSubmitAction, globalError, isSubmitting }: any) => (
    <form
      data-testid="mock-education-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitAction();
      }}
    >
      <span data-testid="form-global-error">{globalError}</span>
      <span data-testid="form-is-submitting">{isSubmitting ? 'submitting' : 'idle'}</span>
      <button type="submit" data-testid="form-submit-btn">Submit</button>
    </form>
  )
}));

describe('EditEducation Page Component', () => {
  const mockSubmitHandler = vi.fn();
  const mockUpdateEducation = vi.fn().mockReturnValue(mockSubmitHandler);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useEducations).mockReturnValue({
      loading: false,
      globalError: null,
      updateEducation: mockUpdateEducation,
      register: vi.fn() as any,
      errors: {},
      isSubmitting: false,
      fields: [],
      appendTranslation: vi.fn(),
      removeTranslation: vi.fn(),
      imagePreview: null,
      handleFileChange: vi.fn(),
    } as any);
  });

  it('should call useEducations with the ID from the URL', () => {
    render(<EditEducation />);

    expect(useEducations).toHaveBeenCalledWith({ editId: '123' });
  });

  it('should render the loading spinner when loading is true', () => {
    vi.mocked(useEducations).mockReturnValue({
      ...vi.mocked(useEducations)(),
      loading: true,
    } as any);

    render(<EditEducation />);

    expect(screen.getByTestId('mock-page-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-education-form')).not.toBeInTheDocument();
  });

  it('should render the header texts, background, link, and form when loaded', () => {
    render(<EditEducation />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByTestId('mock-heading')).toHaveTextContent('Update your course or degree information.');
    expect(screen.getByTestId('mock-subtitle')).toHaveTextContent('Update your course or degree information.');

    const link = screen.getByTestId('mock-back-button');
    expect(link).toHaveAttribute('href', '/educations');
    expect(link).toHaveTextContent('Back to Educations');

    expect(screen.getByTestId('mock-education-form')).toBeInTheDocument();
  });

  it('should pass the correct props to the EducationForm and handle submission', () => {
    vi.mocked(useEducations).mockReturnValue({
      ...vi.mocked(useEducations)(),
      isSubmitting: true,
      globalError: 'Update failed',
    } as any);

    render(<EditEducation />);

    expect(screen.getByTestId('form-is-submitting')).toHaveTextContent('submitting');
    expect(screen.getByTestId('form-global-error')).toHaveTextContent('Update failed');

    expect(mockUpdateEducation).toHaveBeenCalledWith('123');

    const form = screen.getByTestId('mock-education-form');
    fireEvent.submit(form);

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
});
