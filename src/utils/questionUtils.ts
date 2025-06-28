import type { Question } from '../types';

export const getRandomQuestion = (questions: Question[], usedQuestions: number[]): Question | null => {
  const availableQuestions = questions.filter(q => !usedQuestions.includes(q.id));
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
};

export const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const resetQuestionCycle = (): number[] => {
  return [];
};

export const hasQuestionsRemaining = (questions: Question[], usedQuestions: number[]): boolean => {
  return questions.some(q => !usedQuestions.includes(q.id));
};