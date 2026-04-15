import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todoService';
import type {
  CreateTodoRequest,
  TodoDueFilter,
  TodoQueryFilters,
  TodoStatusFilter,
  UpdateTodoRequest,
} from '../types';

export class TodoController {
  private todoService = new TodoService();

  getAllTodos = (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const filters: TodoQueryFilters = {
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
        status: this.parseStatusFilter(req.query.status),
        priority: this.parsePriorityFilter(req.query.priority),
        due: this.parseDueFilter(req.query.due),
      };
      const result = this.todoService.getAllTodos(page, limit, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getTodoById = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = this.todoService.getTodoById(id);

      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  createTodo = (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: CreateTodoRequest = req.body;

      if (!body.title || typeof body.title !== 'string') {
        res.status(400).json({ error: 'Title is required and must be a string' });
        return;
      }

      const todo = this.todoService.createTodo(body);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  updateTodo = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body: UpdateTodoRequest = req.body;

      const todo = this.todoService.updateTodo(id, body);

      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  deleteTodo = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = this.todoService.deleteTodo(id);

      if (!deleted) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getMonthlyStats = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = this.todoService.getMonthlyStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };

  getConsistencyStats = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = this.todoService.getConsistencyStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };

  getTasksByPriority = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { priority } = req.params;
      const tasks = this.todoService.getTasksByPriority(priority);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  private parseStatusFilter(value: unknown): TodoStatusFilter | undefined {
    if (value === 'all' || value === 'active' || value === 'completed') {
      return value;
    }
    return undefined;
  }

  private parsePriorityFilter(value: unknown): 'low' | 'medium' | 'high' | undefined {
    if (value === 'low' || value === 'medium' || value === 'high') {
      return value;
    }
    return undefined;
  }

  private parseDueFilter(value: unknown): TodoDueFilter | undefined {
    if (
      value === 'all' ||
      value === 'overdue' ||
      value === 'today' ||
      value === 'upcoming' ||
      value === 'none'
    ) {
      return value;
    }
    return undefined;
  }
}
