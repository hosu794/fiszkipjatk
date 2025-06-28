import React from 'react';
import type { Question, AnswerOption } from '../../types';
import { AnswerButton } from './AnswerButton';
import { Brain } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: AnswerOption | null;
  showResult: boolean;
  onAnswerSelect: (answer: AnswerOption) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  showResult,
  onAnswerSelect
}) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        color: '#667eea'
      }}>
        <Brain size={24} style={{ marginRight: '10px' }} />
        <h2 style={{ margin: 0, fontSize: '20px' }}>Pytanie #{question.id}</h2>
      </div>
      
      <div style={{
        background: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          margin: 0,
          color: '#334155'
        }}>
          {question.question}
        </p>
      </div>
      
      <div style={{ display: 'grid', gap: '8px' }}>
        {(['A', 'B', 'C', 'D'] as AnswerOption[]).map((option) => (
          <AnswerButton
            key={option}
            option={option}
            text={question.options[option]}
            selected={selectedAnswer === option}
            isCorrect={question.correctAnswer === option}
            showResult={showResult}
            onClick={onAnswerSelect}
          />
        ))}
      </div>
    </div>
  );
};