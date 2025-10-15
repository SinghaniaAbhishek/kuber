import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Bill, Expense } from '../models/FinanceModels.js';
import { createCRUDController } from '../controllers/crud.factory.js';

const router = Router();
router.use(authMiddleware);

const ctrl = createCRUDController(Bill);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.patch('/mark-paid/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { autoExpense = true } = req.body;
    const bill = await Bill.findOne({ _id: id, userId: req.user.id });
    if (!bill) return res.status(404).json({ error: { message: 'Not found' } });

    // advance due date based on recurring
    const d = new Date(bill.dueDate);
    if (bill.recurring === 'monthly') d.setMonth(d.getMonth() + 1);
    if (bill.recurring === 'yearly') d.setFullYear(d.getFullYear() + 1);
    bill.dueDate = d.toISOString().slice(0, 10);
    await bill.save();

    if (autoExpense) {
      await Expense.create({
        userId: req.user.id,
        date: new Date().toISOString().slice(0, 10),
        amount: bill.amount,
        category: 'Bills',
        mode: 'Auto',
        note: `Paid ${bill.name}`,
      });
    }

    res.json(bill);
  } catch (e) {
    next(e);
  }
});

export default router;

