import React, { useState } from 'react';
import { Sparkles, Mic, MicOff, Send, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';
import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { UserProfile } from '@/types/profile';

interface PlacementTestViewProps {
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const PlacementTestView: React.FC<PlacementTestViewProps> = ({
  onComplete,
  onCancel
}) => {
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'teacher' | 'student'; text: string; translation?: string }>>([
    {
      id: 'm1',
      sender: 'teacher',
      text: '¡Hola! Qué gusto saludarte. Vamos a conversar durante algunos minutos para conocernos mejor y determinar tu nivel de forma natural. Para empezar: ¿Cómo te llamas y a qué te dedicas?',
      translation: 'Olá! Muito gosto em cumprimentar-te. Vamos conversar durante alguns minutos para nos conhecermos melhor e determinar o teu nível de forma natural. Para começar: Como te chamas e o que fazes profissionalmente?'
    }
  ]);
  const [inputUtterance, setInputUtterance] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [turnCount, setTurnCount] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [evaluatedCefr, setEvaluatedCefr] = useState<'A2' | 'B1' | 'B2' | 'C1'>('B1');

  const handleSendMessage = () => {
    if (!inputUtterance.trim()) return;

    const studentMsg = inputUtterance;
    const newMsgs = [
      ...messages,
      { id: `student_${Date.now()}`, sender: 'student' as const, text: studentMsg }
    ];
    setMessages(newMsgs);
    setInputUtterance('');
    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);

    if (nextTurn >= 4) {
      // Diagnostic complete
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `teacher_final_${Date.now()}`,
            sender: 'teacher',
            text: '¡Excelente conversación! He analizado tu fluidez, vocabulario y concordancia gramatical. Estás en un nivel B1 (Intermedio), listo para progresar hacia la fluencia autónoma B2.',
            translation: 'Excelente conversa! Analisei a tua fluidez, vocabulário e concordância gramatical. Estás num nível B1 (Intermédio), pronto para progredir rumo à fluência autónoma B2.'
          }
        ]);
        setIsFinished(true);
      }, 1000);
    } else {
      // Simulated Teacher diagnostic turns
      setTimeout(() => {
        const teacherPrompts = [
          '¡Muy bien! Cuéntame un poco sobre una situación de trabajo o viaje donde tuviste que comunicarte en otro idioma.',
          'Entendido. Y cuando hablas en otro idioma, ¿cuál es el mayor desafío que sientes: el vocabulario, la velocidad o la confianza al hablar?',
          'Perfecto. ¡Muchas gracias por compartirlo! He completado tu diagnóstico de nivel.'
        ];
        setMessages((prev) => [
          ...prev,
          {
            id: `teacher_${Date.now()}`,
            sender: 'teacher',
            text: teacherPrompts[nextTurn - 2] || '¡Excelente! Continuemos la práctica.',
            translation: 'Compreendido! Vamos adaptar o teu plano às tuas metas reais.'
          }
        ]);
      }, 1000);
    }
  };

  const handleFinalizeAndCreateTwin = () => {
    const studentId = 'usr_fluento_primary';
    const twin = studentDigitalTwin.getOrCreateTwin(studentId);

    studentDigitalTwin.updateTwin(studentId, {
      identity: {
        ...twin.identity,
        nativeLanguage: 'pt-PT',
        targetLanguage: 'es-ES',
      },
      language: {
        ...twin.language,
        currentCefr: evaluatedCefr,
        targetCefr: evaluatedCefr === 'B1' ? 'B2' : 'C1',
      },
      emotional: {
        ...twin.emotional,
        confidenceScores: {
          speaking: 68,
          listening: 78,
          vocabulary: 70,
          grammar: 72,
          pronunciation: 75,
          overall: 73,
        }
      }
    });

    const profile: UserProfile = {
      id: studentId,
      email: 'aluno@fluento.ai',
      native_language: 'pt-PT',
      target_languages: ['es-ES'],
      coach_personality: 'encouraging',
      humor_style: 'light',
      weekly_goal: 105,
      minutes_per_day: 15,
      confidence_score: 73,
      current_focus: 'Apresentações & Conversações de Negócios',
      profession: 'Profissional Executivo',
      hobbies: ['Negócios', 'Tecnologia'],
      motivation: 'Fluência em contexto profissional',
      learning_style: 'interactive',
      difficulty_preference: 'balanced',
      preferred_topics: ['Negócios', 'Viagens'],
      learning_preferences: {
        topics: ['Negócios', 'Viagens'],
        pace: 'moderate'
      },
      skill_matrix: {
        speaking: 68,
        listening: 78,
        vocabulary: 70,
        grammar: 72,
        pronunciation: 75,
        reading: 75,
        writing: 70
      }
    };

    onComplete(profile);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-sans text-slate-100">
      {/* Title */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Diagnóstico Inicial de Nível</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Vamos conversar durante alguns minutos para conhecermos melhor o teu nível.
        </h1>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Sem testes de escolha múltipla ou pressão. Apenas uma conversa natural com o teu professor pessoal.
        </p>
      </div>

      {/* Conversation Window */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 mb-6 shadow-2xl">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                  m.sender === 'teacher'
                    ? 'bg-indigo-950/80 border border-indigo-800/80 text-indigo-100 rounded-tl-none'
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 opacity-75 text-[10px] uppercase font-bold">
                  <span>{m.sender === 'teacher' ? 'Professor Fluento' : 'Tu'}</span>
                  {m.sender === 'teacher' && <Volume2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />}
                </div>
                <p>{m.text}</p>
                {m.translation && (
                  <p className="text-[11px] text-slate-400 border-t border-indigo-800/50 pt-1.5 mt-2 italic">
                    💡 {m.translation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action input or completion box */}
        {!isFinished ? (
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`min-h-[44px] min-w-[44px] p-3 rounded-xl border transition flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title={isRecording ? 'A gravar voz...' : 'Falar com Microfone'}
              aria-label={isRecording ? 'Parar gravação de voz' : 'Ativar microfone para falar'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
            </button>

            <input
              type="text"
              value={inputUtterance}
              onChange={(e) => setInputUtterance(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecording ? 'A ouvir a tua voz...' : 'Responde em espanhol ou português...'}
              className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Resposta do aluno no diagnóstico"
            />

            <button
              onClick={handleSendMessage}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Enviar mensagem do diagnóstico"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Student Digital Twin Criado com Sucesso!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Nível Avaliado: <strong className="text-emerald-400 font-extrabold">{evaluatedCefr} Intermédio</strong>
              </p>
            </div>
            <button
              onClick={handleFinalizeAndCreateTwin}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl transition flex items-center justify-center gap-2"
            >
              <span>Ir para o Dashboard Principal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
