import type { ChangeEvent, FC } from 'react';
import type { TodoQueryFilters } from '../../types';
import '../../styles/TodoFilters.css';

interface TodoFiltersProps {
  filters: TodoQueryFilters;
  onChange: (filters: TodoQueryFilters) => void;
  onReset: () => void;
}

export const TodoFilters: FC<TodoFiltersProps> = ({ filters, onChange, onReset }) => {
  const updateFilter =
    <K extends keyof TodoQueryFilters>(key: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({
        ...filters,
        [key]: event.target.value,
      } as TodoQueryFilters);
    };

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.due !== 'all';

  return (
    <section className="todo-filters" aria-label="Todo filters">
      <div className="todo-filters__header">
        <h2>Find Tasks Faster</h2>
        <p>Search your list and narrow it by completion, priority, or due date.</p>
      </div>

      <div className="todo-filters__controls">
        <label className="todo-filters__field">
          <span>Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={updateFilter('search')}
            placeholder="Search by title"
            aria-label="Search todos"
          />
        </label>

        <label className="todo-filters__field">
          <span>Status</span>
          <select value={filters.status} onChange={updateFilter('status')} aria-label="Filter by status">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label className="todo-filters__field">
          <span>Priority</span>
          <select
            value={filters.priority}
            onChange={updateFilter('priority')}
            aria-label="Filter by priority"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="todo-filters__field">
          <span>Due</span>
          <select value={filters.due} onChange={updateFilter('due')} aria-label="Filter by due date">
            <option value="all">All</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="none">No due date</option>
          </select>
        </label>
      </div>

      <div className="todo-filters__footer">
        <span>{hasActiveFilters ? 'Filters applied' : 'Showing all tasks'}</span>
        <button type="button" onClick={onReset} disabled={!hasActiveFilters}>
          Reset
        </button>
      </div>
    </section>
  );
};
