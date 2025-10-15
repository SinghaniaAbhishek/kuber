import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Expense, Goal, Bill } from '../models/FinanceModels.js';

const router = Router();
router.use(authMiddleware);

router.post('/summary', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [income, expenses, goals, bills] = await Promise.all([
      Income.find({ userId }),
      Expense.find({ userId }),
      Goal.find({ userId }),
      Bill.find({ userId }),
    ]);

    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthSpend = expenses
      .filter((e) => e.date?.startsWith(thisMonth))
      .reduce((s, e) => s + (e.amount || 0), 0);
    const totalSaved = goals.reduce((s, g) => s + (g.saved || 0), 0);
    const nextBills = bills
      .filter((b) => new Date(b.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 2);

    const human = `You're doing great — spent ₹${monthSpend} this month, saved ₹${totalSaved}. ` +
      (goals[0] ? `Progress on ${goals[0].name}: ${Math.round((goals[0].saved / goals[0].target) * 100)}%. ` : '') +
      (nextBills[0] ? `Upcoming bills: ${nextBills.map(b => `${b.name} on ${b.dueDate}`).join(', ')}.` : '');

    res.json({ message: human, data: { monthSpend, totalSaved, nextBills } });
  } catch (e) { next(e); }
});

export default router;

