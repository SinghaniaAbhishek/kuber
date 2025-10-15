import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, Target, Shield } from 'lucide-react';
import { toast } from 'sonner';
import api, { setAuthToken } from '@/lib/api';
import { useData } from '@/contexts/DataContext';

const Welcome = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { refreshData } = useData();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { token } = await api.login(email, password);
        if (token) {
          setAuthToken(token);
          toast.success('Welcome back! 🎉');
        }
      } else {
        const { token } = await api.signup(name, email, password);
        if (token) {
          setAuthToken(token);
          toast.success('Account created successfully! 🎊');
        }
      }
      // ensure data is loaded before navigating
      await refreshData();
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Authentication failed');
    }
  };

  const features = [
    { icon: Wallet, title: 'Track Expenses', desc: 'Monitor every rupee' },
    { icon: Target, title: 'Savings Goals', desc: 'Achieve your dreams' },
    { icon: TrendingUp, title: 'Smart Insights', desc: 'Data-driven decisions' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data, your control' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Personal Finance
              </span>
              <br />
              Kuber
            </h1>
            <p className="text-xl text-muted-foreground">
              Take control of your money with clarity and confidence 💚
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-4 glass-card hover:shadow-lg transition-shadow">
                  <Icon className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-8 glass-card">
            <h2 className="text-2xl font-bold mb-6">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
