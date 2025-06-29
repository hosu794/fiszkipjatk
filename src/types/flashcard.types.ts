export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOptions;
  correctAnswer: AnswerOption;
}

export interface FlashcardMetadata {
  id: string;
  name: string;
  description: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  tags: string[];
  created: string;
  version: string;
}

export interface FlashcardSet {
  metadata: FlashcardMetadata;
  questions: Question[];
}

export interface FlashcardSetSummary {
  id: string;
  filename: string;
  name: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  tags: string[];
}

export interface FlashcardIndex {
  availableFlashcardSets: FlashcardSetSummary[];
}

export interface Stats {
  correct: number;
  incorrect: number;
  total: number;
}

export type AnswerOption = 'A' | 'B' | 'C' | 'D';

export interface UserAnswer {
  questionId: number;
  question: string;
  options: QuestionOptions;
  selectedAnswer: AnswerOption;
  correctAnswer: AnswerOption;
  correctAnswerText: string;
  isCorrect: boolean;
}

export interface GameState {
  currentQuestion: Question | null;
  selectedAnswer: AnswerOption | null;
  showResult: boolean;
  usedQuestions: number[];
  stats: Stats;
}