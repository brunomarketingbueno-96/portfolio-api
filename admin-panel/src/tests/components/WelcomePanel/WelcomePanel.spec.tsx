import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WelcomePanel from '@/components/WelcomePanel';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key
  })
}));

describe('WelcomePanel', () => {
  it('should render the welcome title and description correctly', () => {
    render(<WelcomePanel />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Manage your portfolio')).toBeInTheDocument();
  });

  it('should apply the correct layout classes', () => {
    const { container } = render(<WelcomePanel />);

    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass('hidden', 'md:flex', 'md:w-1/2', 'bg-blue-900');
  });
});

