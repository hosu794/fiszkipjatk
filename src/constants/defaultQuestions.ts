import type { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Co to jest React?",
    options: {
      A: "Framework CSS do stylowania stron",
      B: "Biblioteka JavaScript do budowania interfejsów użytkownika",
      C: "Język programowania",
      D: "System zarządzania bazą danych"
    },
    correctAnswer: "B"
  },
  {
    id: 2,
    question: "Który hook pozwala na dodanie stanu do komponentu funkcyjnego?",
    options: {
      A: "useEffect",
      B: "useContext",
      C: "useState",
      D: "useReducer"
    },
    correctAnswer: "C"
  }
];