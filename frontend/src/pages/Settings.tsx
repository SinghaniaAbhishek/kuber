import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { exportToCSV } from '@/lib/utils/export';
import { toast } from 'sonner';
import { Download, RefreshCw, Moon, Sun, Palette } from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '@/lib/api';
import api from '@/lib/api';

const Settings = () => {
  const { data, updateData, resetData } = useData();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(data.settings.theme);
  const [monthlyBudget, setMonthlyBudget] = useState(data.settings.monthlyBudget.toString());

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

  const handleExportExpenses = () => {
    const exportData = data.expenses.map(e => ({
      Date: e.date,
      Amount: e.amount,
      Category: e.category,
      Mode: e.mode,
      Note: e.note
    }));
    exportToCSV(exportData, 'expenses');
    toast.success('Expenses exported to CSV!');
  };

  const handleExportGoals = () => {
    const exportData = data.goals.map(g => ({
      Name: g.name,
      Target: g.target,
      Saved: g.saved,
      Progress: `${((g.saved / g.target) * 100).toFixed(1)}%`
    }));
    exportToCSV(exportData, 'savings-goals');
    toast.success('Goals exported to CSV!');
  };

  const handleExportBills = () => {
    const billsData = data.bills.map(b => ({
      Name: b.name,
      Amount: b.amount,
      DueDate: b.dueDate,
      Recurring: b.recurring
    }));
    const subsData = data.subscriptions.map(s => ({
      Name: s.name,
      Amount: s.amount,
      NextDue: s.nextDue,
      Cycle: s.cycle
    }));
    exportToCSV([...billsData, ...subsData], 'bills-subscriptions');
    toast.success('Bills exported to CSV!');
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
