import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Subscription, Expense } from '../models/FinanceModels.js';
import { createCRUDController } from '../controllers/crud.factory.js';

const router = Router();
router.use(authMiddleware);

const ctrl = createCRUDController(Subscription);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.patch('/mark-paid/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { autoExpense = true } = req.body;
    const sub = await Subscription.findOne({ _id: id, userId: req.user.id });
    if (!sub) return res.status(404).json({ error: { message: 'Not found' } });

    const d = new Date(sub.nextDue);
    if (sub.cycle === 'monthly') d.setMonth(d.getMonth() + 1);
    if (sub.cycle === 'yearly') d.setFullYear(d.getFullYear() + 1);
    sub.nextDue = d.toISOString().slice(0, 10);
    await sub.save();

    if (autoExpense) {
      await Expense.create({
        userId: req.user.id,
        date: new Date().toISOString().slice(0, 10),
        amount: sub.amount,
        category: 'Subscriptions',
        mode: 'Auto',
        note: `Paid ${sub.name}`,
      });
    }

    res.json(sub);
  } catch (e) {
    next(e);
  }
});

export default router;

