import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Expense, Goal, Bill, Subscription } from '../models/FinanceModels.js';

const router = Router();
router.use(authMiddleware);

router.get('/stats', async (req, res, next) => {
  try {
    const [income, expenses, goals, bills, subs] = await Promise.all([
      Income.find({ userId: req.user.id }).lean(),
      Expense.find({ userId: req.user.id }).lean(),
      Goal.find({ userId: req.user.id }).lean(),
      Bill.find({ userId: req.user.id }).lean(),
      Subscription.find({ userId: req.user.id }).lean(),
    ]);
    const totalIncome = income.reduce((s, r) => s + (r.amount || 0), 0);
    const totalExpenses = expenses.reduce((s, r) => s + (r.amount || 0), 0);
    const balance = totalIncome - totalExpenses;
    const saved = goals.reduce((s, g) => s + (g.saved || 0), 0);
    res.json({ totalIncome, totalExpenses, balance, saved, billsDue: bills.length, subscriptions: subs.length });
  } catch (e) { next(e); }
});

router.get('/charts', async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).lean();
    const byCategory = {};
    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    }
    res.json({ byCategory });
  } catch (e) { next(e); }
});

export default router;

