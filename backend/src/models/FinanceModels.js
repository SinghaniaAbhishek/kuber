import mongoose from 'mongoose';

const withUser = (fields) =>
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
      ...fields,
    },
    { timestamps: true }
  );

export const Settings = mongoose.model(
  'Settings',
  withUser({ theme: String, currency: String, monthlyBudget: Number })
);

export const Income = mongoose.model(
  'Income',
  withUser({ source: String, amount: Number, date: String })
);

export const Expense = mongoose.model(
  'Expense',
  withUser({ date: String, amount: Number, category: String, mode: String, note: String })
);

export const Goal = mongoose.model(
  'Goal',
  withUser({ name: String, target: Number, saved: Number })
);

export const Bill = mongoose.model(
  'Bill',
  withUser({ name: String, amount: Number, dueDate: String, recurring: String })
);

export const Subscription = mongoose.model(
  'Subscription',
  withUser({ name: String, amount: Number, nextDue: String, cycle: String })
);

export const Debt = mongoose.model(
  'Debt',
  withUser({ name: String, amount: Number, type: String, due: String, note: String })
);

export const Challenge = mongoose.model(
  'Challenge',
  withUser({ name: String, limit: Number, month: String, progress: Number })
);

export const Badge = mongoose.model(
  'Badge',
  withUser({ name: String })
);

// unify toJSON id mapping on all models
for (const m of [Settings, Income, Expense, Goal, Bill, Subscription, Debt, Challenge, Badge]) {
  m.schema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
}

