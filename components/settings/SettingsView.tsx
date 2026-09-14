import React, { useState } from 'react';
import { Settings, Globe, Volume2, Mic, Bell, Shield, Download, UserCheck, CheckCircle2, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [uiLanguage, setUiLanguage] = useState('pt');
  const [targetAccent, setTargetAccent] = useState('es-ES');
  const [speechSpeed, setSpeechSpeed] = useState('1.0');
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState('strict');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      studentId: 'usr_fluento_primary',
      exportVersion: '1.0',
      settings: { uiLanguage, targetAccent, speechSpeed, notifications, privacyMode }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluento-student-data-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans text-slate-100 p-4 md:p-8">
      {/* Title */}
      <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Configurações do Sistema</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Definições Fluento</h1>
          <p className="text-xs text-slate-300 mt-1">
            Gere o idioma da interface, parâmetros da voz do AI Coach, notificações e privacidade.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Guardar alterações das definições"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Alterações</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Definições atualizadas com sucesso!</span>
        </div>
      )}

      {/* Settings Options Grid */}
      <div className="space-y-6">
        {/* 1. Idioma da Interface & Voz */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" /> Idioma da Interface & Voz do Professor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="ui-lang-select" className="font-bold text-slate-300 block mb-1.5">Idioma da Interface (UI):</label>
              <select
                id="ui-lang-select"
                value={uiLanguage}
                onChange={(e) => setUiLanguage(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm"
              >
                <option value="pt">Português (🇵🇹)</option>
                <option value="en">English (🇬🇧)</option>
                <option value="es">Español (🇪🇸)</option>
              </select>
            </div>

            <div>
              <label htmlFor="target-accent-select" className="font-bold text-slate-300 block mb-1.5">Sotaque Preferido do AI Coach:</label>
              <select
                id="target-accent-select"
                value={targetAccent}
                onChange={(e) => setTargetAccent(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm"
              >
                <option value="es-ES">Espanhol de Espanha (Castelhano)</option>
                <option value="es-MX">Espanhol do México (Neutro)</option>
                <option value="es-AR">Espanhol da Argentina (Rioplatense)</option>
                <option value="en-US">Inglês Americano</option>
                <option value="en-GB">Inglês Britânico</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Velocidade da Fala & Áudio */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" /> Velocidade de Fala & Áudio
          </h3>

          <div>
            <label className="font-bold text-slate-300 text-xs block mb-2">Velocidade da Voz do AI Coach:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { val: '0.85', label: '0.85x (Cadenciada / Iniciante)' },
                { val: '1.0', label: '1.0x (Velocidade Nativa Normal)' },
                { val: '1.15', label: '1.15x (Aceleração e Desafio)' },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setSpeechSpeed(s.val)}
                  className={`min-h-[44px] p-3 rounded-xl border text-center font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    speechSpeed === s.val
                      ? 'bg-indigo-950 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  aria-label={`Definir velocidade de voz para ${s.label}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Notificações & Privacidade */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" /> Notificações & Lembretes Diários
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="font-bold text-white block">Lembretes Diários do AI Coach</span>
              <p className="text-slate-400 text-[11px]">Receber avisos pedagógicos no horário preferido de treino.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Exportação de Dados & Conta */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" /> Privacidade, Exportação & Conta
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="font-bold text-white block">Exportar Todos os Dados do Aluno</span>
              <p className="text-slate-400 text-[11px]">Descarregar ficheiro JSON com o Student Digital Twin e histórico.</p>
            </div>
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Exportar Dados (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
