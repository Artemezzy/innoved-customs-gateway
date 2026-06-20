import { ReactNode, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.png';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export function LKLayout({ children }: { children: ReactNode }) {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!token) {
    return <Navigate to="/lk/login" replace />;
  }

  const navItems: NavItem[] =
    user.role === 'manager'
      ? [
          { to: '/lk/dashboard', label: 'Дашборд', icon: LayoutDashboard },
          { to: '/lk/clients', label: 'Клиенты', icon: Users },
          { to: '/lk/shipments', label: 'Поставки', icon: Package },
          { to: '/lk/messages', label: 'Сообщения', icon: MessageSquare },
        ]
      : [{ to: '/lk/shipments', label: 'Мои поставки', icon: Package }];

  const handleLogout = () => {
    logout();
    navigate('/lk/login');
  };

  const SidebarContent = () => (
    <div
      className="flex h-full w-full flex-col text-white"
      style={{ backgroundColor: 'hsl(214 84% 20%)' }}
    >
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <img src={logoImg} alt="ИННОВЭД" className="h-8 w-auto brightness-0 invert" />
        <div className="font-bold text-lg tracking-wide">ИННОВЭД</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            location.pathname === item.to ||
            (item.to !== '/lk/dashboard' && location.pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3">
          <div className="text-sm font-medium truncate">{user.name}</div>
          <div className="text-xs text-white/60">
            {user.role === 'manager' ? 'Менеджер' : 'Клиент'}
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Выйти
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[240px] shrink-0">
        <div className="fixed top-0 left-0 h-screen w-[240px]">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="" className="h-6 w-auto" />
          <span className="font-semibold">ИННОВЭД ЛК</span>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="p-4 md:p-6 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
