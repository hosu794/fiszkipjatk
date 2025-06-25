import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Brain, CheckCircle, XCircle, FileText } from 'lucide-react';

interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface Question {
  id: number;
  question: string;
  options: QuestionOptions;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

interface FlashcardMetadata {
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

interface FlashcardSet {
  metadata: FlashcardMetadata;
  questions: Question[];
}

interface FlashcardSetSummary {
  id: string;
  filename: string;
  name: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  tags: string[];
}

interface FlashcardIndex {
  availableFlashcardSets: FlashcardSetSummary[];
}

interface Stats {
  correct: number;
  incorrect: number;
  total: number;
}

type AnswerOption = 'A' | 'B' | 'C' | 'D';

const FlashcardApp: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [usedQuestions, setUsedQuestions] = useState<number[]>([]);
  const [stats, setStats] = useState<Stats>({ correct: 0, incorrect: 0, total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFlashcardSets, setAvailableFlashcardSets] = useState<FlashcardSetSummary[]>([]);
  const [currentFlashcardSet, setCurrentFlashcardSet] = useState<FlashcardSet | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [showSetSelection, setShowSetSelection] = useState<boolean>(true);

  const defaultQuestions: Question[] = [
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

  // Próba wczytania dostępnych zestawów przy starcie
  useEffect(() => {
    loadAvailableFlashcardSets();
  }, []);

  // Losowanie pytania gdy questions się zmienią
  useEffect(() => {
    if (questions.length > 0) {
      getRandomQuestion();
    }
  }, [questions]);

  // Wczytanie pytań gdy zestaw zostanie wybrany
  useEffect(() => {
    if (selectedSetId) {
      loadSelectedFlashcardSet(selectedSetId);
    }
  }, [selectedSetId]);

  // Funkcja zwracająca style CSS
  const getStyles = () => `
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
  `;

  const loadAvailableFlashcardSets = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: Response = await fetch('/flashcards/index.json');
      if (response.ok) {
        const data: unknown = await response.json();
        if (validateFlashcardIndex(data)) {
          setAvailableFlashcardSets((data as FlashcardIndex).availableFlashcardSets);
          console.log(`Wczytano ${(data as FlashcardIndex).availableFlashcardSets.length} dostępnych zestawów fiszek`);
        } else {
          throw new Error('Nieprawidłowy format pliku index.json');
        }
      } else {
        // Jeśli nie ma pliku, użyj starych domyślnych pytań
        console.log('Nie znaleziono pliku index.json, używam domyślnych pytań');
        setQuestions(defaultQuestions);
        setShowSetSelection(false);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      console.log('Błąd wczytywania dostępnych zestawów:', errorMessage);
      setQuestions(defaultQuestions);
      setShowSetSelection(false);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedFlashcardSet = async (setId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: Response = await fetch(`/flashcards/${setId}.json`);
      if (response.ok) {
        const data: unknown = await response.json();
        if (validateFlashcardSet(data)) {
          const flashcardSet = data as FlashcardSet;
          setCurrentFlashcardSet(flashcardSet);
          setQuestions(flashcardSet.questions);
          setShowSetSelection(false);
          console.log(`Wczytano zestaw: ${flashcardSet.metadata.name} (${flashcardSet.questions.length} pytań)`);
        } else {
          throw new Error('Nieprawidłowy format zestawu fiszek');
        }
      } else {
        throw new Error('Nie można wczytać wybranego zestawu fiszek');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Błąd wczytywania zestawu: ${errorMessage}`);
      console.log('Błąd wczytywania zestawu:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateQuestions = (data: unknown): data is Question[] => {
    if (!Array.isArray(data)) return false;

    return data.every((q: unknown): q is Question => {
      if (typeof q !== 'object' || q === null) return false;

      const question = q as Record<string, unknown>;

      return (
          typeof question.id === 'number' &&
          typeof question.question === 'string' &&
          typeof question.options === 'object' &&
          question.options !== null &&
          typeof (question.options as Record<string, unknown>).A === 'string' &&
          typeof (question.options as Record<string, unknown>).B === 'string' &&
          typeof (question.options as Record<string, unknown>).C === 'string' &&
          typeof (question.options as Record<string, unknown>).D === 'string' &&
          typeof question.correctAnswer === 'string' &&
          ['A', 'B', 'C', 'D'].includes(question.correctAnswer as string)
      );
    });
  };

  const validateFlashcardIndex = (data: unknown): data is FlashcardIndex => {
    if (typeof data !== 'object' || data === null) return false;
    const index = data as Record<string, unknown>;
    return Array.isArray(index.availableFlashcardSets);
  };

  const validateFlashcardSet = (data: unknown): data is FlashcardSet => {
    if (typeof data !== 'object' || data === null) return false;
    const set = data as Record<string, unknown>;
    return (
      typeof set.metadata === 'object' &&
      set.metadata !== null &&
      Array.isArray(set.questions) &&
      validateQuestions(set.questions)
    );
  };

  const getRandomQuestion = (): void => {
    if (questions.length === 0) return;

    const availableQuestions: Question[] = questions.filter(q => !usedQuestions.includes(q.id));

    if (availableQuestions.length === 0) {
      // Jeśli wszystkie pytania zostały użyte, resetuj
      setUsedQuestions([]);
      const randomIndex: number = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
    } else {
      const randomIndex: number = Math.floor(Math.random() * availableQuestions.length);
      setCurrentQuestion(availableQuestions[randomIndex]);
    }

    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: AnswerOption): void => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (!currentQuestion) return;

    const isCorrect: boolean = answer === currentQuestion.correctAnswer;

    setStats(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
      total: prev.total + 1
    }));

    setUsedQuestions(prev => [...prev, currentQuestion.id]);
  };

  const handleNextQuestion = (): void => {
    getRandomQuestion();
  };

  const resetStats = (): void => {
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setUsedQuestions([]);
    getRandomQuestion();
  };

  const handleSetSelection = (setId: string): void => {
    setSelectedSetId(setId);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setUsedQuestions([]);
  };

  const handleBackToSetSelection = (): void => {
    setShowSetSelection(true);
    setSelectedSetId(null);
    setCurrentFlashcardSet(null);
    setQuestions([]);
    setCurrentQuestion(null);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setUsedQuestions([]);
  };

  const progressPercentage: number = usedQuestions.length > 0 ? (usedQuestions.length / questions.length) * 100 : 0;

  const getOptionButtonClass = (option: AnswerOption): string => {
    if (!showResult) {
      return "option-button-default";
    }

    if (currentQuestion && option === currentQuestion.correctAnswer) {
      return "option-button-correct";
    }

    if (option === selectedAnswer && currentQuestion && option !== currentQuestion.correctAnswer) {
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

  // Komponent wyboru zestawu fiszek
  const renderSetSelection = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      padding: '16px'
    }}>
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <Brain color="#4f46e5" size={32} />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Wybierz zestaw fiszek
            </h1>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {availableFlashcardSets.map((set) => (
            <div key={set.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                 onClick={() => handleSetSelection(set.id)}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-2px)';
                   e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(0, 0, 0, 0.1)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {set.name}
                </h3>
                <span style={{
                  backgroundColor: set.difficulty === 'łatwy' ? '#dcfce7' : set.difficulty === 'średni' ? '#fef3c7' : '#fee2e2',
                  color: set.difficulty === 'łatwy' ? '#166534' : set.difficulty === 'średni' ? '#92400e' : '#991b1b',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {set.difficulty}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                <span>{set.totalQuestions} pytań</span>
                <span>•</span>
                <span>{set.subject}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {set.tags.map((tag) => (
                  <span key={tag} style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (showSetSelection) {
    return (
      <>
        <style>{getStyles()}</style>
        {renderSetSelection()}
      </>
    );
  }

  return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        padding: '16px'
      }}>
        <style>{getStyles()}</style>


        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <Brain color="#4f46e5" size={32} />
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Fiszki ABCD - Nauka
              </h1>
            </div>

            {/* Info o zestawie */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
                  <FileText size={16} />
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>
                    {currentFlashcardSet ? currentFlashcardSet.metadata.name : `Pytania: ${questions.length}`}
                  </span>
                </div>
                <button
                  onClick={handleBackToSetSelection}
                  className="button button-secondary"
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Zmień zestaw
                </button>
              </div>
              
              {currentFlashcardSet && (
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  {currentFlashcardSet.metadata.description}
                </div>
              )}
              
              {currentFlashcardSet && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {currentFlashcardSet.metadata.tags.map((tag) => (
                    <span key={tag} style={{
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

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
                  {(Object.entries(currentQuestion.options) as [AnswerOption, string][]).map(([option, text]) => (
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

        </div>
      </div>
  );
};

export default FlashcardApp;