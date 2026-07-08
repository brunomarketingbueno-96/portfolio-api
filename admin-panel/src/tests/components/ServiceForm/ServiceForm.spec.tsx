import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ServiceForm from '@/components/ServiceForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key
  })
}));

vi.mock('@/components/Input', () => ({
  default: React.forwardRef(({ label, children, ...props }: any, ref: any) => (
    <div>
      <label>{label}</label>
      <input {...props} ref={ref} data-testid={`mock-input-${props.id}`} />
      {children}
    </div>
  ))
}));

vi.mock('@/components/Select', () => ({
  default: React.forwardRef(({ label, translationGroup, ...props }: any, ref: any) => (
    <div>
      <label>{label}</label>
      <select {...props} ref={ref} data-testid={`mock-select-${props.id}`} />
    </div>
  ))
}));

vi.mock('@/components/Textarea', () => ({
  default: React.forwardRef(({ label, ...props }: any, ref: any) => (
    <div>
      <label>{label}</label>
      <textarea {...props} ref={ref} data-testid={`mock-textarea-${props.id}`} />
    </div>
  ))
}));

vi.mock('@/components/FormError', () => ({
  default: ({ error, message }: any) => error ? <span data-testid="mock-form-error">{message}</span> : null
}));

vi.mock('@/components/ImageSelector', () => ({
  default: () => <div data-testid="mock-image-selector" />
}));

vi.mock('@/components/IconWrapper', () => ({
  default: ({ children }: any) => <span data-testid="mock-icon-wrapper">{children}</span>
}));

vi.mock('@/components/Buttons/SaveButton', () => ({
  default: ({ isSubmitting, customLabel }: any) => (
    <button type="submit" disabled={isSubmitting}>{customLabel}</button>
  )
}));

const mockFields = [
  { id: 'uuid-1', language: 'en', title: 'Web Design', description: 'Design services' }
];

const mockRegister = vi.fn().mockReturnValue({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: 'test'
});

const defaultProps = {
  register: mockRegister,
  errors: {} as any,
  fields: mockFields as any,
  appendTranslation: vi.fn(),
  removeTranslation: vi.fn(),
  imagePreview: null,
  isSubmitting: false,
  globalError: null,
  handleFileChange: vi.fn(),
  onSubmitAction: vi.fn((e) => e.preventDefault()),
};

describe('ServiceForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form and its elements correctly', () => {
    render(<ServiceForm {...defaultProps} />);

    expect(screen.getByText('Translations & Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Service' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add Language' })).toBeInTheDocument();
    expect(screen.getByTestId('mock-image-selector')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-link')).toBeInTheDocument();
  });

  it('should display an error message if globalError prop is provided', () => {
    render(<ServiceForm {...defaultProps} globalError="An unexpected error occurred" />);

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('should disable the submit button when isSubmitting is true', () => {
    render(<ServiceForm {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'Save Service' });
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmitAction when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<ServiceForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Save Service' });
    await user.click(submitButton);

    expect(defaultProps.onSubmitAction).toHaveBeenCalledTimes(1);
  });

  it('should call appendTranslation when add language button is clicked', async () => {
    const user = userEvent.setup();
    render(<ServiceForm {...defaultProps} />);

    const addLanguageButton = screen.getByRole('button', { name: '+ Add Language' });
    await user.click(addLanguageButton);

    expect(defaultProps.appendTranslation).toHaveBeenCalledTimes(1);
  });

  it('should call removeTranslation when the delete button is clicked on secondary translation', async () => {
    const fieldsWithMultiple = [
      ...mockFields,
      { id: 'uuid-2', language: 'es', title: 'Diseño Web', description: 'Servicios de diseño' }
    ];

    const user = userEvent.setup();
    render(<ServiceForm {...defaultProps} fields={fieldsWithMultiple as any} />);

    const removeButtons = screen.getAllByRole('button', { name: '✕' });
    await user.click(removeButtons[0]);

    expect(defaultProps.removeTranslation).toHaveBeenCalledTimes(1);
    expect(defaultProps.removeTranslation).toHaveBeenCalledWith(1);
  });

  it('should render form errors when validation errors exist', () => {
    const mockErrors = {
      link: { message: 'invalid_url', type: 'pattern' },
      translations: [{ description: { message: 'desc_required', type: 'required' } }]
    };

    render(<ServiceForm {...defaultProps} errors={mockErrors as any} />);

    expect(screen.getByText('invalid_url')).toBeInTheDocument();
    expect(screen.getByText('desc_required')).toBeInTheDocument();
  });

  it('should NOT render form errors when fields are valid', () => {
    render(<ServiceForm {...defaultProps} errors={{}} />);

    expect(screen.queryByTestId('mock-form-error')).not.toBeInTheDocument();
  });
});
