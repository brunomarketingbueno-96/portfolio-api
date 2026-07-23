import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import LogoutButton from '@/components/Buttons/LogoutButton';

describe('LogoutButton', () => {
  it('should render the label correctly', () => {
    const label = 'Logout';
    render(<LogoutButton onClick={vi.fn()} label={label} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} label="Logout" />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
