import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import incomeRoutes from './routes/income.routes.js';
import expenseRoutes from './routes/expenses.routes.js';
import goalsRoutes from './routes/goals.routes.js';
import billsRoutes from './routes/bills.routes.js';
import subscriptionsRoutes from './routes/subscriptions.routes.js';
import debtsRoutes from './routes/debts.routes.js';
import challengesRoutes from './routes/challenges.routes.js';
import insightsRoutes from './routes/insights.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import badgesRoutes from './routes/badges.routes.js';
import assistantRoutes from './routes/assistant.routes.js';
import remindersRoutes from './routes/reminders.routes.js';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDoc = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(requestLogger);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/debts', debtsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errorHandler);

export default app;
