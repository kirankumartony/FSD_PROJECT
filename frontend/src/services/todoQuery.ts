import type { TodoQueryFilters } from '../types';

export const buildTodosUrl = (
  apiBaseUrl: string,
  filters?: Partial<TodoQueryFilters>
): string => {
  const params = new URLSearchParams();

  if (filters?.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }

  if (filters?.priority && filters.priority !== 'all') {
    params.set('priority', filters.priority);
  }

  if (filters?.due && filters.due !== 'all') {
    params.set('due', filters.due);
  }

  const query = params.toString();
  return `${apiBaseUrl}/todos${query ? `?${query}` : ''}`;
};
