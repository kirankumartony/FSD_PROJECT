# FSD Project - Copilot Instructions

## Project Overview

**Project**: Full-Stack To-Do List Application  
**Architecture**: Monorepo with separate frontend and backend services  
**Tech Stack**:
- **Frontend**: React 18+ with TypeScript, Vite, ESLint + Prettier, Jest
- **Backend**: Node.js/Express with TypeScript
- **API**: REST API

---

## Directory Structure

```
FSD_project/
├── frontend/                 # React/Vite SPA
│   ├── src/
│   │   ├── components/      # Reusable React components (feature-based)
│   │   ├── pages/           # Page-level components (route containers)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API client functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles and theme
│   │   └── App.tsx          # Root component
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express.js server
│   ├── src/
│   │   ├── routes/          # Route handlers (feature-based)
│   │   ├── controllers/     # Business logic per feature
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   ├── services/        # Business logic and external integrations
│   │   ├── types/           # TypeScript interfaces/types
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   └── package.json
│
└── .github/
    └── copilot-instructions.md  # This file
```

---

## Frontend Development

### Component Structure (React + TypeScript)

**Feature-Based Organization**: Each feature has its own folder containing all related components.

```
components/todos/
├── TodoList.tsx           # Feature component
├── TodoItem.tsx           # Sub-component
├── TodoForm.tsx           # Sub-component
├── useTodos.ts            # Custom hook for todo logic
└── types.ts               # Feature-specific types
```

### React Best Practices

- **Functional Components Only**: Use React hooks, no class components.
- **TypeScript Types**: Define component prop interfaces explicitly.
  ```typescript
  interface TodoItemProps {
    id: string;
    title: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
  }
  ```
- **API Integration**: Use the `services/` folder for API calls.
  ```typescript
  // services/todoService.ts
  export const fetchTodos = async (): Promise<Todo[]> => {
    const response = await fetch('/api/todos');
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  };
  ```
- **Custom Hooks**: Extract stateful logic into hooks for reusability.
  ```typescript
  const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    useEffect(() => {
      fetchTodos().then(setTodos);
    }, []);
    return { todos, setTodos };
  };
  ```

### Naming Conventions (Frontend)

- **Components**: PascalCase (e.g., `TodoList.tsx`, `TodoItem.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTodos.ts`, `useForm.ts`)
- **Utilities/Services**: camelCase (e.g., `todoService.ts`, `formatDate.ts`)
- **Types/Interfaces**: PascalCase (e.g., `Todo`, `TodoProps`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `DEFAULT_PAGE_SIZE`)

### Code Standards

- **Linting & Formatting**: ESLint + Prettier configurations are in place.
- **Import Order**: Organize imports (React, libraries, local modules, types).
  ```typescript
  import React, { useState } from 'react';
  import axios from 'axios';
  import TodoList from './components/TodoList';
  import { fetchTodos } from './services/todoService';
  import type { Todo } from './types';
  ```

### Testing (Frontend)

- **Test Files**: Place `*.test.tsx` or `*.spec.tsx` alongside component files.
  ```
  components/TodoList.tsx
  components/TodoList.test.tsx
  ```
- **Jest + React Testing Library**: Test behavior, not implementation details.
  ```typescript
  describe('TodoList', () => {
    it('should render todo items', () => {
      const { getByText } = render(<TodoList todos={mockTodos} />);
      expect(getByText('Buy milk')).toBeInTheDocument();
    });
  });
  ```

---

## Backend Development

### Route & Controller Structure (Express + TypeScript)

**Feature-Based Organization**: Group routes, controllers, and services by feature.

```
routes/todos.ts
controllers/todoController.ts
services/todoService.ts
```

### Express Best Practices

- **Type Safety**: Use TypeScript for type-safe route handlers.
  ```typescript
  // routes/todos.ts
  import { Router, Request, Response, NextFunction } from 'express';
  import { TodoController } from '../controllers/todoController';
  
  const router = Router();
  const controller = new TodoController();
  
  router.get('/', (req, res, next) => controller.getTodos(req, res, next));
  router.post('/', (req, res, next) => controller.createTodo(req, res, next));
  ```
- **Middleware**: Use middleware for cross-cutting concerns (auth, validation, error handling).
- **Error Handling**: Implement centralized error handling middleware.
  ```typescript
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });
  ```

### Naming Conventions (Backend)

- **Files**: camelCase for services/utilities, descriptive names for routes/controllers
  - `todoController.ts`, `todoService.ts`, `todoRoutes.ts`
- **Classes**: PascalCase (e.g., `TodoController`, `TodoService`)
- **Functions/Methods**: camelCase (e.g., `fetchTodos`, `createTodo`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DB_CONNECTION_STRING`, `PORT`)

### Code Organization

```typescript
// controllers/todoController.ts
import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todoService';

export class TodoController {
  private todoService = new TodoService();
  
  async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await this.todoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      next(error);
    }
  }
  
  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;
      const todo = await this.todoService.createTodo(title);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }
}
```

### Testing (Backend)

- **Test Files**: Create `*.test.ts` files in the same structure.
- **Jest**: Unit tests for services and controllers.
  ```typescript
  describe('TodoService', () => {
    it('should create a todo', async () => {
      const todo = await todoService.createTodo('Buy milk');
      expect(todo.title).toBe('Buy milk');
    });
  });
  ```

---

## API Standards (REST)

### Base Endpoint
```
http://localhost:3000/api
```

### Endpoints for To-Do List

```
GET    /api/todos              # Fetch all todos
GET    /api/todos/:id          # Fetch a single todo
POST   /api/todos              # Create a new todo
PUT    /api/todos/:id          # Update a todo
DELETE /api/todos/:id          # Delete a todo
```

### Request/Response Format

**Success Response** (200, 201):
```json
{
  "id": "uuid",
  "title": "Buy milk",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Response** (400, 404, 500):
```json
{
  "error": "Validation failed",
  "message": "Title is required"
}
```

### Request Body (POST/PUT)
```json
{
  "title": "Buy milk",
  "completed": false
}
```

---

## Naming Conventions (Unified)

| Category | Pattern | Example |
|----------|---------|---------|
| React Components | PascalCase | `TodoList.tsx` |
| Hooks | `use` + PascalCase | `useTodos.ts` |
| Services/Utils | camelCase | `todoService.ts` |
| Types/Interfaces | PascalCase | `types/Todo.ts` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Folders | kebab-case | `components/`, `todo-list/` |
| Functions/Methods | camelCase | `fetchTodos()`, `createTodo()` |
| Variables | camelCase | `todos`, `isLoading` |

---

## Build & Run Commands

### Frontend
```bash
cd frontend

# Development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm test
```

### Backend
```bash
cd backend

# Development server (runs on http://localhost:3000)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Linting
npm run lint

# Run tests
npm test
```

---

## Testing Strategy

### Frontend (React Testing Library + Jest)
- **Unit Tests**: Test individual components and hooks.
- **Integration Tests**: Test feature workflows (e.g., create and list todos).
- **Test Coverage**: Aim for 80%+ coverage on components.
- **Running Tests**: `npm test` in the frontend directory.

### Backend (Jest)
- **Unit Tests**: Test services and utility functions.
- **Integration Tests**: Test controllers and route handlers.
- **Test Coverage**: Aim for 80%+ coverage on services and controllers.
- **Running Tests**: `npm test` in the backend directory.

---

## Common Development Workflows

### Adding a New Feature (e.g., Todo Filters)

**Frontend**:
1. Create `components/filters/FilterBar.tsx`
2. Create custom hook `hooks/useFilters.ts`
3. Update `pages/TodosPage.tsx` to integrate filter component
4. Write tests for `FilterBar.test.tsx` and `useFilters.test.ts`

**Backend**:
1. Extend `routes/todoRoutes.ts` with query parameters (e.g., `?status=completed`)
2. Update `controllers/todoController.ts` to handle filtering
3. Update `services/todoService.ts` with filter logic
4. Write tests for controller and service

### Updating API Response

1. Update type definitions in both frontend (`types/Todo.ts`) and backend
2. Update backend response in controller
3. Update frontend API service (`services/todoService.ts`)
4. Update React components that consume the data
5. Update tests to reflect the new structure

---

## Common Pitfalls & Anti-Patterns

### Frontend ❌
- **Don't**: Store complex state in props; use React Context, Redux, or Zustand for global state.
- **Don't**: Make API calls in components directly; use services in `useEffect` or custom hooks.
- **Don't**: Use `any` type; use TypeScript types and interfaces.
- **Don't**: Create deeply nested component folders; keep them flat or 2 levels deep.

### Backend ❌
- **Don't**: Put business logic in route handlers; use controllers and services.
- **Don't**: Forget to handle async errors; use try-catch or `.catch()` chains.
- **Don't**: Hardcode configuration values; use environment variables.
- **Don't**: Skip validation; validate all incoming request data.

### General ❌
- **Don't**: Commit dependencies (`node_modules/`) to git.
- **Don't**: Push sensitive data (API keys, secrets) to the repository.
- **Don't**: Ignore linting or formatting errors; fix them immediately.
- **Don't**: Write tests after the feature is complete; write them as you develop (TDD).

---

## Environment Setup

### Frontend `.env` (if needed)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend `.env`
```
PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/todo-app
```

---

## Git Workflow

- **Branch Naming**: `feature/`, `bugfix/`, `refactor/` prefix (e.g., `feature/todo-filters`)
- **Commits**: Write clear, descriptive messages (e.g., "Add todo filtering by status")
- **Pull Requests**: Include context, related issues, and testing notes

---

## Resources & Links

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Jest Testing Framework](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite Documentation](https://vitejs.dev/)
- [ESLint Configuration](https://eslint.org/docs/rules/)
- [Prettier Code Formatter](https://prettier.io/)

---

## Questions or Updates?

If this documentation needs updates or clarification, please file an issue or reach out to the team.
