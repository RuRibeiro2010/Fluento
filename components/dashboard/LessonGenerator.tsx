import React from 'react';
import { Sparkles } from 'lucide-react';
import { TargetLanguage } from '@/types/language';
import { Card, Button, Input, Heading3, CaptionText } from '@/src/components/design-system';

interface LessonGeneratorProps {
  topic: string;
  setTopic: (topic: string) => void;
  targetLanguage: TargetLanguage;
  setTargetLanguage: (lang: TargetLanguage) => void;
  level: string;
  setLevel: (level: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  supportedLanguages: { code: TargetLanguage; name: string; flag: string }[];
}

export function LessonGenerator({
  topic,
  setTopic,
  targetLanguage,
  setTargetLanguage,
  level,
  setLevel,
  onGenerate,
  isGenerating,
  supportedLanguages,
}: LessonGeneratorProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
        <Sparkles className="w-4 h-4" />
        <Heading3 className="text-sm">Gerar Aula Personalizada com IA</Heading3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language Selector */}
        <div className="flex flex-col gap-1.5 w-full">
          <CaptionText className="font-semibold text-slate-300">
            Idioma Alvo
          </CaptionText>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value as TargetLanguage)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="flex flex-col gap-1.5 w-full">
          <CaptionText className="font-semibold text-slate-300">
            Nível CEFR Alvo
          </CaptionText>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
          >
            <option value="A1" className="bg-slate-900">A1 - Iniciante</option>
            <option value="A2" className="bg-slate-900">A2 - Elementar</option>
            <option value="B1" className="bg-slate-900">B1 - Intermediário</option>
            <option value="B2" className="bg-slate-900">B2 - Intermediário Superior</option>
            <option value="C1" className="bg-slate-900">C1 - Avançado</option>
          </select>
        </div>

        {/* Topic Input */}
        <Input
          label="Tópico / Objetivo da Aula"
          placeholder="Ex: Pedir café, Entrevista de Emprego..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          autoComplete="off"
        />
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={onGenerate}
        disabled={isGenerating || !topic.trim()}
        isLoading={isGenerating}
        icon={!isGenerating && <Sparkles className="w-4 h-4" />}
      >
        {isGenerating ? "Gerando Aula com Memória AI..." : "Gerar Aula Adaptativa"}
      </Button>
    </Card>
  );
}

