import { useState, type FC } from 'react';
import type { TodoDraftData, TodoQueryFilters } from '../types';
import { useTodos } from '../hooks/useTodos';
import { TodoForm } from '../components/todos/TodoForm';
import { TodoFilters } from '../components/todos/TodoFilters';
import { TodoList } from '../components/todos/TodoList';
import { TimeDisplay } from '../components/TimeDisplay';
import { TodoStats } from '../components/TodoStats';
import '../styles/TodosPage.css';

export const TodosPage: FC = () => {
  const [filters, setFilters] = useState<TodoQueryFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    due: 'all',
  });
  const { todos, loading, error, addTodo, toggleTodo, removeTodo } = useTodos(filters);

  const handleAddTodo = async (title: string, data?: TodoDraftData): Promise<void> => {
    await addTodo(title, data);
  };

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.due !== 'all';

  if (error && todos.length === 0) {
    return (
      <div className="todos-page error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="todos-page">
      <TimeDisplay />
      <h1>My Todos</h1>
      <TodoForm onSubmit={handleAddTodo} disabled={loading} />
      <TodoFilters
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({
            search: '',
            status: 'all',
            priority: 'all',
            due: 'all',
          })
        }
      />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={removeTodo}
        loading={loading}
        emptyMessage={
          hasActiveFilters
            ? 'No tasks match the current filters.'
            : 'No todos yet. Add one to get started!'
        }
      />
      <TodoStats />
    </div>
  );
};
