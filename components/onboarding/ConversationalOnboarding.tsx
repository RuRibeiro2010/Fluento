import React, { useState } from 'react';
import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { UserProfile } from '@/types/profile';
import { Sparkles, MessageSquare, ArrowRight, CheckCircle2, User, Target, Compass } from 'lucide-react';

interface ConversationalOnboardingProps {
  onComplete?: (profile: UserProfile) => void;
  onGoToPlacement?: () => void;
  onCancel?: () => void;
}

export const ConversationalOnboarding: React.FC<ConversationalOnboardingProps> = ({
  onComplete,
  onGoToPlacement,
  onCancel
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{
    name: string;
    profession: string;
    motivation: string;
    targetLanguage: string;
    interests: string[];
  }>({
    name: '',
    profession: '',
    motivation: 'Avanço na Carreira Executiva',
    targetLanguage: 'es-ES',
    interests: ['Negócios', 'Viagens Executivas', 'Tecnologia']
  });

  const handleNextStep = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      // Save and update Student Digital Twin
      const studentId = 'usr_fluento_primary';
      const updatedTwin = studentDigitalTwin.updateTwin(studentId, {
        identity: {
          name: answers.name || 'Aluno Executivo',
          email: 'aluno@fluento.ai',
          targetLanguage: answers.targetLanguage
        },
        goal: {
          primaryMotivation: answers.motivation,
          professionalDomain: answers.profession || 'Carreira Executiva',
          weeklyMinutesGoal: 105
        },
        emotional: {
          confidenceScores: {
            speaking: 60,
            listening: 65,
            vocabulary: 60,
            grammar: 55,
            pronunciation: 70,
            overall: 62
          }
        }
      });

      const userProfile: UserProfile = {
        id: studentId,
        email: 'aluno@fluento.ai',
        native_language: 'pt-PT',
        target_languages: [answers.targetLanguage],
        coach_personality: 'encouraging',
        humor_style: 'light',
        weekly_goal: 105,
        minutes_per_day: 15,
        confidence_score: 62,
        current_focus: answers.motivation,
        profession: answers.profession || 'Carreira Executiva',
        hobbies: answers.interests,
        motivation: answers.motivation,
        learning_style: 'interactive',
        difficulty_preference: 'balanced',
        preferred_topics: answers.interests,
        learning_preferences: {
          topics: answers.interests,
          pace: 'moderate'
        },
        skill_matrix: {
          speaking: 60,
          listening: 65,
          vocabulary: 60,
          grammar: 55,
          pronunciation: 70,
          reading: 65,
          writing: 60
        }
      };

      if (onComplete) {
        onComplete(userProfile);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 font-sans space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">Apresentação Conversacional</h2>
            <p className="text-[11px] text-slate-400">Construção direta do teu Student Digital Twin</p>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-400">Passo {step + 1} de 5</span>
      </div>

      {/* Conversational Questions Flow */}
      {step === 0 && (
        <div className="space-y-4 animate-fadeIn">
          <label className="font-extrabold text-lg text-white block">
            Olá! Como te chamas e qual é o teu objetivo principal?
          </label>
          <input
            type="text"
            value={answers.name}
            onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
            placeholder="Ex: Ana Silva"
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <label className="font-extrabold text-lg text-white block">
            Qual é a tua área de atuação ou profissão?
          </label>
          <input
            type="text"
            value={answers.profession}
            onChange={(e) => setAnswers({ ...answers, profession: e.target.value })}
            placeholder="Ex: Gestor de Projetos / Eng. Software / Advogado"
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <label className="font-extrabold text-lg text-white block">
            Qual é a tua principal motivação para dominar este idioma?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
            {[
              'Liderar Reuniões Internacionais',
              'Avanço na Carreira Executiva',
              'Viagens e Vida Social Sem Barreiras',
              'Certificação Oficial CEFR (B2/C1)'
            ].map((m) => (
              <button
                key={m}
                onClick={() => setAnswers({ ...answers, motivation: m })}
                className={`p-4 rounded-xl border text-left transition ${
                  answers.motivation === m
                    ? 'bg-indigo-950 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <label className="font-extrabold text-lg text-white block">
            Qual idioma queres praticar hoje?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
            {[
              { id: 'es-ES', label: 'Espanhol (Espanha / Castelhano)' },
              { id: 'es-MX', label: 'Espanhol (México / Neutro)' },
              { id: 'en-US', label: 'Inglês (Estados Unidos)' },
              { id: 'en-GB', label: 'Inglês (Reino Unido)' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setAnswers({ ...answers, targetLanguage: lang.id })}
                className={`p-4 rounded-xl border text-left transition ${
                  answers.targetLanguage === lang.id
                    ? 'bg-indigo-950 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 text-center animate-fadeIn">
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800 text-indigo-300 text-xs font-medium space-y-2">
            <span className="font-extrabold text-white text-sm block">Tudo pronto para personalizar o teu AI Coach!</span>
            <p>Criámos o teu perfil no Student Digital Twin com base nas tuas respostas.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToPlacement}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Fazer Teste Diagnóstico Curto (Opcional)</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          Cancelar
        </button>

        <button
          onClick={handleNextStep}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-1.5"
        >
          <span>{step === 4 ? 'Concluir Onboarding' : 'Continuar'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
