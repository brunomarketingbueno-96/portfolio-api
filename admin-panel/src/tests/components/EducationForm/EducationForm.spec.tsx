import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import EducationForm from '@/components/EducationForm';

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
  default: React.forwardRef(({ label, ...props }: any, ref: any) => (
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
  { id: 'uuid-1', language: 'en', institution: 'Tech Inst', name: 'React Course', description: 'Advanced React' }
];

const mockRegister = vi.fn().mockReturnValue({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: 'test'
});

const mockProps = {
  register: mockRegister,
  errors: {} as any,
  fields: mockFields as any,
  appendTranslation: vi.fn(),
  removeTranslation: vi.fn(),
  imagePreview: null,
  isSubmitting: false,
  globalError: null,
  handleFileChange: vi.fn(),
  onSubmitAction: vi.fn((e) => e.preventDefault())
};

describe('EducationForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form and its elements correctly', () => {
    render(<EducationForm {...mockProps} />);

    expect(screen.getByText('Content & Translations')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Education' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add Language' })).toBeInTheDocument();
    expect(screen.getByTestId('mock-image-selector')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-startDate')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-endDate')).toBeInTheDocument();
  });

  it('should display an error message if globalError prop is provided', () => {
    render(<EducationForm {...mockProps} globalError="An unexpected error occurred" />);

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('should disable the submit button when isSubmitting is true', () => {
    render(<EducationForm {...mockProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'Save Education' });
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmitAction when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<EducationForm {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: 'Save Education' });
    await user.click(submitButton);

    expect(mockProps.onSubmitAction).toHaveBeenCalledTimes(1);
  });

  it('should call appendTranslation when add language button is clicked', async () => {
    const user = userEvent.setup();
    render(<EducationForm {...mockProps} />);

    const addLanguageButton = screen.getByRole('button', { name: '+ Add Language' });
    await user.click(addLanguageButton);

    expect(mockProps.appendTranslation).toHaveBeenCalledTimes(1);
  });

  it('should call removeTranslation when the delete button is clicked on secondary translation', async () => {
    const fieldsWithMultipleTranslations = [
      ...mockFields,
      { id: 'uuid-2', language: 'es', institution: 'Inst ES', name: 'Course ES', description: 'Advanced ES' }
    ];

    const user = userEvent.setup();
    render(<EducationForm {...mockProps} fields={fieldsWithMultipleTranslations as any} />);

    const removeButtons = screen.getAllByTitle('Delete');
    await user.click(removeButtons[0]);

    expect(mockProps.removeTranslation).toHaveBeenCalledTimes(1);
    expect(mockProps.removeTranslation).toHaveBeenCalledWith(1);
  });

  it('should NOT render delete button for the first translation', () => {
    render(<EducationForm {...mockProps} fields={[mockFields[0]] as any} />);

    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument();
  });

  it('should display validation error messages for all fields when errors exist', () => {
    const mockErrors = {
      type: { message: 'Error in type' },
      status: { message: 'Error in status' },
      startDate: { message: 'Error in startDate' },
      endDate: { message: 'Error in endDate' },
      durationHours: { message: 'Error in durationHours' },
      certificateUrl: { message: 'Error in certificateUrl' },
      translations: [
        {
          language: { message: 'Error in language' },
          institution: { message: 'Error in institution' },
          name: { message: 'Error in name' },
          description: { message: 'Error in description' }
        }
      ]
    };

    render(<EducationForm {...mockProps} errors={mockErrors as any} />);

    expect(screen.getByText('Error in type')).toBeInTheDocument();
    expect(screen.getByText('Error in status')).toBeInTheDocument();
    expect(screen.getByText('Error in startDate')).toBeInTheDocument();
    expect(screen.getByText('Error in endDate')).toBeInTheDocument();
    expect(screen.getByText('Error in durationHours')).toBeInTheDocument();
    expect(screen.getByText('Error in certificateUrl')).toBeInTheDocument();

    expect(screen.getByText('Error in language')).toBeInTheDocument();
    expect(screen.getByText('Error in institution')).toBeInTheDocument();
    expect(screen.getByText('Error in name')).toBeInTheDocument();
    expect(screen.getByText('Error in description')).toBeInTheDocument();
  });

  it('should NOT render form errors when fields are valid', () => {
    render(<EducationForm {...mockProps} errors={{}} />);

    expect(screen.queryByTestId('mock-form-error')).not.toBeInTheDocument();
  });
});
