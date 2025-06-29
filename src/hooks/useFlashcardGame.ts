import { useState, useEffect, useCallback } from 'react';
import type { Question, AnswerOption, UserAnswer } from '../types';
import { FlashcardService } from '../services';
import { getRandomQuestion, hasQuestionsRemaining } from '../utils/questionUtils';

export const useFlashcardGame = (flashcardService: FlashcardService) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [usedQuestions, setUsedQuestions] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async (setId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedQuestions = await flashcardService.loadFlashcardSet(setId);
      setQuestions(loadedQuestions);
      setUsedQuestions([]);
      setUserAnswers([]);
      setCurrentQuestion(null);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowResults(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const selectRandomQuestion = useCallback(() => {
    if (questions.length === 0) return;
    
    const randomQuestion = getRandomQuestion(questions, usedQuestions);
    if (randomQuestion) {
      setCurrentQuestion(randomQuestion);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [questions, usedQuestions]);

  const handleAnswerSelect = (answer: AnswerOption) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (currentQuestion) {
      setUsedQuestions(prev => [...prev, currentQuestion.id]);
      
      const userAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        options: currentQuestion.options,
        selectedAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: answer === currentQuestion.correctAnswer,
        correctAnswerText: currentQuestion.options[currentQuestion.correctAnswer]
      };


      setUserAnswers(prev => [...prev, userAnswer]);
    }
  };

  const nextQuestion = () => {
    if (!hasQuestionsRemaining(questions, usedQuestions) || usedQuestions.length >= 20) {
      setShowResults(true);
      return;
    }
    selectRandomQuestion();
  };

  const resetGame = () => {
    setUsedQuestions([]);
    setUserAnswers([]);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowResults(false);
  };

  useEffect(() => {
    if (questions.length > 0) {
      selectRandomQuestion();
    }
  }, [questions, selectRandomQuestion]);

  return {
    questions,
    currentQuestion,
    selectedAnswer,
    showResult,
    usedQuestions,
    userAnswers,
    showResults,
    loading,
    error,
    loadQuestions,
    handleAnswerSelect,
    nextQuestion,
    resetGame,
    hasQuestionsRemaining: hasQuestionsRemaining(questions, usedQuestions) && usedQuestions.length < 20
  };
};