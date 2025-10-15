import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoSteps = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: 'View Dashboard',
      description: 'See your financial overview with charts and stats',
      action: () => navigate('/dashboard')
    },
    {
      id: 2,
      title: 'Mark Netflix Paid',
      description: 'Go to Bills > Subscriptions and mark Netflix as paid',
      action: () => navigate('/bills')
    },
    {
      id: 3,
      title: 'Add ₹100 to Trip Goal',
      description: 'Go to Goals and add funds to "Trip to Goa"',
      action: () => navigate('/goals')
    },
    {
      id: 4,
      title: 'Export Expenses CSV',
      description: 'Go to Settings and export your expenses',
      action: () => navigate('/settings')
    },
    {
      id: 5,
      title: 'View Your Badges',
      description: 'Check the Challenge page to see earned badges',
      action: () => navigate('/challenge')
    }
  ];

  const handleStepClick = (stepId: number, action: () => void) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    action();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        size="sm"
      >
        📋 Demo Steps
      </Button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
      >
        <Card className="glass-card p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              📋 Demo Steps for Judges
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id, step.action)}
                  className={`w-full text-left p-3 rounded-lg transition-all hover:bg-primary/10 ${
                    isCompleted ? 'bg-success/10' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs">
                          {step.id}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t text-xs text-center text-muted-foreground">
            Click any step to navigate • All features work with seeded mock data
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoSteps;
