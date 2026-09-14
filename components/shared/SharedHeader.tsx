import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  User,
  Settings as SettingsIcon,
  Sparkles,
  PlayCircle,
  CreditCard,
  Compass,
  Menu,
  X
} from 'lucide-react';

interface SharedHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userEmail?: string;
  userName?: string;
}

export const SharedHeader: React.FC<SharedHeaderProps> = ({
  currentView,
  onNavigate,
  userEmail = 'aluno@fluento.ai',
  userName = 'Aluno Fluento'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: Compass, color: 'text-slate-300' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-slate-300' },
    { id: 'lesson', label: 'Sala de Aula', icon: PlayCircle, color: 'text-amber-400' },
    { id: 'progress', label: 'Progresso', icon: TrendingUp, color: 'text-emerald-400' },
    { id: 'analytics', label: 'Analytics AI', icon: BarChart3, color: 'text-sky-400' },
    { id: 'profile', label: 'Perfil Twin', icon: User, color: 'text-indigo-400' },
    { id: 'pricing', label: 'Planos', icon: CreditCard, color: 'text-violet-400' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1"
          aria-label="Ir para a página inicial do Fluento"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-indigo-600/30">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">Fluento</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80 uppercase tracking-wider">
                AI Teacher
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Professor pessoal de idiomas 24/7
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold text-slate-300" aria-label="Navegação Principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'home' && currentView === 'landing');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`min-h-[44px] px-3 py-2 rounded-xl transition flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('placement')}
            className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Abrir teste diagnóstico de nível"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Avaliar Nível</span>
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              currentView === 'settings' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 hover:bg-slate-800'
            }`}
            aria-label="Definições da conta"
            title="Definições"
          >
            <SettingsIcon className="w-4 h-4 mx-auto" />
          </button>

          <button
            onClick={() => handleNavClick('lesson')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-extrabold transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <PlayCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Começar Aula</span>
            <span className="sm:hidden">Aula</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Alternar menu de navegação mobile"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 mx-auto" /> : <Menu className="w-5 h-5 mx-auto" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-1 bg-slate-950 p-2 rounded-2xl animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'home' && currentView === 'landing');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full min-h-[44px] px-4 py-3 rounded-xl transition flex items-center gap-3 text-xs font-bold text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
