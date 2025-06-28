import { useState } from 'react';
import type { Stats } from '../types';

export const useStatistics = () => {
  const [stats, setStats] = useState<Stats>({ correct: 0, incorrect: 0, total: 0 });

  const recordCorrectAnswer = () => {
    setStats(prev => ({
      correct: prev.correct + 1,
      incorrect: prev.incorrect,
      total: prev.total + 1
    }));
  };

  const recordIncorrectAnswer = () => {
    setStats(prev => ({
      correct: prev.correct,
      incorrect: prev.incorrect + 1,
      total: prev.total + 1
    }));
  };

  const resetStats = () => {
    setStats({ correct: 0, incorrect: 0, total: 0 });
  };

  const getAccuracyPercentage = (): number => {
    if (stats.total === 0) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  };

  return {
    stats,
    recordCorrectAnswer,
    recordIncorrectAnswer,
    resetStats,
    getAccuracyPercentage
  };
};