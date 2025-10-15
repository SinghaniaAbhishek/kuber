import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getAuthToken } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Settings {
  theme: string;
  currency: string;
  monthlyBudget: number;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  mode: string;
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  recurring: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextDue: string;
  cycle: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  type: 'owed_to_me' | 'i_owe';
  due: string;
  note: string;
}

export interface Challenge {
  id: string;
  name: string;
  limit: number;
  month: string;
  progress: number;
}

export interface AppData {
  user: User;
  settings: Settings;
  income: Income[];
  expenses: Expense[];
  goals: Goal[];
  bills: Bill[];
  subscriptions: Subscription[];
  debts: Debt[];
  challenges: Challenge[];
  badges: string[];
}

interface DataContextType {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  resetData: () => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>(() => ({
    user: { id: '', name: '', email: '' },
    settings: { theme: 'dreamy', currency: 'INR', monthlyBudget: 0 },
    income: [],
    expenses: [],
    goals: [],
    bills: [],
    subscriptions: [],
    debts: [],
    challenges: [],
    badges: [],
  }));

  const refreshData = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const me = await api.me();
      const [theme, budget, income, expenses, goals, bills, subscriptions, debts, challenges, badges] = await Promise.all([
        api.getTheme(),
        api.getBudget(),
        api.list('income'),
        api.list('expenses'),
        api.list('goals'),
        api.list('bills'),
        api.list('subscriptions'),
        api.list('debts'),
        api.list('challenges'),
        api.list('badges'),
      ]);
      const badgeNames = Array.isArray(badges) ? badges.map((b: any) => b.name) : [];
      setData({
        user: me,
        settings: { theme: theme.theme, currency: budget.currency, monthlyBudget: budget.monthlyBudget },
        income,
        expenses,
        goals,
        bills,
        subscriptions,
        debts,
        challenges,
        badges: badgeNames,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateData = (newData: Partial<AppData>) => {
    // local state only; backend writes should be performed by callers via api
    setData(prev => ({ ...prev, ...newData }));
  };

  const resetData = async () => {
    try {
      await api.resetData();
      // re-fetch after reset
      const [theme, budget] = await Promise.all([api.getTheme(), api.getBudget()]);
      setData(prev => ({
        ...prev,
        settings: { theme: theme.theme, currency: budget.currency, monthlyBudget: budget.monthlyBudget },
        income: [], expenses: [], goals: [], bills: [], subscriptions: [], debts: [], challenges: [], badges: [],
      }));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData, resetData, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
