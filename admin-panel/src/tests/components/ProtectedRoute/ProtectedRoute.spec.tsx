import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext');

vi.mock('@/components/FullScreenLoader', () => ({
  default: () => <div data-testid="loader" />
}));

describe('ProtectedRoute', () => {
  it('should render FullScreenLoader when checkingAuth is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: true,
      isAuthenticated: false
    } as any);

    render(<ProtectedRoute />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should redirect to /login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: false,
      isAuthenticated: false
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render child route when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: false,
      isAuthenticated: true
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute />}>
            <Route path="" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
