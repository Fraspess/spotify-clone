import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LogoutButtonProps {
  variant?: 'default' | 'minimal';
  className?: string;
  onLogout?: () => void;
}

const clearAuthCookies = () => {
  if (typeof document === 'undefined') return;

  const names = ['authToken', 'refreshToken', 'JSESSIONID'];
  names.forEach((name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};

const LogoutButton = ({ variant = 'default', className = '', onLogout }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthCookies();
    onLogout?.();
    navigate('/login?mode=login', { replace: true });
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleLogout}
        className={`group flex items-center gap-2.5 text-text-muted hover:text-primary transition-all duration-200 hover:bg-bg-elevated-soft px-3 py-2 rounded-lg ${className}`}
        title="Вийти"
      >
        <LogOut 
          size={20} 
          className="transition-transform group-hover:rotate-12" 
        />
        <span className="text-sm font-medium">Вийти</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`group flex items-center gap-2 bg-bg-elevated hover:bg-primary/10 border border-border-subtle hover:border-primary/50 text-text-main px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${className}`}
    >
      <LogOut 
        size={18} 
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
      />
      <span className="transition-colors group-hover:text-primary">Вийти</span>
    </button>
  );
};

export default LogoutButton;

