import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_DATA } from '@/lib/mockData';

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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem('pfs_data');
    if (!stored) {
      localStorage.setItem('pfs_data', JSON.stringify(MOCK_DATA));
      return MOCK_DATA as AppData;
    }
    return JSON.parse(stored);
  });

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('pfs_data', JSON.stringify(updated));
      return updated;
    });
  };

  const resetData = () => {
    localStorage.setItem('pfs_data', JSON.stringify(MOCK_DATA));
    setData(MOCK_DATA as AppData);
  };

  return (
    <DataContext.Provider value={{ data, updateData, resetData }}>
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
