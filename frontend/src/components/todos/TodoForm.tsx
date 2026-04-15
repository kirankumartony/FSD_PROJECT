import { useState, type FC } from 'react';
import type { Priority, TodoDraftData } from '../../types';
import { DateTimePicker } from '../DateTimePicker';
import { PrioritySelector } from '../PrioritySelector';
import '../../styles/TodoForm.css';

interface TodoFormProps {
  onSubmit: (title: string, data?: TodoDraftData) => Promise<void>;
  disabled?: boolean;
}

export const TodoForm: FC<TodoFormProps> = ({ onSubmit, disabled = false }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [priority, setPriority] = useState<Priority | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      await onSubmit(input.trim(), {
        priority,
        dueDate,
      });
      setInput('');
      setDueDate(undefined);
      setPriority(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todo-form-wrapper">
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
          disabled={disabled || loading}
          aria-label="New todo title"
        />
        <button type="submit" disabled={disabled || loading} className="todo-submit">
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      <div className="form-options">
        <DateTimePicker onSelect={setDueDate} defaultValue={dueDate} />
        <PrioritySelector selectedPriority={priority} onSelect={setPriority} />
      </div>

      {(priority || dueDate) && (
        <div className="applied-suggestions">
          {priority && <span className="suggestion-tag priority">Priority: {priority}</span>}
          {dueDate && (
            <span className="suggestion-tag date">
              ðŸ“…{' '}
              {new Date(dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
