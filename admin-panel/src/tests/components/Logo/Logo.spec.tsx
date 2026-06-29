import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import Logo from '@/components/Logo';

describe('Logo', () => {
  it('should render the title correctly', () => {
    const title = 'Admin Panel';
    render(
      <MemoryRouter>
        <Logo title={title} />
      </MemoryRouter>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should have a link pointing to /panel', () => {
    render(
      <MemoryRouter>
        <Logo title="Admin Panel" />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/panel');
  });
});
