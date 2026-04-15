import { useState, useEffect } from 'react';
import type { Todo, TodoDraftData, TodoQueryFilters } from '../types';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';

export const useTodos = (filters: TodoQueryFilters) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodos(filters);
        setTodos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [filters]);

  const reloadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos(filters);
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string, data?: TodoDraftData) => {
    try {
      await createTodo(
        title,
        data?.priority,
        data?.category,
        data?.estimatedMinutes,
        data?.dueDate
      );
      await reloadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await updateTodo(id, { completed: !todo.completed });
      await reloadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  };

  const removeTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      await reloadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  };

  return { todos, loading, error, addTodo, toggleTodo, removeTodo };
};
