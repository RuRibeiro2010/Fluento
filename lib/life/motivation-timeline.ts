/**
 * Motivation Timeline Module (Living Language Ecosystem - Phase 13)
 * Tracks intrinsic motivation shifts, predicts plateau periods,
 * and delivers timely encouragement and milestone celebrations.
 */

export interface MotivationPoint {
  dayNumber: number;
  perceivedFluencyProgress: number; // 0 to 100
  motivationLevel: 'high' | 'steady' | 'dip_risk' | 'rebound';
  milestoneNote?: string;
}

export function generateMotivationTimeline(daysActive: number = 30): MotivationPoint[] {
  const points: MotivationPoint[] = [];

  for (let d = 1; d <= daysActive; d++) {
    let level: MotivationPoint['motivationLevel'] = 'steady';
    let progress = Math.min(100, Math.round(15 + d * 2.2));

    if (d === 1 || d === 7 || d === 30) {
      level = 'high';
    } else if (d === 14 || d === 21) {
      level = 'dip_risk';
    }

    let note: string | undefined = undefined;
    if (d === 7) note = '1ª Semana Concluída com Sucesso!';
    if (d === 14) note = 'Superaste o Plateu dos 14 Dias!';
    if (d === 30) note = '1 Mês de Fluência Viva!';

    points.push({
      dayNumber: d,
      perceivedFluencyProgress: progress,
      motivationLevel: level,
      milestoneNote: note,
    });
  }

  return points;
}
