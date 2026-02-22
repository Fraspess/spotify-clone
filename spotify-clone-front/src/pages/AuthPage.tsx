import { useState, useEffect,  } from 'react'
import type { SyntheticEvent, ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../services/api';
import { setCredentials } from '../services/authSlice';
import { ArrowLeft } from "lucide-react";
import {APP_ENV} from "../env";

type Mode = 'login' | 'register'

function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation()
  const modeFromUrl = searchParams.get('mode') as Mode
  const [mode, setMode] = useState<Mode>(modeFromUrl || 'login')
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  
  
  useEffect(() => {
    if (modeFromUrl) {
      setMode(modeFromUrl)
      setErrors({})
      setServerError(null)
    }
  }, [modeFromUrl])

  const validateForm = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.email) {
        newErrors.email = 'Email обов’язковий'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Невірний формат email'
      }

      if (!formData.password) {
        newErrors.password = 'Пароль обов’язковий'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Мінімум 8 символів'
      }

      if (mode === 'register' && !formData.username) {
        newErrors.username = 'Ім’я обов’язкове'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validateForm()) return

    try {
      let result: any
      if (mode === 'login') {
        result = await login({ 
          login: formData.email, 
          password: formData.password 
        }).unwrap()
      } else {
        result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }).unwrap()
      }

      const token = result?.accessToken || result?.token;

      if (token) {
        dispatch(setCredentials({
          user: result.user || { 
            email: formData.email, 
            username: result.username || formData.username 
          },
          token: token
        }))
        navigate('/')
      }
    } catch (err: any) {
      setServerError(err.data?.message || 'Помилка доступу. Перевірте дані.')
    }
  }
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }


  const handleLoginGoogle = () => {
      window.location.href = APP_ENV.BACKEND_URL + "/oauth2/authorization/google"
  }

 return (
    <div className="relative min-h-screen bg-bg-main text-text-main flex items-center justify-center px-4 overflow-hidden">
      {/* Декоративні елементи фонa */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-72 w-72 rounded-full bg-primary-soft/20 blur-3xl" />

    <button
      onClick={() => navigate('/')}
      className="absolute top-8 left-8 flex items-center gap-2 text-text-muted hover:text-white transition-colors group z-50"
    >
      <div className="p-2 rounded-full bg-bg-elevated border border-border-subtle group-hover:border-primary/50 transition-all">
        <ArrowLeft size={20} />
      </div>
      <span className="text-sm font-medium hidden sm:block">На головну</span>
    </button>

    <div className="relative w-full max-w-md">
        {/* Логотип зверху над формою */}
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center justify-center mb-2">
          <img 
            src="/src/assets/logo/audiolab.png"
            alt="AudioLab" 
            className="h-20 w-auto block select-none object-contain flex-shrink-0"
          />

          <span className="font-bold text-3xl tracking-tighter whitespace-nowrap leading-none -ml-2">
            Audio<span className="text-primary">Lab</span>
          </span>
      </div>
    
    <p className="text-sm text-text-muted">Увійдіть або створіть обліковий запис</p>
  </div>

        {/* Карточка форми */}
        <div className="bg-bg-elevated-soft/80 border border-border-subtle/80 rounded-2xl shadow-soft-xl p-6 md:p-7 backdrop-blur">
          {/* Перемикач режиму */}
          <div className="flex mb-6 rounded-xl bg-bg-elevated border border-border-subtle p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-primary text-bg-main shadow-md'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Увійти
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-primary text-bg-main shadow-md'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Зареєструватися
            </button>
          </div>

          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-medium flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {serverError}
            </div>)}

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-main">
                  Ім&apos;я користувача
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="music_lover"
                  className={`w-full rounded-lg bg-bg-elevated border px-3 py-2 text-sm text-text-main placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.username ? 'border-red-500' : 'border-border-subtle' }`}/>
                  {errors.username && <p className="text-[10px] text-red-500 ml-1">{errors.username}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-main">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className={`w-full rounded-lg bg-bg-elevated border px-3 py-2 text-sm text-text-main placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-red-500' : 'border-border-subtle'
                }`}/>
                {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-text-main">
                  Пароль
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-xs text-text-muted hover:text-primary transition-colors"
                  >
                    Забули пароль?
                  </button>
                )}
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full rounded-lg bg-bg-elevated border px-3 py-2 text-sm text-text-main placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password ? 'border-red-500' : 'border-border-subtle'
                }`}/>
              {errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <p className="text-xs text-text-muted">
                Пароль має містити мінімум 8 символів, одну літеру та одну цифру.
              </p>
            )}

            <button
              type="submit"
              disabled={isLoginLoading || isRegisterLoading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-soft text-bg-main font-semibold text-sm py-2.5 transition-colors shadow-md disabled:opacity-50"
            >
              {isLoginLoading || isRegisterLoading ? 'Завантаження...' : mode === 'login' ? 'Увійти' : 'Створити акаунт'}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="px-3 text-xs text-text-muted uppercase tracking-wide">або</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>

              <button
                  onClick={(e) => {
                      e.preventDefault();
                      handleLoginGoogle();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                  {/* Іконка Google */}
                  <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                      <path
                          d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.23-1.09 3.6-5.26 3.6-3.16 0-5.75-2.6-5.75-5.8s2.59-5.8 5.75-5.8c1.8 0 3.0.78 3.72 1.46l2.54-2.48C18.03 3.05 15.94 2 12.17 2 6.64 2 2 6.64 2 12s4.64 10 10.17 10c5.86 0 9.72-4.12 9.72-9.88 0-.66-.07-1.15-.54-1.92z"
                          fill="#4285F4"
                      />
                  </svg>
                  Вхід через Google
              </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthPage;