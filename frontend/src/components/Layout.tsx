import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, Target, CreditCard, FileText, TrendingUp, Trophy, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useData } from '@/contexts/DataContext';

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
    <nav className="flex flex-col gap-2 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Finance Simplifier
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Hey, <span className="font-semibold">{data.user.name || 'there'}</span>! 👋</p>
      </div>
      {navItems.map(({ path, icon: Icon, label }) => (
        <Link key={path} to={path}>
          <Button
            variant={location.pathname === path ? 'default' : 'ghost'}
            className="w-full justify-start gap-3"
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
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Finance Simplifier
        </h1>
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

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-card/50 backdrop-blur-sm">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
