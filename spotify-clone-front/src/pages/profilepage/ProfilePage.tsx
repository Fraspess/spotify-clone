import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/Api/authSlice';
import { useGetUserByUsernameQuery } from '../../services/Api/api';
import type { RootState } from '../../services/Api/store';
import { LogOut, User as UserIcon, Mail, ShieldCheck } from 'lucide-react';
import {useGetMeQuery} from "../../services/Api/api.tsx";
import {useEffect, useState} from "react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: userData, isLoading } = useGetMeQuery();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-primary-soft/10 p-8 border border-white/5 mb-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-bg-main shadow-2xl ring-4 ring-white/10">
            <UserIcon size={64} />
          </div>

          {isLoading && <div> Загрузка профілю...</div>}
          
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-elevated-soft/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-4">Налаштування акаунта</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm">
              Змінити пароль
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm text-red-400">
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
  );
};

export default ProfilePage;