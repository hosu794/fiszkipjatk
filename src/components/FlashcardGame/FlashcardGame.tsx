import React from 'react';
import type { Question, AnswerOption, Stats } from '../../types';
import { QuestionCard } from './QuestionCard';
import { StatisticsPanel } from './StatisticsPanel';

interface FlashcardGameProps {
  currentQuestion: Question | null;
  selectedAnswer: AnswerOption | null;
  showResult: boolean;
  stats: Stats;
  accuracyPercentage: number;
  hasQuestionsRemaining: boolean;
  loading: boolean;
  error: string | null;
  onAnswerSelect: (answer: AnswerOption) => void;
  onNextQuestion: () => void;
  onReset: () => void;
  onBackToSetSelection: () => void;
}

export const FlashcardGame: React.FC<FlashcardGameProps> = ({
  currentQuestion,
  selectedAnswer,
  showResult,
  stats,
  accuracyPercentage,
  hasQuestionsRemaining,
  loading,
  error,
  onAnswerSelect,
  onNextQuestion,
  onReset,
  onBackToSetSelection
}) => {
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Ładowanie pytań...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#fee2e2',
        color: '#dc2626',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        Błąd: {error}
        <button
          onClick={onBackToSetSelection}
          style={{
            display: 'block',
            margin: '10px auto 0',
            padding: '8px 16px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Wróć do wyboru zestawu
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Brak dostępnych pytań</p>
        <button
          onClick={onBackToSetSelection}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Wróć do wyboru zestawu
        </button>
      </div>
    );
  }

  return (
    <div>
      <StatisticsPanel
        stats={stats}
        accuracyPercentage={accuracyPercentage}
        hasQuestionsRemaining={hasQuestionsRemaining}
        onReset={onReset}
        onNextQuestion={onNextQuestion}
        onBackToSetSelection={onBackToSetSelection}
      />
      
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        onAnswerSelect={onAnswerSelect}
      />
    </div>
  );
};