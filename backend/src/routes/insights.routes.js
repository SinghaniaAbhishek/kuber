import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Expense } from '../models/FinanceModels.js';

const router = Router();
router.use(authMiddleware);

router.get('/income-vs-expense', async (req, res, next) => {
  try {
    const now = new Date();
    const months = [...Array(6).keys()].map((i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    const [income, expenses] = await Promise.all([
      Income.find({ userId: req.user.id }).lean(),
      Expense.find({ userId: req.user.id }).lean(),
    ]);

    const summarize = (rows, dateKey, amountKey) => {
      const map = Object.fromEntries(months.map((m) => [m, 0]));
      for (const r of rows) {
        const m = r[dateKey].slice(0, 7);
        if (map[m] !== undefined) map[m] += r[amountKey];
      }
      return months.map((m) => ({ month: m, amount: map[m] }));
    };

    res.json({ income: summarize(income, 'date', 'amount'), expenses: summarize(expenses, 'date', 'amount') });
  } catch (e) { next(e); }
});

router.get('/activity', async (req, res, next) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    const rows = await Expense.find({ userId: req.user.id }).lean();
    const map = {};
    for (const r of rows) {
      const d = r.date; // YYYY-MM-DD
      map[d] = (map[d] || 0) + r.amount;
    }
    res.json(map);
  } catch (e) { next(e); }
});

export default router;

