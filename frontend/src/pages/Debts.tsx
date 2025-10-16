import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData, Debt } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Plus, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import api from '@/lib/api';

const Debts = () => {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState<'i_owe' | 'owed_to_me'>('i_owe');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    due: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.create('debts', {
        name: formData.name,
        amount: parseFloat(formData.amount),
        type: activeTab,
        due: formData.due,
        note: formData.note,
      });
      updateData({ debts: [...data.debts, created as Debt] });
      toast.success('Debt recorded!');
      setIsOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add');
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.patch('debts', `/mark-paid/${id}`);
      updateData({ debts: data.debts.filter(d => d.id !== id) });
      toast.success('Marked as paid! 💚');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark paid');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.remove('debts', id);
      updateData({ debts: data.debts.filter(d => d.id !== id) });
      toast.success('Deleted');
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      due: new Date().toISOString().split('T')[0],
      note: ''
    });
  };

  const iOweDebts = data.debts.filter(d => d.type === 'i_owe');
  const owedToMeDebts = data.debts.filter(d => d.type === 'owed_to_me');

  const totalIOwe = iOweDebts.reduce((sum, d) => sum + d.amount, 0);
  const totalOwedToMe = owedToMeDebts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Debt & Split Tracker</h1>
            <p className="text-muted-foreground">Keep track of money borrowed and lent</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Debt Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Person Name</label>
                  <Input
                    placeholder="e.g., Rohit"
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
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'i_owe' | 'owed_to_me')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="i_owe">I Owe</TabsTrigger>
                      <TabsTrigger value="owed_to_me">Owed to Me</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={formData.due}
                    onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Note</label>
                  <Textarea
                    placeholder="What was it for?"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Entry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 glass-card">
            <h3 className="text-sm text-muted-foreground mb-2">I Owe</h3>
            <p className="text-3xl font-bold text-destructive">
              {formatCurrency(totalIOwe, data.settings.currency)}
            </p>
          </Card>
          <Card className="p-6 glass-card">
            <h3 className="text-sm text-muted-foreground mb-2">Owed to Me</h3>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(totalOwedToMe, data.settings.currency)}
            </p>
          </Card>
        </div>

        {/* Debts List */}
        <Tabs defaultValue="i_owe" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="i_owe">I Owe ({iOweDebts.length})</TabsTrigger>
            <TabsTrigger value="owed_to_me">Owed to Me ({owedToMeDebts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="i_owe" className="space-y-4 mt-6">
            {iOweDebts.map((debt) => (
              <Card key={debt.id} className="p-6 glass-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{debt.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{debt.note}</p>
                    <p className="text-xs text-muted-foreground">Due: {formatDate(debt.due)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-destructive">
                      {formatCurrency(debt.amount, data.settings.currency)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => handleMarkPaid(debt.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(debt.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {iOweDebts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No pending debts to pay 🎉
              </div>
            )}
          </TabsContent>

          <TabsContent value="owed_to_me" className="space-y-4 mt-6">
            {owedToMeDebts.map((debt) => (
              <Card key={debt.id} className="p-6 glass-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{debt.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{debt.note}</p>
                    <p className="text-xs text-muted-foreground">Due: {formatDate(debt.due)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(debt.amount, data.settings.currency)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => handleMarkPaid(debt.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(debt.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {owedToMeDebts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Nobody owes you money 💚
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Debts;
