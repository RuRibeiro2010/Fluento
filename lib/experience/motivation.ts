import { StudentModel } from '@/types/brain';

export interface MotivationAnalysis {
  motivationScore: number; // 0 - 100
  consistencyBonus: number;
  perceivedEffortRating: 'high_effort' | 'steady_flow' | 'low_engagement';
  primaryMotivationFactor: 'career_growth' | 'relocation' | 'intellectual_mastery' | 'travel';
  motivationalAdvice: string;
}

/**
 * Motivation Service
 * Analyzes intrinsic student motivation factors, session consistency, and career/life goals.
 */
export class MotivationService {
  public analyzeMotivation(
    studentModel: StudentModel,
    recentStreakDays: number,
    completedSessionsCount: number
  ): MotivationAnalysis {
    const consistencyBonus = Math.min(30, recentStreakDays * 5);
    const baseScore = studentModel.confidenceScore || 70;
    const motivationScore = Math.min(100, Math.round((baseScore + consistencyBonus + completedSessionsCount * 2) / 2));

    let perceivedEffortRating: MotivationAnalysis['perceivedEffortRating'] = 'steady_flow';
    if (recentStreakDays >= 5 && completedSessionsCount >= 10) {
      perceivedEffortRating = 'high_effort';
    } else if (recentStreakDays < 2) {
      perceivedEffortRating = 'low_engagement';
    }

    const goal = (studentModel.objectives || []).join(' ').toLowerCase();
    let primaryFactor: MotivationAnalysis['primaryMotivationFactor'] = 'intellectual_mastery';
    if (goal.includes('work') || goal.includes('job') || goal.includes('career') || goal.includes('business')) {
      primaryFactor = 'career_growth';
    } else if (goal.includes('move') || goal.includes('live') || goal.includes('relocat')) {
      primaryFactor = 'relocation';
    } else if (goal.includes('travel') || goal.includes('trip')) {
      primaryFactor = 'travel';
    }

    const motivationalAdvice = this.buildAdvice(primaryFactor, perceivedEffortRating, studentModel.targetLanguage);

    return {
      motivationScore,
      consistencyBonus,
      perceivedEffortRating,
      primaryMotivationFactor: primaryFactor,
      motivationalAdvice,
    };
  }

  private buildAdvice(
    factor: MotivationAnalysis['primaryMotivationFactor'],
    effort: MotivationAnalysis['perceivedEffortRating'],
    targetLang: string
  ): string {
    const langUpper = targetLang.toUpperCase();
    if (factor === 'career_growth') {
      return `Your professional fluency in ${langUpper} is compounding. Every complex scenario mastered directly enhances your workplace authority.`;
    }
    if (factor === 'relocation') {
      return `Building natural conversational instincts in ${langUpper} will make your transition feel like a local integration rather than a struggle.`;
    }
    return `Consistent 15-minute practice blocks produce far deeper fluency retention in ${langUpper} than sporadic weekend study sessions.`;
  }
}

export const defaultMotivationService = new MotivationService();
