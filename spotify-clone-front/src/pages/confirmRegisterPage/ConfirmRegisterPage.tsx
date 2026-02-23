import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation } from '../../services/Api/api'
import { setCredentials } from '../../services/Api/authSlice'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

const CODE_LENGTH = 6

const ConfirmRegisterPage = () => {
    const navigate = useNavigate()
    if(!sessionStorage.getItem('registerConfirmEmail')){
        navigate("/login")
    }
    const dispatch = useDispatch()
    const [confirmRegister, { isLoading }] = useRegisterMutation()

    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const newCode = [...code]
        newCode[index] = value.slice(-1)
        setCode(newCode)
        setServerError(null)

        if (value && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
        if (!pasted) return
        const newCode = Array(CODE_LENGTH).fill('')
        pasted.split('').forEach((char, i) => { newCode[i] = char })
        setCode(newCode)
        const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1)
        inputRefs.current[nextIndex]?.focus()
    }

    const fullCode = code.join('')
    const isComplete = fullCode.length === CODE_LENGTH

    const handleSubmit = async () => {
        if (!isComplete || isLoading) return
        setServerError(null)
        try {
            const result: any = await confirmRegister({ confirmCode: parseInt(fullCode) }).unwrap()
            if (result?.data) {
                const { accessToken, refreshToken} = result.data
                dispatch(setCredentials({
                    accessToken,
                    refreshToken,
                }))
            }
            setSuccess(true)
            sessionStorage.removeItem('registerConfirmEmail');
            setTimeout(() => navigate('/'), 1500)
        } catch (err: any) {
            setServerError(err.data?.message || 'Невірний код. Спробуйте ще раз.')
            setCode(Array(CODE_LENGTH).fill(''))
            inputRefs.current[0]?.focus()
        }
    }

    return (
        <div className="relative min-h-screen bg-bg-main text-text-main flex items-center justify-center px-4 overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-72 w-72 rounded-full bg-primary-soft/20 blur-3xl" />
            <input type="hidden" value={sessionStorage.getItem("registerConfirmEmail")!} />
            <button
                onClick={() => navigate('/login')}
                className="absolute top-8 left-8 flex items-center gap-2 text-text-muted hover:text-white transition-colors group z-50"
            >
                <div className="p-2 rounded-full bg-bg-elevated border border-border-subtle group-hover:border-primary/50 transition-all">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-medium hidden sm:block">Назад</span>
            </button>

            <div className="relative w-full max-w-md">
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
                </div>

                <div className="bg-bg-elevated-soft/80 border border-border-subtle/80 rounded-2xl shadow-soft-xl p-6 md:p-8 backdrop-blur text-center">
                    {success ? (
                        <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
                            <div className="h-16 w-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-text-main mb-1">Акаунт підтверджено!</h2>
                                <p className="text-sm text-text-muted">Перенаправлення...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-5">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <Mail size={28} className="text-primary" />
                                </div>
                            </div>

                            <h1 className="text-xl font-semibold text-text-main mb-2">Підтвердження email</h1>
                            <p className="text-sm text-text-muted mb-7 leading-relaxed">
                                На вашу пошту було надіслано 6-значний код.<br />
                                Введіть його нижче, щоб завершити реєстрацію.
                            </p>

                            <div className="flex justify-center gap-3 mb-5">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => { inputRefs.current[index] = el }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleChange(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className={`
                      h-13 w-11 text-center text-xl font-bold rounded-xl border
                      bg-bg-elevated text-text-main
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                      transition-all caret-transparent
                      ${serverError ? 'border-red-500/70 bg-red-500/5' : digit ? 'border-primary/60' : 'border-border-subtle'}
                    `}
                                        style={{ fontSize: '1.35rem' }}
                                    />
                                ))}
                            </div>

                            {serverError && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-medium flex items-center gap-2 text-left">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                                    {serverError}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={!isComplete || isLoading}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-soft text-bg-main font-semibold text-sm py-2.5 transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Перевірка...' : 'Підтвердити'}
                            </button>

                            <p className="mt-5 text-xs text-text-muted">
                                Не отримали код?{' '}
                                <button
                                    type="button"
                                    className="text-primary hover:underline transition-colors font-medium"
                                    onClick={() => {

                                    }}
                                >
                                    Надіслати ще раз
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConfirmRegisterPage