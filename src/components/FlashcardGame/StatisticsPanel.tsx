import React from 'react';
import type { Stats, UserAnswer } from '../../types';
import { CheckCircle, XCircle, RotateCcw, Shuffle } from 'lucide-react';

interface StatisticsPanelProps {
  stats: Stats;
  accuracyPercentage: number;
  hasQuestionsRemaining: boolean;
  userAnswers: UserAnswer[];
  onReset: () => void;
  onNextQuestion: () => void;
  onBackToSetSelection: () => void;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  stats,
  accuracyPercentage,
  hasQuestionsRemaining,
  userAnswers,
  onReset,
  onNextQuestion,
  onBackToSetSelection
}) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0 }}>Statystyki</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onBackToSetSelection}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Zmień zestaw
          </button>
          <button
            onClick={onReset}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <CheckCircle size={20} color="#10b981" />
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.correct}</span>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Poprawne</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <XCircle size={20} color="#ef4444" />
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.incorrect}</span>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Błędne</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}/20</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Postęp</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{accuracyPercentage}%</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Celność</div>
        </div>
      </div>
      
      {userAnswers.length >= 20 && userAnswers.filter(answer => !answer.isCorrect).length > 0 && (
        <div style={{
          marginBottom: '15px',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Błędne odpowiedzi - poprawne to:</h4>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {userAnswers
              .filter(answer => !answer.isCorrect)
              .map((answer: UserAnswer) => (
                <div
                  key={answer.questionId}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {answer.question}
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gap: '4px',
                    marginBottom: '8px'
                  }}>
                      {(['A', 'B', 'C', 'D'] as const).map((option) => {
                          // Bezpieczne odczytanie opcji z type assertion
                          const optionText = answer.options[option as keyof typeof answer.options];

                          return (
                              <div
                                  key={option}
                                  style={{
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      background:
                                          option === answer.correctAnswer
                                              ? 'rgba(16, 185, 129, 0.3)'
                                              : option === answer.selectedAnswer
                                                  ? 'rgba(239, 68, 68, 0.3)'
                                                  : 'rgba(255, 255, 255, 0.2)',
                                      border:
                                          option === answer.correctAnswer
                                              ? '1px solid rgba(16, 185, 129, 0.5)'
                                              : option === answer.selectedAnswer
                                                  ? '1px solid rgba(239, 68, 68, 0.5)'
                                                  : '1px solid rgba(255, 255, 255, 0.3)',
                                      fontWeight:
                                          option === answer.correctAnswer || option === answer.selectedAnswer
                                              ? 'bold'
                                              : 'normal'
                                  }}
                              >
                                  {option}) {optionText}
                                  {option === answer.correctAnswer && ' ✓'}
                                  {option === answer.selectedAnswer && option !== answer.correctAnswer && ' ✗'}
                              </div>
                          );
                      })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      <button
        onClick={onNextQuestion}
        style={{
          background: hasQuestionsRemaining ? '#10b981' : '#f59e0b',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Shuffle size={20} />
        {hasQuestionsRemaining ? 'Następne pytanie' : 'Nowy cykl pytań'}
      </button>
    </div>
  );
};