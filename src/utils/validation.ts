import type { Question, FlashcardSet } from '../types';

export const isValidQuestion = (question: Question): boolean => {
  return !!(
    question.id &&
    question.question &&
    question.options &&
    question.correctAnswer &&
    ['A', 'B', 'C', 'D'].includes(question.correctAnswer)
  );
};

export const isValidFlashcardSet = (flashcardSet: FlashcardSet): boolean => {
  if (!flashcardSet.metadata || !flashcardSet.questions) {
    return false;
  }

  if (!Array.isArray(flashcardSet.questions) || flashcardSet.questions.length === 0) {
    return false;
  }

  return flashcardSet.questions.every(isValidQuestion);
};