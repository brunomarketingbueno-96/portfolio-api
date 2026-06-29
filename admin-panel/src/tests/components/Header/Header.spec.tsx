import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import Header from '@/components/Header';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key
  })
}));

vi.mock('@/components/Logo', () => ({
  default: ({ title }: { title: string }) => <div data-testid="logo" title={title} />
}));

vi.mock('@/components/UserMenu', () => ({
  default: () => <div data-testid="user-menu" />
}));

describe('Header', () => {
  it('renders components correctly', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  it('passes the correct title to Logo', () => {
    render(<Header />);

    expect(screen.getByTestId('logo')).toHaveAttribute('title', 'Admin Panel');
  });
});
