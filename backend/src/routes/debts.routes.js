import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Debt } from '../models/FinanceModels.js';
import { createCRUDController } from '../controllers/crud.factory.js';

const router = Router();
router.use(authMiddleware);

const ctrl = createCRUDController(Debt);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.patch('/mark-paid/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const debt = await Debt.findOne({ _id: id, userId: req.user.id });
    if (!debt) return res.status(404).json({ error: { message: 'Not found' } });
    // Mark paid by deleting entry for simplicity; could also add status
    await Debt.deleteOne({ _id: id, userId: req.user.id });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;

