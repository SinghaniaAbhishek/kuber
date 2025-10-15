import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, getDaysUntil } from '@/lib/utils/format';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Plus, TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const { data } = useData();

  const totalIncome = data.income.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const budgetRemaining = data.settings.monthlyBudget - totalExpense;

  // Category-wise expenses for pie chart
  const categoryData = data.expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))'];

  // Upcoming bills sorted by date
  const upcomingBills = [
    ...data.bills.map(b => ({ ...b, date: b.dueDate, type: 'bill' as const })),
    ...data.subscriptions.map(s => ({ ...s, date: s.nextDue, type: 'subscription' as const }))
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const stats = [
    { label: 'Total Income', value: totalIncome, icon: TrendingUp, color: 'success' },
    { label: 'Total Expense', value: totalExpense, icon: TrendingDown, color: 'destructive' },
    { label: 'Net Balance', value: netBalance, icon: Wallet, color: 'primary' },
    { label: 'Budget Remaining', value: budgetRemaining, icon: AlertCircle, color: 'accent' },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Your financial overview at a glance</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 glass-card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className={`text-2xl font-bold text-${color}`}>
                      {formatCurrency(value, data.settings.currency)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${color}/10`}>
                    <Icon className={`h-5 w-5 text-${color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="p-6 glass-card">
            <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value), data.settings.currency)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Upcoming Bills */}
          <Card className="p-6 glass-card">
            <h2 className="text-xl font-semibold mb-4">Upcoming Bills</h2>
            <div className="space-y-3">
              {upcomingBills.map((bill) => {
                const daysLeft = getDaysUntil(bill.date);
                return (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(bill.amount, data.settings.currency)}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent: {formatCurrency(totalExpense, data.settings.currency)}</span>
              <span>Budget: {formatCurrency(data.settings.monthlyBudget, data.settings.currency)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${Math.min((totalExpense / data.settings.monthlyBudget) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {budgetRemaining > 0
                ? `${formatCurrency(budgetRemaining, data.settings.currency)} remaining`
                : 'Budget exceeded!'}
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
