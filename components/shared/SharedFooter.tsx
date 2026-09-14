import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SharedFooterProps {
  onNavigate: (view: string) => void;
}

export const SharedFooter: React.FC<SharedFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">
                F
              </div>
              <span className="font-extrabold text-white text-base">Fluento</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              O teu professor pessoal de idiomas, disponível 24 horas por dia, 7 dias por semana.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Metodologia Pedagógica Certificada CEFR</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white transition">Dashboard Principal</button></li>
              <li><button onClick={() => onNavigate('lesson')} className="hover:text-white transition">Sala de Aula ao Vivo</button></li>
              <li><button onClick={() => onNavigate('progress')} className="hover:text-white transition">Evolução do Aluno</button></li>
              <li><button onClick={() => onNavigate('analytics')} className="hover:text-white transition">Learning Analytics Engine</button></li>
              <li><button onClick={() => onNavigate('placement')} className="hover:text-white transition">Diagnóstico de Nível</button></li>
            </ul>
          </div>

          {/* Account & Profile */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Conta e Perfil</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => onNavigate('profile')} className="hover:text-white transition">Student Digital Twin</button></li>
              <li><button onClick={() => onNavigate('settings')} className="hover:text-white transition">Definições de Voz e Sotaque</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition">Planos e Subscrições</button></li>
              <li><button onClick={() => onNavigate('onboarding')} className="hover:text-white transition">Refazer Onboarding</button></li>
            </ul>
          </div>

          {/* Pedagogy & Architecture */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Inteligência Fluento</h4>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1 text-slate-300">
              <span className="font-bold text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 12-Stage Intelligence Pipeline
              </span>
              <p className="text-slate-400 leading-relaxed">
                Orquestração determinística entre o Student Digital Twin, Learning Engine e AI Runtime.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Fluento AI Language Teacher. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('settings')} className="hover:text-slate-300">Privacidade</button>
            <button onClick={() => onNavigate('settings')} className="hover:text-slate-300">Termos de Serviço</button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-slate-300">Garantia de Evolução</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
