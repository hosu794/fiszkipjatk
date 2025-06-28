import React from 'react';
import type { FlashcardSetSummary } from '../../types';
import { SetCard } from './SetCard';

interface FlashcardSetSelectorProps {
  availableFlashcardSets: FlashcardSetSummary[];
  loading: boolean;
  error: string | null;
  onSelectSet: (setId: string) => void;
}

export const FlashcardSetSelector: React.FC<FlashcardSetSelectorProps> = ({
  availableFlashcardSets,
  loading,
  error,
  onSelectSet
}) => {
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Ładowanie zestawów fiszek...</div>
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
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '28px',
        fontWeight: 'bold'
      }}>
        Wybierz zestaw fiszek
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {availableFlashcardSets.map((flashcardSet) => (
          <SetCard
            key={flashcardSet.id}
            flashcardSet={flashcardSet}
            onSelect={onSelectSet}
          />
        ))}
      </div>
      
      {availableFlashcardSets.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
          Brak dostępnych zestawów fiszek
        </div>
      )}
    </div>
  );
};