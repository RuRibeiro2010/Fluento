import React, { useState } from 'react';
import {
  Globe,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export interface AuthSessionData {
  userId: string;
  name: string;
  email: string;
  uiLanguage: string;
  confirmedAt: string;
}

interface AuthModalProps {
  initialLanguage?: string;
  onSuccess: (session: AuthSessionData) => void;
  onClose?: () => void;
}

export function AuthModal({
  initialLanguage = 'pt',
  onSuccess,
  onClose,
}: AuthModalProps) {
  const [uiLanguage, setUiLanguage] = useState<string>(initialLanguage);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (mode === 'signup' && !name)) {
      setError(
        uiLanguage === 'pt'
          ? 'Por favor preencha todos os campos obrigatórios.'
          : 'Please fill in all required fields.'
      );
      return;
    }

    if (password.length < 6) {
      setError(
        uiLanguage === 'pt'
          ? 'A palavra-passe deve ter pelo menos 6 caracteres.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setIsLoading(true);

    // Simulate instant secure auth & email confirmation
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailConfirmed(true);

      setTimeout(() => {
        const sessionData: AuthSessionData = {
          userId: `usr-${Date.now()}`,
          name: name || 'Utilizador Fluento',
          email,
          uiLanguage,
          confirmedAt: new Date().toISOString(),
        };
        onSuccess(sessionData);
      }, 900);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button if applicable */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fluento AI Personal Learning</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'signup'
              ? uiLanguage === 'pt'
                ? 'Criar a tua conta'
                : 'Create your account'
              : uiLanguage === 'pt'
              ? 'Iniciar Sessão'
              : 'Sign In'}
          </h2>
          <p className="text-xs text-slate-400">
            {uiLanguage === 'pt'
              ? 'Inicia a tua aprendizagem natural alimentada por IA'
              : 'Begin your natural AI-powered fluency journey'}
          </p>
        </div>

        {/* Language Choice Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {uiLanguage === 'pt' ? 'Idioma da Interface' : 'Interface Language'}
            </span>
          </label>
          <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
            {[
              { code: 'pt', label: 'PT' },
              { code: 'en', label: 'EN' },
              { code: 'es', label: 'ES' },
              { code: 'fr', label: 'FR' },
              { code: 'de', label: 'DE' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setUiLanguage(lang.code)}
                className={`py-2 rounded-xl transition text-center ${
                  uiLanguage === lang.code
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* If Confirmation Banner */}
        {isEmailConfirmed ? (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-emerald-200 text-sm">
              {uiLanguage === 'pt' ? 'Conta Confirmada com Sucesso!' : 'Account Confirmed Successfully!'}
            </h4>
            <p className="text-xs text-slate-300">
              {uiLanguage === 'pt'
                ? 'A iniciar sessão automaticamente...'
                : 'Signing in automatically...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-medium">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {uiLanguage === 'pt' ? 'Nome Completo' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={uiLanguage === 'pt' ? 'Ex: Maria Silva' : 'e.g. Alex Taylor'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="utilizador@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {uiLanguage === 'pt' ? 'Palavra-passe' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {uiLanguage === 'pt' ? 'A confirmar conta...' : 'Confirming account...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signup'
                      ? uiLanguage === 'pt'
                        ? 'Criar Conta e Entrar'
                        : 'Create Account & Start'
                      : uiLanguage === 'pt'
                      ? 'Entrar'
                      : 'Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer switch mode */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
          {mode === 'signup' ? (
            <p>
              {uiLanguage === 'pt' ? 'Já tens conta?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="font-bold text-indigo-400 hover:underline ml-1"
              >
                {uiLanguage === 'pt' ? 'Iniciar Sessão' : 'Sign In'}
              </button>
            </p>
          ) : (
            <p>
              {uiLanguage === 'pt' ? 'Ainda não tens conta?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signup');
                }}
                className="font-bold text-indigo-400 hover:underline ml-1"
              >
                {uiLanguage === 'pt' ? 'Criar Conta' : 'Sign Up'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
