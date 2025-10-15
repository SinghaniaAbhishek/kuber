import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/lib/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const Insights = () => {
  const { data } = useData();

  // Calculate monthly stats
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = data.expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const currentMonthIncome = data.income
    .filter(i => i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);

  const remaining = data.settings.monthlyBudget - currentMonthExpenses;

  // Prepare chart data - last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    const expenses = data.expenses
      .filter(e => e.date.startsWith(monthStr))
      .reduce((sum, e) => sum + e.amount, 0);

    const income = data.income
      .filter(i => i.date.startsWith(monthStr))
      .reduce((sum, i) => sum + i.amount, 0);

    monthlyData.push({
      month: monthName,
      income,
      expenses,
      savings: income - expenses
    });
  }

  // Category breakdown for current month
  const categoryBreakdown = data.expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const stats = [
    { label: 'This Month Spent', value: currentMonthExpenses, icon: TrendingDown, color: 'destructive' },
    { label: 'This Month Income', value: currentMonthIncome, icon: TrendingUp, color: 'success' },
    { label: 'Remaining Budget', value: remaining, icon: DollarSign, color: 'primary' },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Insights</h1>
          <p className="text-muted-foreground">Data-driven view of your finances</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 glass-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <Icon className={`h-5 w-5 text-${color}`} />
                </div>
                <p className={`text-3xl font-bold text-${color}`}>
                  {formatCurrency(value, data.settings.currency)}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Income vs Expense Trend */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Income vs Expense (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value), data.settings.currency)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">This Month's Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value), data.settings.currency)}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Spending Patterns */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4">Top Expense Categories</h3>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((cat, idx) => {
                const percentage = (cat.amount / currentMonthExpenses) * 100;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{cat.category}</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(cat.amount, data.settings.currency)} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-full rounded-full gradient-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4">Savings Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value), data.settings.currency)}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  name="Net Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Insights;
