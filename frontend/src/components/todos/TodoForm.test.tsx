import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TodoForm } from './TodoForm';

jest.mock('../DateTimePicker', () => ({
  DateTimePicker: ({ onSelect }: { onSelect: (dateTime: string | undefined) => void }) => (
    <button type="button" onClick={() => onSelect('2026-04-15T09:00')}>
      Set Due Date
    </button>
  ),
}));

jest.mock('../PrioritySelector', () => ({
  PrioritySelector: ({ onSelect }: { onSelect: (priority: 'low' | 'medium' | 'high') => void }) => (
    <button type="button" onClick={() => onSelect('high')}>
      Set High Priority
    </button>
  ),
}));

describe('TodoForm', () => {
  it('submits a trimmed title with manual metadata', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<TodoForm onSubmit={onSubmit} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('New todo title'), {
        target: { value: '  Finish report  ' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Set Due Date' }));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Set High Priority' }));
    });

    await waitFor(() => {
      expect(screen.getByText('Priority: high')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    });

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith('Finish report', {
        priority: 'high',
        dueDate: '2026-04-15T09:00',
      })
    );
  });

  it('does not submit an empty title', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<TodoForm onSubmit={onSubmit} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('New todo title'), {
        target: { value: '   ' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
