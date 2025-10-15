import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData, Expense } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const Expenses = () => {
  const { data, updateData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food',
    mode: 'UPI',
    note: ''
  });

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Subscriptions', 'Other'];
  const modes = ['Cash', 'UPI', 'Card', 'Net Banking'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: editingId || `e${Date.now()}`,
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      mode: formData.mode,
      note: formData.note
    };

    if (editingId) {
      updateData({
        expenses: data.expenses.map(exp => exp.id === editingId ? newExpense : exp)
      });
      toast.success('Expense updated successfully!');
    } else {
      updateData({
        expenses: [...data.expenses, newExpense]
      });
      toast.success('Expense added successfully!');
    }

    setIsOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    updateData({
      expenses: data.expenses.filter(exp => exp.id !== id)
    });
    toast.success('Expense deleted');
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setFormData({
      date: expense.date,
      amount: expense.amount.toString(),
      category: expense.category,
      mode: expense.mode,
      note: expense.note
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: 'Food',
      mode: 'UPI',
      note: ''
    });
  };

  const totalExpense = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetProgress = (totalExpense / data.settings.monthlyBudget) * 100;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Expense Tracker</h1>
            <p className="text-muted-foreground">Manage all your expenses</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Mode</label>
                  <Select value={formData.mode} onValueChange={(val) => setFormData({ ...formData, mode: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modes.map(mode => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Note</label>
                  <Input
                    placeholder="Add a note..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? 'Update' : 'Add'} Expense
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Budget Progress */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Monthly Budget Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent: {formatCurrency(totalExpense, data.settings.currency)}</span>
              <span>Budget: {formatCurrency(data.settings.monthlyBudget, data.settings.currency)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-full rounded-full transition-all ${budgetProgress > 100 ? 'bg-destructive' : 'gradient-primary'}`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Expenses List */}
        <Card className="glass-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Note</th>
                  <th className="text-left p-4">Mode</th>
                  <th className="text-right p-4">Amount</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">{formatDate(expense.date)}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{expense.note}</td>
                    <td className="p-4 text-sm">{expense.mode}</td>
                    <td className="p-4 text-right font-semibold">{formatCurrency(expense.amount, data.settings.currency)}</td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Expenses;
