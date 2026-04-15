import { useEffect, type FC } from 'react';
import type { Priority, Category } from '../../types';
import { reminderManager } from '../../services/reminderManager';
import '../../styles/TodoItem.css';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority;
  category?: Category;
  estimatedMinutes?: number;
  dueDate?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: FC<TodoItemProps> = ({
  id,
  title,
  completed,
  priority,
  category,
  estimatedMinutes,
  dueDate,
  onToggle,
  onDelete,
}) => {
  useEffect(() => {
    if (dueDate && !completed) {
      reminderManager.setupReminder({ id, title, priority, dueDate });
    }
    return () => {
      if (dueDate && !completed) {
        reminderManager.clearReminder(id);
      }
    };
  }, [id, title, dueDate, completed, priority]);

  const getPriorityColor = (p?: Priority) => {
    switch (p) {
      case 'high':
        return '#ff4757';
      case 'medium':
        return '#ffa502';
      case 'low':
        return '#2ed573';
      default:
        return 'transparent';
    }
  };

  const getCategoryIcon = (cat?: Category) => {
    const icons: Record<string, string> = {
      work: '💼',
      personal: '👤',
      health: '💪',
      shopping: '🛒',
      finance: '💰',
      learning: '📚',
      other: '📌',
    };
    return icons[cat || 'other'];
  };

  const getDueDateInfo = () => {
    if (!dueDate) return null;
    const { text, status } = reminderManager.getTimeRemaining(dueDate);
    return { text, status };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="todo-checkbox"
        aria-label={`Toggle ${title}`}
      />
      <div className="todo-content">
        <span className="todo-title">{title}</span>
        <div className="todo-meta">
          {priority && (
            <span
              className="priority-indicator"
              style={{ backgroundColor: getPriorityColor(priority) }}
              title={`Priority: ${priority}`}
            >
              {priority.charAt(0).toUpperCase()}
            </span>
          )}
          {category && (
            <span className="category-badge" title={`Category: ${category}`}>
              {getCategoryIcon(category)}
            </span>
          )}
          {estimatedMinutes && (
            <span className="time-estimate" title={`Estimated time: ${estimatedMinutes}m`}>
              ⏱ {estimatedMinutes < 60 ? `${estimatedMinutes}m` : `${Math.round(estimatedMinutes / 60)}h`}
            </span>
          )}
          {dueDateInfo && (
            <span
              className={`due-date-badge due-date-${dueDateInfo.status}`}
              title={`Due: ${reminderManager.formatDueDate(dueDate!)}`}
            >
              📅 {dueDateInfo.text}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="todo-delete"
        aria-label={`Delete ${title}`}
      >
        ✕
      </button>
    </div>
  );
};
