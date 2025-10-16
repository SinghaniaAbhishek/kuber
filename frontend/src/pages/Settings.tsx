import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
// export handled via backend CSV endpoint
import { toast } from 'sonner';
import { Download, RefreshCw, Moon, Sun, Palette } from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '@/lib/api';
import api from '@/lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Settings = () => {
  const { data, updateData, resetData } = useData();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(data.settings.theme);
  const [monthlyBudget, setMonthlyBudget] = useState(data.settings.monthlyBudget.toString());
  const [incOpen, setIncOpen] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);
  const [incomeForm, setIncomeForm] = useState({ source: '', amount: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    // Ensure latest user info is fetched from backend for About/Account section
    (async () => {
      try {
        const me = await api.me();
        if (me && (me.name !== data.user.name || me.email !== data.user.email)) {
          updateData({ user: me });
        }
      } catch {}
    })();
  }, []);

  const handleSaveSettings = async () => {
    try {
      await api.setTheme(theme);
      await api.setBudget(parseFloat(monthlyBudget), data.settings.currency);
      updateData({
        settings: {
          ...data.settings,
          theme,
          monthlyBudget: parseFloat(monthlyBudget)
        }
      });

      // Apply theme
      document.documentElement.classList.remove('dark', 'theme-light', 'theme-dreamy');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
      }

      toast.success('Settings saved! 💾');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save settings');
    }
  };

  const resetIncomeForm = () => {
    setEditingIncomeId(null);
    setIncomeForm({ source: '', amount: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { source: incomeForm.source, amount: parseFloat(incomeForm.amount), date: incomeForm.date };
    try {
      if (editingIncomeId) {
        const updated = await api.update('income', editingIncomeId, payload);
        updateData({ income: data.income.map(i => i.id === editingIncomeId ? updated as any : i) });
        toast.success('Income updated');
      } else {
        const created = await api.create('income', payload);
        updateData({ income: [...data.income, created as any] });
        toast.success('Income added');
      }
      setIncOpen(false);
      resetIncomeForm();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save income');
    }
  };

  const handleIncomeDelete = async (id: string) => {
    try {
      await api.remove('income', id);
      updateData({ income: data.income.filter(i => i.id !== id) });
      toast.success('Income deleted');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
    }
  };

  const downloadCsv = (filename: string, csv: string) => {
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: data URL
      const url = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportExpenses = async () => {
    try {
      const csv = await api.exportCsv();
      if (csv && typeof csv.expenses === 'string') downloadCsv('expenses', csv.expenses);
      toast.success('Expenses exported to CSV!');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to export');
    }
  };

  const handleExportGoals = async () => {
    try {
      const csv = await api.exportCsv();
      if (csv && typeof csv.goals === 'string') downloadCsv('savings-goals', csv.goals);
      toast.success('Goals exported to CSV!');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to export');
    }
  };

  const handleExportBills = async () => {
    try {
      const csv = await api.exportCsv();
      // Offer both bills and subscriptions separately
      if (csv && typeof csv.bills === 'string') downloadCsv('bills', csv.bills);
      if (csv && typeof csv.subscriptions === 'string') downloadCsv('subscriptions', csv.subscriptions);
      toast.success('Bills & Subscriptions exported to CSV!');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to export');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone!')) {
      resetData();
      toast.success('Data reset to initial state');
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        {/* Appearance */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dreamy">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Dreamy (Pastel)
                    </div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Budget Settings */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Budget Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Monthly Budget Limit</label>
              <Input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="25000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set your monthly spending limit for budget tracking
              </p>
            </div>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </Card>

        {/* Income Management */}
        <Card className="p-6 glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Income</h2>
            <Dialog open={incOpen} onOpenChange={(o) => { setIncOpen(o); if (!o) resetIncomeForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Income
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingIncomeId ? 'Edit Income' : 'Add Income'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleIncomeSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Source</label>
                    <Input
                      placeholder="e.g., Salary, Freelance"
                      value={incomeForm.source}
                      onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={incomeForm.amount}
                      onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={incomeForm.date}
                      onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">{editingIncomeId ? 'Update' : 'Add'} Income</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {data.income.length === 0 && (
              <p className="text-sm text-muted-foreground">No income added yet.</p>
            )}
            {data.income
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((inc) => (
                <div key={inc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{inc.source}</p>
                    <p className="text-xs text-muted-foreground">{inc.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{inc.amount}</p>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingIncomeId(inc.id); setIncomeForm({ source: inc.source, amount: String(inc.amount), date: inc.date }); setIncOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleIncomeDelete(inc.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Export Data */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Download your financial data as CSV files for backup or analysis
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button variant="outline" onClick={handleExportExpenses}>
                <Download className="h-4 w-4 mr-2" />
                Export Expenses
              </Button>
              <Button variant="outline" onClick={handleExportGoals}>
                <Download className="h-4 w-4 mr-2" />
                Export Goals
              </Button>
              <Button variant="outline" onClick={handleExportBills}>
                <Download className="h-4 w-4 mr-2" />
                Export Bills
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 glass-card border-destructive/50">
          <h2 className="text-xl font-semibold mb-4 text-destructive flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Danger Zone
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Reset all data back to the initial demo state. This action cannot be undone!
            </p>
            <Button variant="destructive" onClick={handleReset}>
              Reset All Data
            </Button>
            <div className="pt-2 border-t">
              <Button variant="outline" onClick={() => { setAuthToken(null); navigate('/'); }}>
                Logout
              </Button>
            </div>
          </div>
        </Card>

        {/* User Info */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{data.user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{data.user.email}</span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
