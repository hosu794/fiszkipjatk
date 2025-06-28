import React from 'react';
import type { FlashcardSetSummary } from '../../types';
import { FileText } from 'lucide-react';

interface SetCardProps {
  flashcardSet: FlashcardSetSummary;
  onSelect: (setId: string) => void;
}

export const SetCard: React.FC<SetCardProps> = ({ flashcardSet, onSelect }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'łatwy':
        return '#4ade80';
      case 'średni':
        return '#fbbf24';
      case 'trudny':
        return '#f87171';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      onClick={() => onSelect(flashcardSet.id)}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '12px',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <FileText size={24} style={{ marginRight: '8px' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {flashcardSet.name}
          </h3>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <span style={{ 
            background: getDifficultyColor(flashcardSet.difficulty),
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {flashcardSet.difficulty}
          </span>
        </div>
        
        <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4' }}>
          Pytania: {flashcardSet.totalQuestions}
        </p>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
        {flashcardSet.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '11px'
            }}
          >
            {tag}
          </span>
        ))}
        {flashcardSet.tags.length > 3 && (
          <span style={{ fontSize: '11px', opacity: 0.7 }}>
            +{flashcardSet.tags.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};