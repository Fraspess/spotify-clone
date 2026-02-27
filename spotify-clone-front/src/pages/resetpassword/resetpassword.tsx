import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../services/Api/api';
import { Lock, LoaderCircle, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (!token) navigate('/forgot-password');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Паролі не збігаються');
      return;
    }
    if (newPassword.length < 8) {
      setError('Пароль має бути не менше 8 символів');
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.data?.message || 'Щось пішло не так. Спробуйте пізніше.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-bg-elevated-soft/30 backdrop-blur-xl p-8 rounded-3xl border border-white/5 text-center space-y-4">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Пароль змінено!</h2>
          <p className="text-sm text-text-muted">Перенаправляємо до входу...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-bg-elevated-soft/30 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">

        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
              Новий пароль
            </h1>
            <p className="text-sm text-text-muted">
              Введіть новий пароль для вашого акаунту.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-xs text-red-400 font-bold uppercase tracking-wide">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">
                Новий пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Мінімум 8 символів"
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-600 text-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">
                Підтвердіть пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторіть пароль"
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-600 text-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-bold py-4 rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {isLoading ? <LoaderCircle className="animate-spin" size={20} /> : 'Змінити пароль'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;