import React from 'react';
import type { AnswerOption } from '../../types';

interface AnswerButtonProps {
  option: AnswerOption;
  text: string;
  selected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  onClick: (option: AnswerOption) => void;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  option,
  text,
  selected,
  isCorrect,
  showResult,
  onClick
}) => {
  const getButtonClass = () => {
    if (!showResult) return 'answer-button';
    if (selected && isCorrect) return 'answer-button answer-correct';
    if (selected && !isCorrect) return 'answer-button answer-incorrect';
    return 'answer-button answer-disabled';
  };

  const handleClick = () => {
    if (!showResult) {
      onClick(option);
    }
  };

  return (
    <>
      <style>
        {`
          .answer-button {
            padding: 15px 20px;
            margin: 8px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: block;
            width: 100%;
            text-align: left;
            min-height: 60px;
            background: #f0f0f0;
            color: #333;
            cursor: pointer;
          }
          
          .answer-button:hover:not(.answer-correct):not(.answer-incorrect):not(.answer-disabled) {
            background: #e0e0e0;
            transform: translateY(-2px);
          }
          
          .answer-correct {
            background: #10b981 !important;
            color: white !important;
            cursor: default !important;
          }
          
          .answer-incorrect {
            background: #ef4444 !important;
            color: white !important;
            cursor: default !important;
          }
          
          .answer-disabled {
            background: #f0f0f0 !important;
            color: #666 !important;
            opacity: 0.6;
            cursor: default !important;
          }
        `}
      </style>
      <button
        className={getButtonClass()}
        onClick={handleClick}
      >
        <strong>{option}:</strong> {text}
      </button>
    </>
  );
};