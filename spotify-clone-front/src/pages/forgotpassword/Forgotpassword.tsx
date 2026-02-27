import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useForgotPasswordMutation } from '../../services/Api/api';
import { Mail, ArrowLeft, LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      forgotPassword({email});
      setTimeout(() => {
        setIsSent(true);
        setIsLoading(false);
      }, 1500);
    } catch (err: any) {
      setError(err.data?.message || 'Щось пішло не так. Спробуйте пізніше.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-bg-elevated-soft/30 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">

        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-widest mb-8 border-b border-transparent hover:border-text-muted"
        >
          <ArrowLeft size={14} />
          Назад до входу
        </button>

        {!isSent ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
                Забули пароль?
              </h1>
              <p className="text-sm text-text-muted">
                Введіть свою електронну адресу для відновлення доступу.
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
                  Email адреса
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-600 text-white font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-bold py-4 rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  'Надіслати код'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                Лист надіслано!
              </h2>
              <p className="text-sm text-text-muted">
                Інструкції надіслано на <span className="text-white font-bold">{email}</span>.
              </p>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;