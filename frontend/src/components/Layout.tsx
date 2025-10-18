import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, Target, CreditCard, FileText, TrendingUp, Trophy, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useData } from '@/contexts/DataContext';
import ThemeToggle from '@/components/ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { data } = useData();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/expenses', icon: Receipt, label: 'Expenses' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/bills', icon: CreditCard, label: 'Bills' },
    { path: '/debts', icon: FileText, label: 'Debts' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/challenge', icon: Trophy, label: 'Challenge' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const NavContent = () => (
    <nav className="relative flex flex-col gap-2 p-4">
      <div className="absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full blur-3xl" style={{ background: 'hsl(var(--primary) / 0.25)' }} />
        <div className="absolute -bottom-6 -right-10 h-36 w-36 rounded-full blur-3xl" style={{ background: 'hsl(var(--accent) / 0.25)' }} />
      </div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Hey, <span className="font-semibold">{data.user.name || 'there'}</span>! 👋</p>
      </div>
      {navItems.map(({ path, icon: Icon, label }) => (
        <Link key={path} to={path}>
          <Button
            variant={location.pathname === path ? 'default' : 'ghost'}
            className={`w-full justify-start gap-3 ${location.pathname === path ? 'shadow-[var(--shadow-sm)]' : ''}`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Button>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 backdrop-blur-xl">
        <h1 className="text-2xl font-bold dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text dark:text-transparent text-primary">
          Kuber
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-card/60 backdrop-blur-xl flex-col fixed left-0 top-0 h-screen z-50">
        {/* Header Section */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text dark:text-transparent text-primary">
              Kuber
            </h1>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavContent />
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 p-4 pt-20 md:pt-8 md:p-8 overflow-auto md:ml-64">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-10 top-10 h-64 w-64 rounded-full blur-3xl opacity-40" style={{ background: 'hsl(var(--secondary) / 0.25)' }} />
          <div className="absolute right-24 -top-6 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: 'hsl(var(--primary) / 0.2)' }} />
          <div className="absolute right-10 bottom-10 h-56 w-56 rounded-full blur-3xl opacity-40" style={{ background: 'hsl(var(--accent) / 0.2)' }} />
        </div>
        <div className="mx-auto max-w-7xl space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
