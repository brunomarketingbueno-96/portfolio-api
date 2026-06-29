import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key
  })
}));

vi.mock('@/contexts/AuthContext');

vi.mock('@/components/LogoutButton', () => ({
  default: ({ onClick, label }: any) => (
    <button onClick={onClick}>{label}</button>
  )
}));

describe('UserMenu', () => {
  const mockLogout = vi.fn();
  const mockUser = { name: 'John Doe', avatarUrl: null };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout
    } as any);
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('should render user name correctly', () => {
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should toggle dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /john doe/i });
    await user.click(menuButton);

    expect(screen.getByRole('link', { name: /my profile/i })).toBeInTheDocument();
  });

  it('should call logout when confirmed', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /john doe/i }));
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should not call logout when cancelled', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => false);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /john doe/i }));
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockLogout).not.toHaveBeenCalled();
  });
});
