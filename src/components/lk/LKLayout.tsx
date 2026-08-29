import { ReactNode, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  MessageSquare,
  Award,
  ClipboardList,
  LogOut,
  Menu,
  Bell,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT } from '@/lib/lkTranslations';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LKLanguageSwitcher } from '@/components/lk/LKLanguageSwitcher';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export function LKLayout({ children }: { children: ReactNode }) {
  const { token, user, logout } = useAuth();
  const { language } = useLKLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!token) {
    return <Navigate to="/lk/login" replace />;
  }

  const navItems: NavItem[] = user.role === 'manager'
    ? [
        { to: '/lk/dashboard', label: lkT('nav_dashboard', language), icon: LayoutDashboard },
        { to: '/lk/clients', label: lkT('nav_clients', language), icon: Users },
        { to: '/lk/shipments', label: lkT('nav_shipments', language), icon: Package },
        { to: '/lk/messages', label: lkT('nav_messages', language), icon: MessageSquare },
        { to: '/lk/cert-centers', label: lkT('nav_cert_centers', language), icon: Award },
        { to: '/lk/cert-requests', label: lkT('nav_cert_requests', language), icon: ClipboardList },
        { to: '/lk/notifications', label: lkT('nav_notifications', language), icon: Bell },
      ]
    : user.role === 'cert_center'
    ? [
        { to: '/lk/cert-requests', label: lkT('nav_cert_requests', language), icon: ClipboardList },
        { to: '/lk/notifications', label: lkT('nav_notifications', language), icon: Bell },
      ]
    : [
        { to: '/lk/shipments', label: lkT('nav_shipments', language), icon: Package },
      ];

  const handleLogout = () => {
    logout();
    navigate('/lk/login');
  };

  const SidebarContent = (
    <div className="flex h-full w-full flex-col text-white" style={{ backgroundColor: 'hsl(214, 84%, 20%)' }}>
      <div className="flex items-center px-5 py-5 border-b border-white/10">
        <div className="font-bold text-lg tracking-wide">INNOVED LK</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to || (item.to !== '/lk/dashboard' && location.pathname.startsWith(item.to));
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
          <LKLanguageSwitcher />
        </div>
        <div className="mb-3">
          <div className="text-sm font-medium truncate">{user.name}</div>
          <div className="text-xs text-white/60">
            {user.role === 'manager'
              ? lkT('role_manager', language)
              : user.role === 'cert_center'
              ? lkT('role_cert_center', language)
              : lkT('role_client', language)}
          </div>
        </div>
        <Button variant="secondary" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1.5" />
          {lkT('nav_logout', language)}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:block w-[240px] shrink-0">
        <div className="fixed top-0 left-0 h-screen w-[240px]">
          {SidebarContent}
        </div>
      </aside>
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="font-semibold">INNOVED LK</div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px]">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="p-4 md:p-6 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}