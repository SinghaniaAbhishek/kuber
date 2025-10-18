import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData, Expense } from '@/contexts/DataContext';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface AddExpenseDialogProps {
  trigger?: React.ReactNode;
  onExpenseAdded?: () => void;
}

const AddExpenseDialog = ({ trigger, onExpenseAdded }: AddExpenseDialogProps) => {
  const { data, updateData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food',
    mode: 'UPI',
    note: ''
  });

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Subscriptions', 'Other'];
  const modes = ['Cash', 'UPI', 'Card', 'Net Banking'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      mode: formData.mode,
      note: formData.note
    };

    try {
      const created = await api.create('expenses', payload);
      if (created) {
        updateData({ expenses: [...data.expenses, created as Expense] });
        toast.success('Expense added successfully!');
        setIsOpen(false);
        resetForm();
        onExpenseAdded?.();
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save expense');
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: 'Food',
      mode: 'UPI',
      note: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gradient-primary hover:shadow-lg transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="surface">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Add New Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="surface"
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
              className="surface"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
              <SelectTrigger className="surface">
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
              <SelectTrigger className="surface">
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
              className="surface"
            />
          </div>
          <Button type="submit" className="w-full gradient-primary hover:shadow-lg transition-all duration-300">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
