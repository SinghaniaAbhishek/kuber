import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useData, Goal } from '@/contexts/DataContext';
import { formatCurrency, getProgressPercentage } from '@/lib/utils/format';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Layout from '@/components/Layout';
import api from '@/lib/api';

const Goals = () => {
  const { data, updateData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    saved: '0'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      target: parseFloat(formData.target),
      saved: parseFloat(formData.saved)
    };
    try {
      if (editingId) {
        const updated = await api.update('goals', editingId, payload);
        if (updated) {
          updateData({ goals: data.goals.map(g => g.id === editingId ? updated as Goal : g) });
          toast.success('Goal updated!');
        }
      } else {
        const created = await api.create('goals', payload);
        if (created) {
          updateData({ goals: [...data.goals, created as Goal] });
          toast.success('Goal created! 🎯');
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save goal');
    }

    setIsOpen(false);
    resetForm();
  };

  const handleAddToGoal = async () => {
    if (!selectedGoalId || !addAmount) return;
    
    const goal = data.goals.find(g => g.id === selectedGoalId);
    if (!goal) return;

    const amount = parseFloat(addAmount);
    const newSaved = goal.saved + amount;

    if (newSaved >= goal.target && goal.saved < goal.target) {
      // Goal completed!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('🎉 Goal achieved! You\'re amazing!');
      
      // Award badge
      if (!data.badges.includes('goal-achiever')) {
        updateData({
          badges: [...data.badges, 'goal-achiever']
        });
      }
    }

    try {
      const updated = await api.update('goals', goal.id, { saved: Math.min(newSaved, goal.target) });
      if (updated) {
        updateData({ goals: data.goals.map(g => g.id === goal.id ? updated as Goal : g) });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update goal');
    }

    setIsAddOpen(false);
    setAddAmount('');
    setSelectedGoalId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.remove('goals', id);
      updateData({ goals: data.goals.filter(g => g.id !== id) });
      toast.success('Goal deleted');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete goal');
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setFormData({
      name: goal.name,
      target: goal.target.toString(),
      saved: goal.saved.toString()
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', target: '', saved: '0' });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Savings Goals</h1>
            <p className="text-muted-foreground">Track your dreams and achieve them 🎯</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Goal Name</label>
                  <Input
                    placeholder="e.g., Trip to Goa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Amount</label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Already Saved</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.saved}
                    onChange={(e) => setFormData({ ...formData, saved: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? 'Update' : 'Create'} Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {data.goals.map((goal, idx) => {
            const progress = getProgressPercentage(goal.saved, goal.target);
            const isComplete = progress >= 100;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-6 glass-card ${isComplete ? 'ring-2 ring-success' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{goal.name}</h3>
                      {isComplete && <span className="text-sm text-success">✨ Completed!</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    
                    <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={isComplete ? 'bg-success' : 'gradient-primary'}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        style={{ height: '100%' }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">{formatCurrency(goal.saved, data.settings.currency)}</p>
                        <p className="text-sm text-muted-foreground">of {formatCurrency(goal.target, data.settings.currency)}</p>
                      </div>
                      <Button
                        onClick={() => { setSelectedGoalId(goal.id); setIsAddOpen(true); }}
                        disabled={isComplete}
                        size="sm"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Add Funds
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Add Funds Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount to Add</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleAddToGoal} className="w-full">
                Add Funds
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Goals;
