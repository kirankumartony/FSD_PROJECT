import { TodoService } from '../todoService';

describe('TodoService', () => {
  const service = new TodoService();

  const clearTodos = () => {
    for (const todo of service.getAllTodos(1, 1000).todos) {
      service.deleteTodo(todo.id);
    }
  };

  beforeEach(() => {
    clearTodos();
  });

  afterEach(() => {
    clearTodos();
  });

  it('creates and updates todos with completion metadata', () => {
    const created = service.createTodo({
      title: 'Finish release notes',
      priority: 'high',
      category: 'work',
    });

    expect(created.completed).toBe(false);
    expect(created.createdAt).toBeDefined();

    const updated = service.updateTodo(created.id, { completed: true });

    expect(updated).toBeDefined();
    expect(updated?.completed).toBe(true);
    expect(updated?.completedAt).toBeDefined();
  });

  it('returns matching priority-filtered todos', () => {
    service.createTodo({
      title: 'Write project report',
      priority: 'high',
      category: 'work',
    });

    service.createTodo({
      title: 'Buy groceries',
      priority: 'low',
      category: 'shopping',
    });

    expect(service.getTasksByPriority('high')).toHaveLength(1);
    expect(service.getTasksByPriority('low')).toHaveLength(1);
  });

  it('filters todos by search, status, priority, and due date', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-14T10:00:00.000Z'));

    const completed = service.createTodo({
      title: 'Ship release notes',
      priority: 'high',
      dueDate: '2026-04-14T08:00:00.000Z',
    });
    service.updateTodo(completed.id, { completed: true });

    service.createTodo({
      title: 'Review release notes',
      priority: 'medium',
      dueDate: '2026-04-14T18:00:00.000Z',
    });
    service.createTodo({
      title: 'Plan roadmap',
      priority: 'high',
      dueDate: '2026-04-16T09:00:00.000Z',
    });
    service.createTodo({
      title: 'Inbox zero',
      priority: 'low',
    });

    expect(service.getAllTodos(1, 50, { search: 'release' }).total).toBe(2);
    expect(service.getAllTodos(1, 50, { status: 'completed' }).todos).toHaveLength(1);
    expect(service.getAllTodos(1, 50, { status: 'active', priority: 'high' }).todos).toHaveLength(1);
    expect(service.getAllTodos(1, 50, { due: 'today' }).todos).toHaveLength(1);
    expect(service.getAllTodos(1, 50, { due: 'upcoming' }).todos).toHaveLength(1);
    expect(service.getAllTodos(1, 50, { due: 'none' }).todos).toHaveLength(1);

    jest.useRealTimers();
  });
});
