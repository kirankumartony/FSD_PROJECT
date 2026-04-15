import type { Todo, Category, Priority, TodoQueryFilters } from '../types';
import { buildTodosUrl } from './todoQuery';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const fetchTodos = async (filters?: Partial<TodoQueryFilters>): Promise<Todo[]> => {
  const response = await fetch(buildTodosUrl(API_BASE_URL, filters));
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  const data = await response.json();
  return data.todos || [];
};

export const fetchTodo = async (id: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }
  return response.json();
};

export const createTodo = async (
  title: string,
  priority?: Priority,
  category?: Category,
  estimatedMinutes?: number,
  dueDate?: string
): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, priority, category, estimatedMinutes, dueDate }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

export const getTodosByPriority = async (priority: string): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos/filter/priority/${priority}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos by priority');
  }
  return response.json();
};
