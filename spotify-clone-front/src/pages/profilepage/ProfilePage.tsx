import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/Api/authSlice';
import { LogOut, User as UserIcon, Mail, ShieldCheck, KeyRound, Trash2, AlertTriangle, X } from 'lucide-react';
import { useGetMeQuery, api, useDisableUserMutation, useForgotPasswordMutation } from "../../services/Api/api.tsx";

const DeleteModal = ({ onConfirm, onCancel, isDeleting }: { onConfirm: () => void; onCancel: () => void; isDeleting: boolean }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

    <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <button onClick={onCancel} className="absolute top-4 right-4 text-text-muted hover:text-white transition">
        <X size={20} />
      </button>

      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-400" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-white mb-1">Видалити акаунт?</h2>
          <p className="text-sm text-text-muted">
            Цю дію неможливо скасувати. Всі твої дані будуть видалені назавжди.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Видалення...' : 'Так, видалити'}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition active:scale-95"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: userData, isLoading } = useGetMeQuery();
  const [forgotPassword, { isLoading: isSendingReset, isSuccess: isResetSent }] = useForgotPasswordMutation();
  const [disableUser, { isLoading: isDeleting }] = useDisableUserMutation();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate('/');
  };

  const handleChangePassword = async () => {
    if (!userData?.email) return;
    await forgotPassword({ email: userData.email });
  };

  const handleDeleteAccount = async () => {
    await disableUser();
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate('/login');
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}

      <div className="max-w-4xl mx-auto mt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-primary-soft/10 p-8 border border-white/5 mb-8">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-bg-main shadow-2xl ring-4 ring-white/10">
              <UserIcon size={64} />
            </div>

            {isLoading ? (
              <div className="text-text-muted text-sm animate-pulse">Завантаження профілю...</div>
            ) : (
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                  {userData?.username}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-text-muted">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-primary" />
                    <span className="text-sm">{userData?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    <span className="text-sm">Статус: Слухач</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-bg-elevated-soft/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h2 className="text-lg font-bold mb-4">Налаштування акаунта</h2>
            <div className="space-y-3">
              <button
                onClick={handleChangePassword}
                disabled={isSendingReset || isResetSent}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm flex items-center gap-3 disabled:opacity-50"
              >
                <KeyRound size={16} className="text-primary" />
                {isSendingReset ? 'Надсилаємо лист...' : isResetSent ? '✓ Лист надіслано на пошту' : 'Змінити пароль'}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 transition text-sm flex items-center gap-3 text-red-400"
              >
                <Trash2 size={16} />
                Видалити акаунт
              </button>
            </div>
          </div>

          <div className="bg-bg-elevated-soft/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-2">Сесія</h2>
              <p className="text-sm text-text-muted mb-6">
                Керуйте своїм доступом до AudioLab на цьому пристрої.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] transition active:scale-95 shadow-lg"
            >
              <LogOut size={20} />
              Вийти з профілю
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;