import type { FC } from 'react';
import { TodoItem } from './TodoItem';
import type { Todo } from '../../types';
import '../../styles/TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  loading = false,
  emptyMessage = 'No todos yet. Add one to get started!',
}) => {
  if (loading) {
    return <div className="todo-list loading">Loading todos...</div>;
  }

  if (todos.length === 0) {
    return <div className="todo-list empty">{emptyMessage}</div>;
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          priority={todo.priority}
          category={todo.category}
          estimatedMinutes={todo.estimatedMinutes}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
