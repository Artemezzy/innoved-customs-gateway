import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import logoImg from '@/assets/logo.png';

export default function LKLoginPage() {
  const { token, user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (token && user) {
    return <Navigate to={user.role === 'manager' ? '/lk/dashboard' : '/lk/shipments'} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success('Вход выполнен');
      navigate(u.role === 'manager' ? '/lk/dashboard' : '/lk/shipments');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(135deg, hsl(214 84% 20%) 0%, hsl(214 84% 28%) 50%, hsl(214 70% 35%) 100%)',
      }}
    >
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="ИННОВЭД" className="h-14 w-auto mb-3" />
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <p className="text-sm text-muted-foreground mt-1">Войдите в свой аккаунт</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Вход…' : 'Войти'}
          </Button>
        </form>
        <div className="mt-6 text-xs text-muted-foreground border-t pt-4">
          <div className="font-medium mb-1">Тестовые учётные записи:</div>
          <div>Менеджер: manager@innoved.ru / manager</div>
          <div>Клиент: client@technoimport.ru / client</div>
        </div>
      </Card>
    </div>
  );
}
