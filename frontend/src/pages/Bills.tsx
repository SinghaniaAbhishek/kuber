import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData, Bill, Subscription, Expense } from '@/contexts/DataContext';
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils/format';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addMonths, addYears, format as formatDateFns } from 'date-fns';
import Layout from '@/components/Layout';
import api from '@/lib/api';

const Bills = () => {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState('bills');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    recurring: 'monthly',
    cycle: 'monthly'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'bills') {
        const payload = { name: formData.name, amount: parseFloat(formData.amount), dueDate: formData.date, recurring: formData.recurring };
        if (editingId) {
          const updated = await api.update('bills', editingId, payload);
          updateData({ bills: data.bills.map(b => b.id === editingId ? updated as Bill : b) });
          toast.success('Bill updated!');
        } else {
          const created = await api.create('bills', payload);
          updateData({ bills: [...data.bills, created as Bill] });
          toast.success('Bill added!');
        }
      } else {
        const payload = { name: formData.name, amount: parseFloat(formData.amount), nextDue: formData.date, cycle: formData.cycle };
        if (editingId) {
          const updated = await api.update('subscriptions', editingId, payload);
          updateData({ subscriptions: data.subscriptions.map(s => s.id === editingId ? updated as Subscription : s) });
          toast.success('Subscription updated!');
        } else {
          const created = await api.create('subscriptions', payload);
          updateData({ subscriptions: [...data.subscriptions, created as Subscription] });
          toast.success('Subscription added!');
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save');
    }

    setIsOpen(false);
    resetForm();
  };

  const handleMarkPaid = async (id: string, type: 'bill' | 'subscription') => {
    try {
      if (type === 'bill') {
        const updated = await api.patch('bills', `/mark-paid/${id}`, { autoExpense: true });
        updateData({ bills: data.bills.map(b => b.id === id ? updated as Bill : b) });
        toast.success('Bill marked as paid! 💚');
      } else {
        const updated = await api.patch('subscriptions', `/mark-paid/${id}`, { autoExpense: true });
        updateData({ subscriptions: data.subscriptions.map(s => s.id === id ? updated as Subscription : s) });
        toast.success('Subscription payment recorded! 💚');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark paid');
    }
  };

  const handleDelete = async (id: string, type: 'bill' | 'subscription') => {
    try {
      if (type === 'bill') {
        await api.remove('bills', id);
        updateData({ bills: data.bills.filter(b => b.id !== id) });
      } else {
        await api.remove('subscriptions', id);
        updateData({ subscriptions: data.subscriptions.filter(s => s.id !== id) });
      }
      toast.success('Deleted successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      recurring: 'monthly',
      cycle: 'monthly'
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bills & Subscriptions</h1>
            <p className="text-muted-foreground">Never miss a payment</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab === 'bills' ? 'Bill' : 'Subscription'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {activeTab === 'bills' ? 'Bill' : 'Subscription'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    placeholder="e.g., Electricity, Netflix"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <label className="text-sm font-medium mb-2 block">
                    {activeTab === 'bills' ? 'Due Date' : 'Next Due Date'}
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                {activeTab === 'bills' ? (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recurring</label>
                    <Select value={formData.recurring} onValueChange={(val) => setFormData({ ...formData, recurring: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Billing Cycle</label>
                    <Select value={formData.cycle} onValueChange={(val) => setFormData({ ...formData, cycle: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Add {activeTab === 'bills' ? 'Bill' : 'Subscription'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="bills" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {data.bills
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((bill) => {
                  const daysLeft = getDaysUntil(bill.dueDate);
                  return (
                    <Card key={bill.id} className="p-6 glass-card">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{bill.name}</h3>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              daysLeft < 0 ? 'bg-destructive/10 text-destructive' :
                              daysLeft === 0 ? 'bg-warning/10 text-warning' :
                              daysLeft <= 3 ? 'bg-warning/10 text-warning' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                            </span>
                          </div>
                          <p className="text-muted-foreground">Due: {formatDate(bill.dueDate)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-2xl font-bold">{formatCurrency(bill.amount, data.settings.currency)}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="icon"
                              onClick={() => handleMarkPaid(bill.id, 'bill')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(bill.id, 'bill')}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {data.subscriptions
                .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
                .map((sub) => {
                  const daysLeft = getDaysUntil(sub.nextDue);
                  return (
                    <Card key={sub.id} className="p-6 glass-card">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{sub.name}</h3>
                            <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {sub.cycle}
                            </span>
                          </div>
                          <p className="text-muted-foreground">Next payment: {formatDate(sub.nextDue)} ({daysLeft} days)</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-2xl font-bold">{formatCurrency(sub.amount, data.settings.currency)}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="icon"
                              onClick={() => handleMarkPaid(sub.id, 'subscription')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id, 'subscription')}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Bills;
