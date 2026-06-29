import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import Select from '@/components/Select';

vi.mock('i18next', () => ({
  t: (key: string) => key
}));

describe('Select', () => {
  it('should render label and options correctly', () => {
    const options = ['opt1', 'opt2'];
    render(
      <Select
        id="test-select"
        label="Select Label"
        options={options}
        translationGroup="group"
      />
    );

    expect(screen.getByLabelText('Select Label')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'group.opt1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'group.opt2' })).toBeInTheDocument();
  });

  it('should call onChange when an option is selected', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Select
        id="test-select"
        label="Select Label"
        options={['opt1', 'opt2']}
        translationGroup="group"
        onChange={onChange}
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), 'opt2');
    expect(onChange).toHaveBeenCalled();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select
        id="test-select"
        label="Select Label"
        options={['opt1']}
        translationGroup="group"
        ref={ref}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('should apply disabled state correctly', () => {
    render(
      <Select
        id="test-select"
        label="Select Label"
        options={['opt1']}
        translationGroup="group"
        disabled
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
