# FSD Project

Full-Stack To-Do List Application with React frontend and Express backend.

## Quick Start

### Frontend (http://localhost:5173)
```bash
cd frontend
npm install
npm run dev
```

### Backend (http://localhost:3000)
```bash
cd backend
npm install
npm run dev
```

## Project Structure

- `frontend/` - React + TypeScript + Vite SPA
- `backend/` - Express + TypeScript REST API
- `.github/copilot-instructions.md` - Development conventions and standards

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Scripts

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm test` - Run tests

### Backend
- `npm run dev` - Start dev server
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm test` - Run tests
