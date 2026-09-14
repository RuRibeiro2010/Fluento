import React, { useState, useEffect } from 'react';
import { learningAnalyticsEngine, LearningAnalyticsReport } from '@/src/lib/learning-analytics';
import { BarChart3, TrendingUp, ShieldCheck, Brain, Zap, Target, Award, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface AnalyticsDashboardViewProps {
  studentId?: string;
  onBackToDashboard?: () => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  studentId = 'usr_fluento_primary',
  onBackToDashboard
}) => {
  const [report, setReport] = useState<LearningAnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [studentId]);

  const loadAnalytics = () => {
    setLoading(true);
    const data = learningAnalyticsEngine.generateReport(studentId);
    setReport(data);
    setLoading(false);
  };

  if (loading || !report) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
        <span>A calcular métricas objetivas do Learning Analytics Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100 p-4 md:p-8">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span>Métricas Objetivas Pedagógicas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Learning Analytics Engine</h1>
          <p className="text-xs text-slate-300 mt-1">
            Análise em tempo real focada na transferência de conhecimento, autonomia e preparação para o mundo real.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Atualizar relatório de métricas objetivas"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Atualizar Relatório</span>
        </button>
      </div>

      {/* Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">Índice Geral de Evolução</span>
              <h3 className="text-2xl font-extrabold text-white">{report.overallEvolutionScore}/100</h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-extrabold">
            Nível Ativo: {report.velocity.currentCefr} → Meta: {report.velocity.targetCefr}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-950/60 p-4 rounded-xl border border-indigo-900/40">
          "{report.executiveSummary}"
        </p>
      </div>

      {/* 6 Key Analytics Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Confiança Pedagógica */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Confiança de Fala
            </h4>
            <span className="font-extrabold text-indigo-400 text-base">{report.confidence.score}%</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Fala Spontânea:</span>
              <span className="font-bold text-white">{report.confidence.speakingConfidence}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Compreensão Auditiva:</span>
              <span className="font-bold text-white">{report.confidence.listeningConfidence}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Pronúncia:</span>
              <span className="font-bold text-white">{report.confidence.pronunciationConfidence}%</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
            {report.confidence.evaluationNote}
          </p>
        </div>

        {/* 2. Independência & Andaime */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Autonomia & Independência
            </h4>
            <span className="font-extrabold text-amber-400 text-base">{report.independence.score}%</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Turnos sem Suporte:</span>
              <span className="font-bold text-white">{Math.round(report.independence.unassistedTurnRatio * 100)}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Dependência de Andaime:</span>
              <span className="font-bold text-indigo-300 uppercase">{report.independence.scaffoldDependencyLevel}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Latência Média de Resposta:</span>
              <span className="font-bold text-white">{report.independence.avgResponseDelaySeconds}s</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
            {report.independence.evaluationNote}
          </p>
        </div>

        {/* 3. Retenção & Repetição Espaçada (SRS) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" /> Retenção SRS & Memória
            </h4>
            <span className="font-extrabold text-indigo-400 text-base">{report.retention.score}%</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Taxa de Evocação Ativa:</span>
              <span className="font-bold text-white">{Math.round(report.retention.activeRecallSuccessRate * 100)}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Itens em Memória de Longo Prazo:</span>
              <span className="font-bold text-emerald-400">{report.retention.srsItemCount}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Revisões Pendentes Hoje:</span>
              <span className="font-bold text-amber-400">{report.retention.dueReviewItemsCount}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
            {report.retention.evaluationNote}
          </p>
        </div>

        {/* 4. Velocidade & Projeção CEFR */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" /> Velocidade CEFR
            </h4>
            <span className="font-extrabold text-sky-400 text-base">{report.velocity.masteryRatePerWeek} conceitos/sem</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Semanas Estimadas para {report.velocity.targetCefr}:</span>
              <span className="font-bold text-white">{report.velocity.estimatedWeeksToTargetCefr} semanas</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Classificação de Ritmo:</span>
              <span className="font-bold text-emerald-400 uppercase">{report.velocity.velocityRating}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
            {report.velocity.evaluationNote}
          </p>
        </div>

        {/* 5. Preparação para o Mundo Real */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" /> Preparação Mundo Real
            </h4>
            <span className="font-extrabold text-rose-400 text-base">{report.readiness.overallReadinessScore}%</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Mundo Profissional & Negócios:</span>
              <span className="font-bold text-white">{report.readiness.professionalReadinessScore}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Viagens & Vida Social:</span>
              <span className="font-bold text-white">{report.readiness.travelSocialReadinessScore}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Espontaneidade:</span>
              <span className="font-bold text-white">{report.readiness.spontaneityScore}%</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
            {report.readiness.evaluationNote}
          </p>
        </div>

        {/* 6. Retorno de Investimento (Learning ROI) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" /> Learning ROI
            </h4>
            <span className="font-extrabold text-violet-400 text-base">{report.roi.progressPointsPerHoursSpent} pts/h</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Horas Praticadas na Plataforma:</span>
              <span className="font-bold text-white">{report.roi.totalHoursSpent}h</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Conceitos Totalmente Dominados:</span>
              <span className="font-bold text-emerald-400">{report.roi.masteredConceptsTotal}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Eficiência Pedagógica:</span>
              <span className="font-bold text-indigo-300">{report.roi.efficiencyScore}% ({report.roi.roiRating})</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
            {report.roi.evaluationNote}
          </p>
        </div>
      </div>
    </div>
  );
};
