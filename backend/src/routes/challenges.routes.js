import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Challenge } from '../models/FinanceModels.js';
import { createCRUDController } from '../controllers/crud.factory.js';

const router = Router();
router.use(authMiddleware);

const ctrl = createCRUDController(Challenge);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;

