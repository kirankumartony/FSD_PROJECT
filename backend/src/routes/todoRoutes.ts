import { Router } from 'express';
import { TodoController } from '../controllers/todoController';

const router = Router();
const controller = new TodoController();

// Stats endpoints
router.get('/stats/monthly', controller.getMonthlyStats);
router.get('/stats/consistency', controller.getConsistencyStats);

// Filter endpoints
router.get('/filter/priority/:priority', controller.getTasksByPriority);

// CRUD endpoints (must be last to avoid conflicts)
router.get('/', controller.getAllTodos);
router.get('/:id', controller.getTodoById);
router.post('/', controller.createTodo);
router.put('/:id', controller.updateTodo);
router.delete('/:id', controller.deleteTodo);

export default router;
