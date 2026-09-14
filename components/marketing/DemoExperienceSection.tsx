import React, { useState } from 'react';
import {
  Play,
  Volume2,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  Subtitles,
  Award,
  CheckCircle2,
  ArrowRight,
  User,
  Bot,
} from 'lucide-react';

interface DemoExperienceSectionProps {
  onStartFree?: () => void;
}

export function DemoExperienceSection({ onStartFree }: DemoExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<'teacher' | 'subtitles' | 'missions' | 'coach'>('teacher');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const demoTurns = [
    {
      speaker: 'teacher',
      name: 'Prof. Mateo (Virtual Teacher)',
      text: '¡Hola! Bienvenido a Madrid. ¿Tienes una reserva para el hotel hoy?',
      translation: 'Olá! Bem-vindo a Madrid. Tens uma reserva para o hotel hoje?',
      annotation: 'Vocabulário chave B1: reserva, bienvenido',
    },
    {
      speaker: 'user',
      name: 'Tu (Aluno)',
      text: 'Sí, yo tengo una reserva para dos personas... eh... para tres noches.',
      translation: 'Sim, eu tenho uma reserva para duas pessoas... eh... para três noites.',
      note: 'Deteção de hesitação suave: O professor esperou pacientemente sem interromper.',
    },
    {
      speaker: 'teacher',
      name: 'Prof. Mateo (Virtual Teacher)',
      text: '¡Perfecto! Todo está en orden. ¿Te gustaría una habitación con vista a la Gran Vía o prefieres tranquilidad?',
      translation: 'Perfeito! Está tudo em ordem. Gostarias de um quarto com vista para a Gran Vía ou preferes tranquilidade?',
      annotation: 'Desafio progressivo (+0.04 dificuldade): "tranquilidad" vs "vista"',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Demonstração Interativa</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Vê o Fluento em Ação
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Uma experiência fluida e natural como se estivesses numa videochamada com o teu professor de línguas favorito.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {[
            { id: 'teacher', label: 'Professor Virtual', icon: Bot },
            { id: 'subtitles', label: 'Legendas Inteligentes', icon: Subtitles },
            { id: 'missions', label: 'Missões Reais', icon: Award },
            { id: 'coach', label: 'AI Coach 24/7', icon: MessageSquare },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Demo Content Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-6">
          {activeTab === 'teacher' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                    M
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Sessão Live com Prof. Mateo</h3>
                    <p className="text-xs text-indigo-400">Modo: Situações Reais • Nível B1 • Espanhol</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 hover:text-white text-xs font-semibold transition"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-emerald-400' : ''}`} />
                  <span>{isPlayingAudio ? 'A reproduzir áudio...' : 'Ouvir Voz AI'}</span>
                </button>
              </div>

              {/* Dialogue stream */}
              <div className="space-y-4">
                {demoTurns.map((turn, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-2 transition ${
                      turn.speaker === 'teacher'
                        ? 'bg-slate-900/90 border-indigo-900/40 text-slate-100 ml-0 mr-4'
                        : 'bg-indigo-950/40 border-indigo-800/50 text-indigo-100 ml-4 mr-0'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={turn.speaker === 'teacher' ? 'text-indigo-400' : 'text-amber-400'}>
                        {turn.name}
                      </span>
                      {turn.annotation && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 text-[10px] border border-indigo-800">
                          {turn.annotation}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium leading-relaxed">{turn.text}</p>
                    <p className="text-xs text-slate-400 italic">Tradução: "{turn.translation}"</p>

                    {turn.note && (
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-900/50 text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{turn.note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subtitles' && (
            <div className="space-y-4 text-center py-4">
              <h3 className="font-extrabold text-lg text-white">4 Modos Adaptativos de Legendas</h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">
                Ligas e desligas legendas consoante o teu nível de confiança para garantir uma imersão auditiva sem muletas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-indigo-400">1. Desligadas (Off)</span>
                  <p className="text-xs text-slate-300">Imersão auditiva 100% nativa para treinar o ouvido sem distracções visuais.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-indigo-400">2. Apenas Língua-Alvo</span>
                  <p className="text-xs text-slate-300">Visualiza as palavras faladas em espanhol para conectar som e escrita.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-indigo-400">3. Apenas Palavras Difíceis</span>
                  <p className="text-xs text-slate-300">Destaca termos avançados B2/C1 com anotações automáticas ao passar o cursor.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-indigo-400">4. Tradução Sob Demanda</span>
                  <p className="text-xs text-slate-300">Carrega no botão de apoio para revelar a tradução em português temporariamente.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="space-y-4 py-2">
              <h3 className="font-extrabold text-lg text-white text-center">Missões Reais do Dia a Dia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-indigo-400">Check-in no Hotel de Madrid</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">Nível A2-B1</span>
                  </div>
                  <p className="text-xs text-slate-300">Resolve a tua reserva, pede um quarto silencioso com vista e confirma o pequeno-almoço.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-indigo-400">Reunião Executiva de Parceria</span>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px]">Nível B2-C1</span>
                  </div>
                  <p className="text-xs text-slate-300">Apresenta uma proposta de negócio, esclarece prazos e fecha acordo em ambiente profissional.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'coach' && (
            <div className="space-y-4 py-2 text-center">
              <h3 className="font-extrabold text-lg text-white">AI Coach Pessoal 24/7</h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">
                Acompanha a tua evolução diária, analisa dúvidas gramaticais específicas e adapta o teu plano semanal em tempo real.
              </p>
            </div>
          )}

          {/* Bottom CTA button */}
          <div className="pt-4 flex justify-center">
            {onStartFree && (
              <button
                onClick={onStartFree}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-105"
              >
                <span>Experimentar Agora Gratuitamente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
