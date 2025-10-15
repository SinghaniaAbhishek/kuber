import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Goal, Badge } from '../models/FinanceModels.js';
import { createCRUDController } from '../controllers/crud.factory.js';

const router = Router();
router.use(authMiddleware);

const ctrl = createCRUDController(Goal);
router.get('/', ctrl.list);
router.post('/', ctrl.create);

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
    if (!goal) return res.status(404).json({ error: { message: 'Not found' } });
    if (goal.saved >= goal.target) {
      await Badge.findOneAndUpdate(
        { userId: req.user.id, name: 'goal-completed' },
        { userId: req.user.id, name: 'goal-completed' },
        { upsert: true, new: true }
      );
    }
    res.json(goal);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', ctrl.remove);

export default router;

