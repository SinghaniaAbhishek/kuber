import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useData, Challenge } from '@/contexts/DataContext';
import { formatCurrency, getProgressPercentage } from '@/lib/utils/format';
import { Plus, Trophy, Target } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const ChallengePage = () => {
  const { data, updateData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    month: new Date().toISOString().slice(0, 7)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newChallenge: Challenge = {
      id: `c${Date.now()}`,
      name: formData.name,
      limit: parseFloat(formData.limit),
      month: formData.month,
      progress: 0
    };

    updateData({
      challenges: [...data.challenges, newChallenge]
    });

    toast.success('Challenge created! 🎯');
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      limit: '',
      month: new Date().toISOString().slice(0, 7)
    });
  };

  // Calculate progress for each challenge based on expenses in that month
  const challengesWithProgress = data.challenges.map(challenge => {
    const monthExpenses = data.expenses
      .filter(e => e.date.startsWith(challenge.month))
      .reduce((sum, e) => sum + e.amount, 0);
    
    const progress = getProgressPercentage(monthExpenses, challenge.limit);
    const isSuccess = monthExpenses <= challenge.limit;
    
    return { ...challenge, actualProgress: monthExpenses, progress, isSuccess };
  });

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Budget Challenge</h1>
            <p className="text-muted-foreground">Set monthly limits and track your progress 🎯</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Challenge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Budget Challenge</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Challenge Name</label>
                  <Input
                    placeholder="e.g., Under ₹5000 this month"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Spending Limit</label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Month</label>
                  <Input
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Challenge
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Badges Section */}
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Your Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            {data.badges.map((badge, idx) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-medium capitalize">{badge.replace('-', ' ')}</span>
              </motion.div>
            ))}
            {data.badges.length === 0 && (
              <p className="text-muted-foreground">Complete challenges to earn badges!</p>
            )}
          </div>
        </Card>

        {/* Active Challenges */}
        <div className="grid md:grid-cols-2 gap-6">
          {challengesWithProgress.map((challenge, idx) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`p-6 glass-card ${challenge.isSuccess ? 'ring-2 ring-success' : challenge.progress > 100 ? 'ring-2 ring-destructive' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{challenge.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(challenge.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  {challenge.isSuccess && (
                    <div className="flex items-center gap-1 text-success">
                      <Trophy className="h-5 w-5" />
                      <span className="text-sm font-medium">Success!</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Progress Ring */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(challenge.progress / 100, 1))}`}
                          className={challenge.progress > 100 ? 'text-destructive' : 'text-primary'}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-2xl font-bold">{challenge.progress}%</span>
                        <span className="text-xs text-muted-foreground">spent</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent</span>
                      <span className="font-semibold">
                        {formatCurrency(challenge.actualProgress, data.settings.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Limit</span>
                      <span className="font-semibold">
                        {formatCurrency(challenge.limit, data.settings.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining</span>
                      <span className={`font-semibold ${challenge.limit - challenge.actualProgress < 0 ? 'text-destructive' : 'text-success'}`}>
                        {formatCurrency(Math.max(0, challenge.limit - challenge.actualProgress), data.settings.currency)}
                      </span>
                    </div>
                  </div>

                  {challenge.isSuccess && (
                    <div className="text-center p-3 bg-success/10 text-success rounded-lg text-sm font-medium">
                      🎉 Challenge completed successfully!
                    </div>
                  )}
                  {challenge.progress > 100 && (
                    <div className="text-center p-3 bg-destructive/10 text-destructive rounded-lg text-sm font-medium">
                      Budget exceeded. Better luck next time!
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}

          {challengesWithProgress.length === 0 && (
            <Card className="p-12 glass-card col-span-2">
              <div className="text-center space-y-4">
                <Target className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Active Challenges</h3>
                  <p className="text-muted-foreground">
                    Create a budget challenge to push yourself to save more!
                  </p>
                </div>
                <Button onClick={() => setIsOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Challenge
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChallengePage;
