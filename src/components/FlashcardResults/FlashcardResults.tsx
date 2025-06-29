import React from 'react';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import type { UserAnswer, Stats } from '../../types';

interface FlashcardResultsProps {
  userAnswers: UserAnswer[];
  stats: Stats;
  accuracyPercentage: number;
  onReset: () => void;
  onBackToSetSelection: () => void;
}

export const FlashcardResults: React.FC<FlashcardResultsProps> = ({
  userAnswers,
  stats,
  accuracyPercentage,
  onReset,
  onBackToSetSelection
}) => {
  return (
    <div style={{
      textAlign: 'center' as const,
      padding: '20px'
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: '20px'
      }}>
        Wyniki zestawu
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        borderRadius: '12px'
      }}>
        <div style={{
          textAlign: 'center' as const
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#38a169'
          }}>
            {stats.correct}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#4a5568'
          }}>
            Poprawne
          </div>
        </div>

        <div style={{
          textAlign: 'center' as const
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#e53e3e'
          }}>
            {stats.incorrect}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#4a5568'
          }}>
            Błędne
          </div>
        </div>

        <div style={{
          textAlign: 'center' as const
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3182ce'
          }}>
            {accuracyPercentage}%
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#4a5568'
          }}>
            Dokładność
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'left' as const,
        maxHeight: '500px',
        overflowY: 'auto' as const,
        marginBottom: '30px'
      }}>
        {userAnswers.filter(answer => answer.isCorrect).length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#38a169',
              marginBottom: '15px',
              textAlign: 'center' as const,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={20} />
              Poprawne odpowiedzi ({userAnswers.filter(answer => answer.isCorrect).length})
            </h3>

            {userAnswers.filter(answer => answer.isCorrect).map((answer) => (
              <div
                key={answer.questionId}
                style={{
                  background: '#f0fff4',
                  border: '2px solid #68d391',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '15px'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <CheckCircle size={20} style={{ color: '#38a169', marginRight: '10px' }} />
                  <span style={{
                    fontWeight: 'bold',
                    color: '#2d3748',
                    fontSize: '1rem'
                  }}>
                    Pytanie #{answer.questionId}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.95rem',
                  color: '#2d3748',
                  marginBottom: '10px',
                  lineHeight: '1.4'
                }}>
                  {answer.question}
                </div>

                <div style={{
                  fontSize: '0.9rem',
                  color: '#38a169',
                  fontWeight: 'bold'
                }}>
                  Odpowiedź: {answer.selectedAnswer}) {answer.correctAnswerText}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Incorrect Answers Section */}
        {userAnswers.filter(answer => !answer.isCorrect).length > 0 && (
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#e53e3e',
              marginBottom: '15px',
              textAlign: 'center' as const,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <XCircle size={20} />
              Błędne odpowiedzi ({userAnswers.filter(answer => !answer.isCorrect).length})
            </h3>

            {userAnswers.filter(answer => !answer.isCorrect).map((answer) => (
              <div
                key={answer.questionId}
                style={{
                  background: '#fff5f5',
                  border: '2px solid #fc8181',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '15px'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <XCircle size={20} style={{ color: '#e53e3e', marginRight: '10px' }} />
                  <span style={{
                    fontWeight: 'bold',
                    color: '#2d3748',
                    fontSize: '1rem'
                  }}>
                    Pytanie #{answer.questionId}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.95rem',
                  color: '#2d3748',
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  {answer.question}
                </div>

                <div style={{
                  display: 'grid',
                  gap: '8px',
                  fontSize: '0.9rem',
                  marginTop: '12px'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#4a5568',
                    marginBottom: '8px'
                  }}>
                    Wszystkie opcje odpowiedzi:
                  </div>
                  
                  {(['A', 'B', 'C', 'D'] as const).map((option) => (
                    <div
                      key={option}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        background: 
                          option === answer.correctAnswer 
                            ? '#f0fff4' 
                            : option === answer.selectedAnswer 
                              ? '#fff5f5'
                              : '#f7fafc',
                        border: 
                          option === answer.correctAnswer 
                            ? '2px solid #68d391' 
                            : option === answer.selectedAnswer 
                              ? '2px solid #fc8181'
                              : '1px solid #e2e8f0',
                        color: '#2d3748',
                        fontWeight: 
                          option === answer.correctAnswer || option === answer.selectedAnswer 
                            ? 'bold' 
                            : 'normal'
                      }}
                    >
                      <span style={{
                        color: option === answer.correctAnswer ? '#38a169' : option === answer.selectedAnswer ? '#e53e3e' : '#4a5568'
                      }}>
                        {option}) {answer.options[option]}
                      </span>
                      {option === answer.correctAnswer && (
                        <span style={{
                          marginLeft: '8px',
                          color: '#38a169',
                          fontWeight: 'bold'
                        }}>
                          ✓ POPRAWNA
                        </span>
                      )}
                      {option === answer.selectedAnswer && option !== answer.correctAnswer && (
                        <span style={{
                          marginLeft: '8px',
                          color: '#e53e3e',
                          fontWeight: 'bold'
                        }}>
                          ✗ TWOJA
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap' as const
      }}>
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          <RotateCcw size={18} />
          Spróbuj ponownie
        </button>

        <button
          onClick={onBackToSetSelection}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(113, 128, 150, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(113, 128, 150, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(113, 128, 150, 0.4)';
          }}
        >
          <ArrowLeft size={18} />
          Wybierz inny zestaw
        </button>
      </div>
    </div>
  );
};