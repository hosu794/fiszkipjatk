import React, { useState } from 'react';
import { FlashcardRepository, FlashcardService } from '../../services';
import { useFlashcardSets } from '../../hooks/useFlashcardSets';
import { useFlashcardGame } from '../../hooks/useFlashcardGame';
import { useStatistics } from '../../hooks/useStatistics';
import { FlashcardSetSelector } from '../FlashcardSetSelector';
import { FlashcardGame } from '../FlashcardGame';
import { FlashcardResults } from '../FlashcardResults';
import type { AnswerOption } from '../../types';

const flashcardRepository = new FlashcardRepository();
const flashcardService = new FlashcardService(flashcardRepository);

export const FlashcardApp: React.FC = () => {
  const [showSetSelection, setShowSetSelection] = useState<boolean>(true);
  
  const {
    availableFlashcardSets,
    loading: setsLoading,
    error: setsError,
    loadFlashcardSet
  } = useFlashcardSets(flashcardService);

  const {
    currentQuestion,
    selectedAnswer,
    showResult,
    userAnswers,
    showResults,
    loading: gameLoading,
    error: gameError,
    loadQuestions,
    handleAnswerSelect,
    nextQuestion,
    resetGame,
    hasQuestionsRemaining
  } = useFlashcardGame(flashcardService);

  const {
    stats,
    recordCorrectAnswer,
    recordIncorrectAnswer,
    resetStats,
    getAccuracyPercentage
  } = useStatistics();

  const handleSetSelection = async (setId: string) => {
    try {
      await loadFlashcardSet(setId);
      await loadQuestions(setId);
      setShowSetSelection(false);
    } catch (error) {
      console.error('Error loading flashcard set:', error);
    }
  };

  const handleAnswerSelectWithStats = (answer: AnswerOption) => {
    handleAnswerSelect(answer);
    
    if (currentQuestion) {
      if (answer === currentQuestion.correctAnswer) {
        recordCorrectAnswer();
      } else {
        recordIncorrectAnswer();
      }
    }
  };

  const handleBackToSetSelection = () => {
    setShowSetSelection(true);
    resetGame();
    resetStats();
  };

  const handleReset = () => {
    resetGame();
    resetStats();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {showSetSelection ? (
          <FlashcardSetSelector
            availableFlashcardSets={availableFlashcardSets}
            loading={setsLoading}
            error={setsError}
            onSelectSet={handleSetSelection}
          />
        ) : showResults ? (
          <FlashcardResults
            userAnswers={userAnswers}
            stats={stats}
            accuracyPercentage={getAccuracyPercentage()}
            onReset={handleReset}
            onBackToSetSelection={handleBackToSetSelection}
          />
        ) : (
          <FlashcardGame
            currentQuestion={currentQuestion}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            stats={stats}
            accuracyPercentage={getAccuracyPercentage()}
            hasQuestionsRemaining={hasQuestionsRemaining}
            userAnswers={userAnswers}
            loading={gameLoading}
            error={gameError}
            onAnswerSelect={handleAnswerSelectWithStats}
            onNextQuestion={nextQuestion}
            onReset={handleReset}
            onBackToSetSelection={handleBackToSetSelection}
          />
        )}
      </div>
    </div>
  );
};