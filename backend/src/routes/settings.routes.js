import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Settings, Income, Expense, Goal, Bill, Subscription, Debt, Challenge, Badge } from '../models/FinanceModels.js';
import Papa from 'papaparse';

const router = Router();
router.use(authMiddleware);

router.get('/theme', async (req, res, next) => {
  try {
    const s = await Settings.findOne({ userId: req.user.id });
    res.json({ theme: s?.theme || 'dreamy' });
  } catch (e) { next(e); }
});

router.put('/theme', async (req, res, next) => {
  try {
    const { theme } = req.body;
    const s = await Settings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { theme } },
      { new: true, upsert: true }
    );
    res.json(s);
  } catch (e) { next(e); }
});

router.get('/budget', async (req, res, next) => {
  try {
    const s = await Settings.findOne({ userId: req.user.id });
    res.json({ monthlyBudget: s?.monthlyBudget || 0, currency: s?.currency || 'INR' });
  } catch (e) { next(e); }
});

router.put('/budget', async (req, res, next) => {
  try {
    const { monthlyBudget, currency } = req.body;
    const s = await Settings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { monthlyBudget, currency } },
      { new: true, upsert: true }
    );
    res.json(s);
  } catch (e) { next(e); }
});

router.post('/reset-data', async (req, res, next) => {
  try {
    await Promise.all([
      Income.deleteMany({ userId: req.user.id }),
      Expense.deleteMany({ userId: req.user.id }),
      Goal.deleteMany({ userId: req.user.id }),
      Bill.deleteMany({ userId: req.user.id }),
      Subscription.deleteMany({ userId: req.user.id }),
      Debt.deleteMany({ userId: req.user.id }),
      Challenge.deleteMany({ userId: req.user.id }),
      Badge.deleteMany({ userId: req.user.id }),
    ]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/email-reminders', async (req, res, next) => {
  try {
    const s = await Settings.findOne({ userId: req.user.id });
    res.json({ 
      emailReminders: s?.emailReminders ?? true, 
      reminderTime: s?.reminderTime ?? '09:00' 
    });
  } catch (e) { next(e); }
});

router.put('/email-reminders', async (req, res, next) => {
  try {
    const { emailReminders, reminderTime } = req.body;
    const s = await Settings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { emailReminders, reminderTime } },
      { new: true, upsert: true }
    );
    res.json(s);
  } catch (e) { next(e); }
});

router.get('/export', async (req, res, next) => {
  try {
    const [income, expenses, goals, bills, subscriptions, debts, challenges, badges] = await Promise.all([
      Income.find({ userId: req.user.id }).lean(),
      Expense.find({ userId: req.user.id }).lean(),
      Goal.find({ userId: req.user.id }).lean(),
      Bill.find({ userId: req.user.id }).lean(),
      Subscription.find({ userId: req.user.id }).lean(),
      Debt.find({ userId: req.user.id }).lean(),
      Challenge.find({ userId: req.user.id }).lean(),
      Badge.find({ userId: req.user.id }).lean(),
    ]);
    const csv = {
      income: Papa.unparse(income),
      expenses: Papa.unparse(expenses),
      goals: Papa.unparse(goals),
      bills: Papa.unparse(bills),
      subscriptions: Papa.unparse(subscriptions),
      debts: Papa.unparse(debts),
      challenges: Papa.unparse(challenges),
      badges: Papa.unparse(badges),
    };
    res.json(csv);
  } catch (e) { next(e); }
});

export default router;

