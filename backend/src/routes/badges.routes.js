import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Badge } from '../models/FinanceModels.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const rows = await Badge.find({ userId: req.user.id });
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const row = await Badge.create({ userId: req.user.id, name });
    res.status(201).json(row);
  } catch (e) { next(e); }
});

export default router;

