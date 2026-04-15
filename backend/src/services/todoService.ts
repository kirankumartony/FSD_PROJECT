import { v4 as uuidv4 } from 'uuid';
import type { Todo, CreateTodoRequest, TodoQueryFilters, UpdateTodoRequest } from '../types';

// In-memory storage (replace with database in production)
const todos = new Map<string, Todo>();

type MonthlyStat = {
  month: string;
  created: number;
  completed: number;
};

type ConsistencyStat = {
  totalTodos: number;
  completedTodos: number;
  completionRate: number;
  todosInLast30Days: number;
  daysWithTodosInLast30Days: number;
  consistencyScore: number;
};

type StatsCache = {
  monthly: MonthlyStat[] | null;
  consistency: ConsistencyStat | null;
  timestamp: number;
};

let statsCache: StatsCache = {
  monthly: null,
  consistency: null,
  timestamp: 0,
};

const CACHE_DURATION = 5000;

export class TodoService {
  getAllTodos(
    page: number = 1,
    limit: number = 50,
    filters: TodoQueryFilters = {}
  ): { todos: Todo[]; total: number; page: number; pages: number } {
    const filteredTodos = Array.from(todos.values())
      .filter((todo) => this.matchesFilters(todo, filters))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filteredTodos.length;
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedTodos = filteredTodos.slice(start, start + limit);

    return { todos: paginatedTodos, total, page, pages };
  }

  getTodoById(id: string): Todo | undefined {
    return todos.get(id);
  }

  createTodo(data: CreateTodoRequest): Todo {
    const id = uuidv4();
    const now = new Date().toISOString();
    const todo: Todo = {
      id,
      title: data.title,
      completed: data.completed || false,
      priority: data.priority,
      category: data.category,
      estimatedMinutes: data.estimatedMinutes,
      dueDate: data.dueDate,
      createdAt: now,
      updatedAt: now,
    };
    todos.set(id, todo);
    this.invalidateCache();
    return todo;
  }

  updateTodo(id: string, data: UpdateTodoRequest): Todo | undefined {
    const todo = todos.get(id);
    if (!todo) return undefined;

    const updated: Todo = {
      ...todo,
      ...data,
      id: todo.id,
      createdAt: todo.createdAt,
      updatedAt: new Date().toISOString(),
      completedAt: data.completed && !todo.completed ? new Date().toISOString() : todo.completedAt,
    };
    todos.set(id, updated);
    this.invalidateCache();
    return updated;
  }

  deleteTodo(id: string): boolean {
    const result = todos.delete(id);
    if (result) {
      this.invalidateCache();
    }
    return result;
  }

  getMonthlyStats() {
    const now = Date.now();
    if (statsCache.monthly && now - statsCache.timestamp < CACHE_DURATION) {
      return statsCache.monthly;
    }

    const stats = new Map<string, { created: number; completed: number }>();
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const key = date.toISOString().substring(0, 7);
      stats.set(key, { created: 0, completed: 0 });
    }

    todos.forEach((todo) => {
      const createdMonth = todo.createdAt.substring(0, 7);
      if (stats.has(createdMonth)) {
        const current = stats.get(createdMonth)!;
        current.created++;
      }

      if (todo.completed) {
        const completedMonth = todo.updatedAt.substring(0, 7);
        if (stats.has(completedMonth)) {
          const current = stats.get(completedMonth)!;
          current.completed++;
        }
      }
    });

    const result = Array.from(stats.entries()).map(([month, data]) => ({ month, ...data }));
    statsCache.monthly = result;
    statsCache.timestamp = now;
    return result;
  }

  getConsistencyStats() {
    const now = Date.now();
    if (statsCache.consistency && now - statsCache.timestamp < CACHE_DURATION) {
      return statsCache.consistency;
    }

    const allTodos = Array.from(todos.values());
    const totalTodos = allTodos.length;
    const completedTodos = allTodos.filter((t) => t.completed).length;
    const completionRate = totalTodos === 0 ? 0 : ((completedTodos / totalTodos) * 100).toFixed(2);

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const last30Days = allTodos.filter((t) => {
      const createdDate = new Date(t.createdAt);
      return createdDate >= thirtyDaysAgo;
    });

    const daysWithTodos = new Set(
      last30Days.map((t) => new Date(t.createdAt).toISOString().substring(0, 10))
    ).size;

    const result = {
      totalTodos,
      completedTodos,
      completionRate: parseFloat(completionRate as string),
      todosInLast30Days: last30Days.length,
      daysWithTodosInLast30Days: daysWithTodos,
      consistencyScore: daysWithTodos,
    };

    statsCache.consistency = result;
    statsCache.timestamp = now;
    return result;
  }

  getTasksByPriority(priority: string) {
    return Array.from(todos.values()).filter((t) => t.priority === priority);
  }

  private invalidateCache() {
    statsCache = {
      monthly: null,
      consistency: null,
      timestamp: 0,
    };
  }

  private matchesFilters(todo: Todo, filters: TodoQueryFilters): boolean {
    const search = filters.search?.trim().toLowerCase();
    if (search && !todo.title.toLowerCase().includes(search)) {
      return false;
    }

    if (filters.status === 'active' && todo.completed) {
      return false;
    }

    if (filters.status === 'completed' && !todo.completed) {
      return false;
    }

    if (filters.priority && todo.priority !== filters.priority) {
      return false;
    }

    if (!filters.due || filters.due === 'all') {
      return true;
    }

    if (filters.due === 'none') {
      return !todo.dueDate;
    }

    if (!todo.dueDate || todo.completed) {
      return false;
    }

    const now = new Date();
    const dueDate = new Date(todo.dueDate);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    if (filters.due === 'overdue') {
      return dueDate < now;
    }

    if (filters.due === 'today') {
      return dueDate >= startOfToday && dueDate < endOfToday;
    }

    if (filters.due === 'upcoming') {
      return dueDate >= endOfToday;
    }

    return true;
  }
}
