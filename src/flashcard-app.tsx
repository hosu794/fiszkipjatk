import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Brain, CheckCircle, XCircle, FileText } from 'lucide-react';

const FlashcardApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Przykładowe pytania jako fallback
  const defaultQuestions = [
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

  // Próba wczytania pytań z pliku przy starcie
  useEffect(() => {
    loadQuestionsFromFile();
  }, []);

  // Losowanie pytania gdy questions się zmienią
  useEffect(() => {
    if (questions.length > 0) {
      getRandomQuestion();
    }
  }, [questions]);

  const loadQuestionsFromFile = async () => {
    setLoading(true);
    setError(null);

    try {
      // Próba wczytania z public/questions.json
      const response = await fetch('/questions.json');
      if (response.ok) {
        const data = await response.json();
        if (validateQuestions(data)) {
          setQuestions(data);
          console.log(`Wczytano ${data.length} pytań z pliku questions.json`);
        } else {
          throw new Error('Nieprawidłowy format pliku JSON');
        }
      } else {
        // Jeśli nie ma pliku, użyj przykładowych pytań
        console.log('Nie znaleziono pliku questions.json, używam przykładowych pytań');
        setQuestions(defaultQuestions);
      }
    } catch (err) {
      console.log('Błąd wczytywania pliku:', err.message);
      setQuestions(defaultQuestions);
    } finally {
      setLoading(false);
    }
  };

  const validateQuestions = (data) => {
    if (!Array.isArray(data)) return false;

    return data.every(q =>
        q.id &&
        q.question &&
        q.options &&
        q.options.A && q.options.B && q.options.C && q.options.D &&
        q.correctAnswer &&
        ['A', 'B', 'C', 'D'].includes(q.correctAnswer)
    );
  };

  const getRandomQuestion = () => {
    if (questions.length === 0) return;

    const availableQuestions = questions.filter(q => !usedQuestions.includes(q.id));

    if (availableQuestions.length === 0) {
      // Jeśli wszystkie pytania zostały użyte, resetuj
      setUsedQuestions([]);
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setCurrentQuestion(availableQuestions[randomIndex]);
    }

    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.correctAnswer;

    setStats(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
      total: prev.total + 1
    }));

    if (currentQuestion) {
      setUsedQuestions(prev => [...prev, currentQuestion.id]);
    }
  };

  const handleNextQuestion = () => {
    getRandomQuestion();
  };

  const resetStats = () => {
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setUsedQuestions([]);
    getRandomQuestion();
  };

  const progressPercentage = usedQuestions.length > 0 ? (usedQuestions.length / questions.length) * 100 : 0;

  const getOptionButtonClass = (option) => {
    if (!showResult) {
      return "option-button-default";
    }

    if (option === currentQuestion.correctAnswer) {
      return "option-button-correct";
    }

    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return "option-button-incorrect";
    }

    return "option-button-disabled";
  };

  if (loading) {
    return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #4f46e5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#4b5563', fontSize: '16px' }}>Wczytywanie pytań...</p>
          </div>
        </div>
    );
  }

  return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        padding: '16px'
      }}>
        <style>{`
        .option-button-default {
          width: 100%;
          text-align: left;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          transition: all 0.2s;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .option-button-default:hover {
          border-color: #a78bfa;
          background-color: #f3f4f6;
        }
        .option-button-correct {
          width: 100%;
          text-align: left;
          padding: 16px;
          border: 2px solid #10b981;
          border-radius: 8px;
          background: #d1fae5;
          color: #065f46;
          margin-bottom: 8px;
        }
        .option-button-incorrect {
          width: 100%;
          text-align: left;
          padding: 16px;
          border: 2px solid #ef4444;
          border-radius: 8px;
          background: #fee2e2;
          color: #991b1b;
          margin-bottom: 8px;
        }
        .option-button-disabled {
          width: 100%;
          text-align: left;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
          color: #9ca3af;
          opacity: 0.6;
          margin-bottom: 8px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 24px;
          margin-bottom: 24px;
        }
        .button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          font-size: 14px;
        }
        .button-primary {
          background-color: #4f46e5;
        }
        .button-primary:hover {
          background-color: #4338ca;
        }
        .button-success {
          background-color: #10b981;
        }
        .button-success:hover {
          background-color: #059669;
        }
        .button-danger {
          background-color: #ef4444;
        }
        .button-danger:hover {
          background-color: #dc2626;
        }
        .button-secondary {
          background-color: #6b7280;
        }
        .button-secondary:hover {
          background-color: #4b5563;
        }
      `}</style>

        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <Brain color="#4f46e5" size={32} />
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Fiszki ODBYTY - Nauka
              </h1>
            </div>

            {/* Info o pytaniach */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#374151' }}>
                <FileText size={16} />
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Wczytano pytań: {questions.length}</span>
              </div>

              {error && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#b91c1c',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
              )}
            </div>

            {/* Statystyki */}
            <div className="card">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.correct}</div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>Poprawne</div>
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{stats.incorrect}</div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>Błędne</div>
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.total}</div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>Łącznie</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  <span>Postęp w rundzie</span>
                  <span>{usedQuestions.length}/{questions.length}</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                  <div
                      style={{
                        backgroundColor: '#4f46e5',
                        height: '8px',
                        borderRadius: '9999px',
                        transition: 'all 0.3s',
                        width: `${progressPercentage}%`
                      }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Karta z pytaniem */}
          {currentQuestion && (
              <div className="card">
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '24px',
                  textAlign: 'center',
                  margin: '0 0 24px 0'
                }}>
                  {currentQuestion.question}
                </h2>

                <div>
                  {Object.entries(currentQuestion.options).map(([option, text]) => (
                      <button
                          key={option}
                          onClick={() => !showResult && handleAnswerSelect(option)}
                          disabled={showResult}
                          className={getOptionButtonClass(option)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#4f46e5', marginRight: '12px', minWidth: '24px' }}>
                      {option}.
                    </span>
                          <span>{text}</span>
                          {showResult && option === currentQuestion.correctAnswer && (
                              <CheckCircle style={{ marginLeft: 'auto', color: '#10b981' }} size={20} />
                          )}
                          {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                              <XCircle style={{ marginLeft: 'auto', color: '#ef4444' }} size={20} />
                          )}
                        </div>
                      </button>
                  ))}
                </div>

                {/* Wynik */}
                {showResult && (
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '500',
                        backgroundColor: selectedAnswer === currentQuestion.correctAnswer ? '#d1fae5' : '#fee2e2',
                        color: selectedAnswer === currentQuestion.correctAnswer ? '#065f46' : '#991b1b'
                      }}>
                        {selectedAnswer === currentQuestion.correctAnswer ? (
                            <>
                              <CheckCircle size={20} />
                              Poprawna odpowiedź!
                            </>
                        ) : (
                            <>
                              <XCircle size={20} />
                              Niepoprawna odpowiedź. Prawidłowa: {currentQuestion.correctAnswer}
                            </>
                        )}
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        <button
                            onClick={handleNextQuestion}
                            className="button button-primary"
                        >
                          Następne pytanie
                        </button>
                      </div>
                    </div>
                )}
              </div>
          )}

          {/* Przyciski kontrolne */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
            <button
                onClick={getRandomQuestion}
                className="button button-primary"
            >
              <Shuffle size={20} />
              Losowe pytanie
            </button>

            <button
                onClick={resetStats}
                className="button button-secondary"
            >
              <RotateCcw size={20} />
              Reset statystyk
            </button>
          </div>

          {/* Instrukcja */}
          <div className="card">
            <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '12px', margin: '0 0 12px 0' }}>
              Jak skonfigurować plik z pytaniami:
            </h3>
            <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#1f2937' }}>Krok 1:</strong>
                <p style={{ margin: '4px 0', color: '#4b5563' }}>
                  Umieść plik <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px', color: '#1f2937' }}>questions.json</code> w folderze <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px', color: '#1f2937' }}>public/</code> twojego projektu React
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#1f2937' }}>Krok 2:</strong>
                <p style={{ margin: '4px 0', color: '#4b5563' }}>
                  Plik zostanie automatycznie wczytany przy starcie aplikacji
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#1f2937' }}>Uwaga:</strong>
                <p style={{ margin: '4px 0', color: '#4b5563' }}>
                  Jeśli plik <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px', color: '#1f2937' }}>questions.json</code> nie zostanie znaleziony, aplikacja użyje przykładowych pytań.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FlashcardApp;