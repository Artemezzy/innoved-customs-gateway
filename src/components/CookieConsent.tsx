import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-4 md:max-w-sm z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-3 animate-fade-in">
      <p className="text-sm text-foreground leading-snug">
        Мы используем{' '}
        <Link to="/cookies" className="text-accent hover:underline">cookie</Link>
        {' '}и рекомендательные технологии, чтобы улучшать работу сайта.
      </p>
      <Button size="sm" onClick={accept} className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground">
        OK
      </Button>
    </div>
  );
}
