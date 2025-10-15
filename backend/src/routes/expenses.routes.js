import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Expense, Challenge } from '../models/FinanceModels.js';
import { createCRUDController } from '../controllers/crud.factory.js';

const router = Router();
const ctrl = createCRUDController(Expense);

router.use(authMiddleware);
router.get('/', ctrl.list);
router.post('/', async (req, res, next) => {
  try {
    const created = await Expense.create({ ...req.body, userId: req.user.id });
    // auto-update challenges: increment progress for matching month
    const month = created.date?.slice(0, 7);
    if (month) {
      await Challenge.updateMany(
        { userId: req.user.id, month },
        { $inc: { progress: created.amount || 0 } }
      );
    }
    res.status(201).json(created);
  } catch (e) { next(e); }
});
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;

