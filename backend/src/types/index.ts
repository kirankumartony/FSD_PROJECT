export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'health' | 'shopping' | 'finance' | 'learning' | 'other';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority;
  category?: Category;
  estimatedMinutes?: number;
  actualMinutes?: number;
  dueDate?: string;
  completedAt?: string;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  completed?: boolean;
  priority?: Priority;
  category?: Category;
  estimatedMinutes?: number;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
  priority?: Priority;
  category?: Category;
  estimatedMinutes?: number;
  actualMinutes?: number;
  dueDate?: string;
}

export type TodoStatusFilter = 'all' | 'active' | 'completed';
export type TodoDueFilter = 'all' | 'overdue' | 'today' | 'upcoming' | 'none';

export interface TodoQueryFilters {
  search?: string;
  status?: TodoStatusFilter;
  priority?: Priority;
  due?: TodoDueFilter;
}

