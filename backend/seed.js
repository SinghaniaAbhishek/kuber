import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import User from './src/models/User.js';
import { Settings, Income, Expense, Goal, Bill, Subscription, Debt, Challenge, Badge } from './src/models/FinanceModels.js';
import bcrypt from 'bcrypt';

const MOCK_DATA = {
  user: { name: 'Abhishek', email: 'abhishek@example.com', password: 'password' },
  settings: { theme: 'dreamy', currency: 'INR', monthlyBudget: 25000 },
  income: [
    { source: 'Pocket Money', amount: 20000, date: '2025-09-01' },
    { source: 'Freelance App', amount: 8000, date: '2025-09-15' },
  ],
  expenses: [
    { date: '2025-10-02', amount: 240, category: 'Food', mode: 'UPI', note: 'Lunch Zomato' },
    { date: '2025-10-04', amount: 1200, category: 'Transport', mode: 'Card', note: 'Monthly pass' },
    { date: '2025-10-07', amount: 599, category: 'Subscriptions', mode: 'Card', note: 'Netflix' },
    { date: '2025-10-10', amount: 3500, category: 'Shopping', mode: 'Card', note: 'Shoes' },
  ],
  goals: [
    { name: 'Trip to Goa', target: 10000, saved: 7500 },
    { name: 'New Laptop', target: 60000, saved: 15000 },
  ],
  bills: [
    { name: 'Electricity', amount: 1800, dueDate: '2025-10-20', recurring: 'monthly' },
    { name: 'WiFi', amount: 699, dueDate: '2025-10-18', recurring: 'monthly' },
  ],
  subscriptions: [
    { name: 'Spotify', amount: 99, nextDue: '2025-11-05', cycle: 'monthly' },
    { name: 'Netflix', amount: 599, nextDue: '2025-11-25', cycle: 'monthly' },
  ],
  debts: [
    { name: 'Rohit', amount: 1200, type: 'owed_to_me', due: '2025-11-01', note: 'Dinner' },
    { name: 'Sara', amount: 500, type: 'i_owe', due: '2025-10-30', note: 'Movie' },
  ],
  challenges: [
    { name: 'Under ₹5000 Oct', limit: 5000, month: '2025-10', progress: 3800 },
  ],
  badges: [ 'first-saver' ],
};

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is required');
  await connectDB(uri);
  const existing = await User.findOne({ email: MOCK_DATA.user.email });
  if (existing) {
    console.log('Seed data already present. Skipping.');
    await mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(MOCK_DATA.user.password, 10);
  const user = await User.create({ name: MOCK_DATA.user.name, email: MOCK_DATA.user.email, password: hash });
  await Settings.create({ userId: user._id, ...MOCK_DATA.settings });
  await Income.insertMany(MOCK_DATA.income.map(r => ({ ...r, userId: user._id })));
  await Expense.insertMany(MOCK_DATA.expenses.map(r => ({ ...r, userId: user._id })));
  await Goal.insertMany(MOCK_DATA.goals.map(r => ({ ...r, userId: user._id })));
  await Bill.insertMany(MOCK_DATA.bills.map(r => ({ ...r, userId: user._id })));
  await Subscription.insertMany(MOCK_DATA.subscriptions.map(r => ({ ...r, userId: user._id })));
  await Debt.insertMany(MOCK_DATA.debts.map(r => ({ ...r, userId: user._id })));
  await Challenge.insertMany(MOCK_DATA.challenges.map(r => ({ ...r, userId: user._id })));
  await Badge.insertMany(MOCK_DATA.badges.map(name => ({ name, userId: user._id })));

  console.log('Seed completed');
  await mongoose.disconnect();
}

seed().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});

